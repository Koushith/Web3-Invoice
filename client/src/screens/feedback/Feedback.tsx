import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Bug, Lightbulb, AlertCircle, Loader2, ArrowUp, Clock, Search, Star } from 'lucide-react';
import { GeneralFeedbackDialog } from '@/components/feedback/GeneralFeedbackDialog';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';

interface GitHubIssue {
  number?: number;
  _id?: string;
  title: string;
  body?: string | null;
  description?: string;
  state: string;
  status?: string;
  labels?: Array<{ name: string; color: string }>;
  type?: string;
  created_at?: string;
  createdAt?: string;
  comments?: number;
  upvotes?: number;
  rating?: number;
  html_url?: string;
  user?: {
    login: string;
    avatar_url: string;
  };
  userName?: string;
  source: 'github' | 'database';
}

type FilterType = 'all' | 'open' | 'closed';

export const FeedbackScreen = () => {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch GitHub issues
      const githubResponse = await fetch(
        'https://api.github.com/repos/Koushith/DefinVoice/issues?state=all&per_page=100',
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      // Fetch database feedback
      const dbResponse = await fetch(`${import.meta.env.VITE_API_URL}/feedback`);

      let githubIssues: GitHubIssue[] = [];
      let dbFeedback: GitHubIssue[] = [];

      if (githubResponse.ok) {
        const githubData = await githubResponse.json();
        githubIssues = githubData.map((issue: any) => ({
          ...issue,
          source: 'github',
        }));
      }

      if (dbResponse.ok) {
        const dbData = await dbResponse.json();
        dbFeedback = dbData.data.map((feedback: any) => ({
          ...feedback,
          state: feedback.status,
          source: 'database',
          body: feedback.description,
          created_at: feedback.createdAt,
          html_url: undefined, // Database feedback has no URL
          user: {
            login: feedback.userName,
            avatar_url: '',
          },
        }));
      }

      // Combine and sort by date
      const allIssues = [...githubIssues, ...dbFeedback].sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0).getTime();
        const dateB = new Date(b.created_at || b.createdAt || 0).getTime();
        return dateB - dateA;
      });

      setIssues(allIssues);
    } catch (err) {
      setError('Failed to load feedback. Please try again later.');
      console.error('Error fetching feedback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpvote = async (issue: GitHubIssue, e: React.MouseEvent) => {
    e.stopPropagation();

    // Only allow upvoting database feedback
    if (issue.source !== 'database' || !issue._id) {
      toast.error('Cannot upvote GitHub issues');
      return;
    }

    // Check if user is authenticated
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error('Please sign in to upvote', {
        description: 'You need to be logged in to upvote feedback.',
      });
      return;
    }

    try {
      // Get Firebase ID token
      const token = await currentUser.getIdToken();

      // Make upvote request
      const response = await fetch(`${import.meta.env.VITE_API_URL}/feedback/${issue._id}/upvote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to upvote');
      }

      // Update local state optimistically
      setIssues((prevIssues) =>
        prevIssues.map((i) =>
          i._id === issue._id
            ? { ...i, upvotes: (i.upvotes || 0) + 1 }
            : i
        )
      );

      toast.success('Upvoted successfully!');
    } catch (error) {
      console.error('Error upvoting feedback:', error);
      toast.error('Failed to upvote', {
        description: error instanceof Error ? error.message : 'Please try again later.',
      });
    }
  };

  const getIssueType = (issue: GitHubIssue) => {
    // For database feedback, use the type field directly
    if (issue.source === 'database' && issue.type) {
      return issue.type;
    }

    // For GitHub issues, check labels
    if (issue.labels && issue.labels.length > 0) {
      const labelNames = issue.labels.map((l) => l.name.toLowerCase());
      if (labelNames.includes('bug')) return 'bug';
      if (labelNames.includes('enhancement')) return 'enhancement';
      if (labelNames.includes('feature')) return 'feature';
    }

    return 'feedback';
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'bug':
        return <Bug className="h-4 w-4 text-red-600" />;
      case 'enhancement':
      case 'feature':
        return <Lightbulb className="h-4 w-4 text-blue-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-green-600" />;
    }
  };

  const getIconBgColor = (type: string) => {
    switch (type) {
      case 'bug':
        return 'bg-red-50';
      case 'enhancement':
      case 'feature':
        return 'bg-blue-50';
      default:
        return 'bg-green-50';
    }
  };

  const filteredIssues = issues.filter((issue) => {
    // Filter by status
    const matchesFilter = activeFilter === 'all' || issue.state === activeFilter;

    // Filter by search query
    const matchesSearch =
      !searchQuery ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.body?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'today';
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 14) return '1 week ago';
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Feedback & Support</h1>
        <p className="text-gray-500 text-sm mt-1 md:mt-2">
          Help us improve DefInvoice by reporting bugs or suggesting features
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        <button
          onClick={() =>
            window.open(
              'https://github.com/Koushith/DefinVoice/issues/new?labels=bug&template=bug_report.md',
              '_blank'
            )
          }
          className="p-6 border-2 rounded-2xl md:rounded-xl transition-all text-left bg-red-50 border-red-200 hover:bg-red-100 active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 text-red-600">
            <Bug className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Bug Report</h3>
          <p className="text-sm text-gray-600">Report a bug or issue</p>
        </button>

        <button
          onClick={() =>
            window.open(
              'https://github.com/Koushith/DefinVoice/issues/new?labels=feature&template=feature_request.md',
              '_blank'
            )
          }
          className="p-6 border-2 rounded-2xl md:rounded-xl transition-all text-left bg-blue-50 border-blue-200 hover:bg-blue-100 active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 text-blue-600">
            <Lightbulb className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Feature Request</h3>
          <p className="text-sm text-gray-600">Suggest a new feature</p>
        </button>

        <button
          onClick={() => setIsFeedbackDialogOpen(true)}
          className="p-6 border-2 rounded-2xl md:rounded-xl transition-all text-left bg-green-50 border-green-200 hover:bg-green-100 active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 text-green-600">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">General Feedback</h3>
          <p className="text-sm text-gray-600">Share your thoughts</p>
        </button>
      </div>

      {/* Community Feedback Section */}
      <div className="mt-8 md:mt-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Community Feedback</h2>
            <p className="text-xs text-gray-500 mt-1">See what other users are requesting and reporting</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('open')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeFilter === 'open' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Open
            </button>
            <button
              onClick={() => setActiveFilter('closed')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeFilter === 'closed'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Closed
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search feedback..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">Error loading issues</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={fetchIssues} className="text-red-600 hover:text-red-700">
              Retry
            </Button>
          </div>
        )}

        {/* Issues List */}
        {!isLoading && !error && (
          <div className="space-y-3">
            {filteredIssues.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-1">No feedback found</h3>
                <p className="text-sm text-gray-500">Be the first to share your feedback</p>
              </div>
            ) : (
              filteredIssues.map((issue) => {
                const issueType = getIssueType(issue);
                const isGithubIssue = issue.source === 'github';
                const handleClick = () => {
                  if (isGithubIssue && issue.html_url) {
                    window.open(issue.html_url, '_blank');
                  }
                };
                return (
                  <div
                    key={issue._id || issue.number}
                    onClick={isGithubIssue ? handleClick : undefined}
                    className={`bg-white border border-gray-200 rounded-2xl md:rounded-xl shadow-sm md:shadow-none p-4 md:p-5 hover:shadow-md transition-shadow ${isGithubIssue ? 'cursor-pointer' : ''}`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg ${getIconBgColor(
                          issueType
                        )} flex items-center justify-center flex-shrink-0`}
                      >
                        {getIssueIcon(issueType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-sm font-semibold text-gray-900 leading-snug">{issue.title}</h3>
                          <span className="text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 bg-gray-100 text-gray-700 capitalize">
                            {issue.state}
                          </span>
                        </div>
                        {issue.rating && issue.rating > 0 && (
                          <div className="flex items-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= issue.rating!
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-gray-200 text-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-2">
                          {issue.body || issue.description || issue.title}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {getRelativeTime(issue.created_at || issue.createdAt || '')}
                          </span>
                          <span>by {issue.user?.login || issue.userName || 'Unknown'}</span>
                          {issue.source === 'database' ? (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleUpvote(issue, e);
                              }}
                              className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                              title="Upvote this feedback"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                              <span className="font-medium">{issue.upvotes || 0}</span>
                            </button>
                          ) : (
                            <span className="flex items-center gap-1.5 px-2 py-1 text-gray-500">
                              <ArrowUp className="h-3.5 w-3.5" />
                              <span className="font-medium">{issue.comments || 0}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* General Feedback Dialog */}
      <GeneralFeedbackDialog
        open={isFeedbackDialogOpen}
        onClose={() => setIsFeedbackDialogOpen(false)}
        onSuccess={fetchIssues}
      />
    </div>
  );
};
