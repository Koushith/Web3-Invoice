import { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Filter, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableSkeleton, CardSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { useNavigate } from 'react-router-dom';
import { useGetInvoicesQuery } from '@/services/api.service';
import { format } from 'date-fns';
import { auth } from '@/lib/firebase';

export const InvoicesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAuthReady, setIsAuthReady] = useState(false);
  const navigate = useNavigate();

  // Wait for Firebase auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthReady(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch invoices
  const { data, isLoading, error } = useGetInvoicesQuery(
    {
      search: searchQuery,
      status: statusFilter === 'all' ? undefined : statusFilter,
      page: 1,
      limit: 100,
    },
    {
      skip: !isAuthReady,
    }
  );

  const invoices = data?.data || [];

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-700 border-gray-200',
      sent: 'bg-blue-50 text-blue-700 border-blue-200',
      viewed: 'bg-purple-50 text-purple-700 border-purple-200',
      paid: 'bg-green-50 text-green-700 border-green-200',
      partial: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      overdue: 'bg-red-50 text-red-700 border-red-200',
      cancelled: 'bg-gray-100 text-gray-500 border-gray-300',
    };

    return badges[status as keyof typeof badges] || badges.draft;
  };

  return (
    <div className="min-h-screen bg-[#FEFFFE]">
      <div className="border-b border-gray-200 md:border-b">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="py-4 md:py-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Invoices</h1>
                {data && (
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    {data.pagination.total} {data.pagination.total === 1 ? 'invoice' : 'invoices'}
                  </p>
                )}
              </div>
              <Button
                onClick={() => navigate('/invoices/new')}
                className="bg-[#635bff] hover:bg-[#0a2540] text-white text-sm font-medium px-3 md:px-4 h-9 rounded-md transition-colors active:scale-95"
              >
                <Plus className="w-4 h-4 md:mr-1.5" />
                <span className="hidden md:inline">New</span>
              </Button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex items-center gap-2 md:gap-3 pb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search"
                className="h-9 w-full pl-9 pr-3 text-sm bg-white border border-gray-300 rounded-md
                  focus-visible:ring-1 focus-visible:ring-[#635bff] focus-visible:border-[#635bff]
                  placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[100px] md:w-[140px] text-xs md:text-sm border-gray-300 rounded-md">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="h-9 px-2 md:px-3 text-sm font-medium border-gray-300 rounded-md hover:bg-gray-50 hidden sm:flex"
            >
              <Filter className="w-4 h-4 md:mr-1.5" />
              <span className="hidden md:inline">More filters</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto">
        {/* Loading State */}
        {(!isAuthReady || isLoading) && (
          <div className="mt-6">
            <div className="hidden md:block">
              <TableSkeleton rows={5} />
            </div>
            <div className="md:hidden">
              <CardSkeleton count={3} />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <EmptyState
            icon={FileText}
            title="Failed to load invoices"
            description="There was an error loading your invoices. Please try again later."
          />
        )}

        {/* Empty State */}
        {isAuthReady && !isLoading && !error && invoices.length === 0 && (
          <EmptyState
            icon={FileText}
            title={searchQuery ? 'No invoices found' : 'No invoices yet'}
            description={
              searchQuery
                ? 'Try adjusting your search to find what you are looking for.'
                : 'Get started by creating your first invoice and send it to your customers.'
            }
            actionLabel={!searchQuery ? 'Create invoice' : undefined}
            onAction={!searchQuery ? () => navigate('/invoices/new') : undefined}
          />
        )}

        {/* Desktop Table View */}
        {isAuthReady && !isLoading && !error && invoices.length > 0 && (
          <>
            {/* Desktop Table */}
            <div className="mt-6 hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Number
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount due
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due date
                      </th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoices.map((invoice: any) => (
                      <tr
                        key={invoice._id || invoice.id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/invoices/${invoice._id || invoice.id}`)}
                      >
                        <td className="px-3 py-4">
                          <div className="text-sm font-medium text-[#635bff] hover:text-[#0a2540]">
                            {invoice.invoiceNumber}
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <div className="text-sm text-gray-900">
                            {invoice.customerId?.name || invoice.customerId?.company || '—'}
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${getStatusBadge(
                              invoice.status
                            )}`}
                          >
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-right">
                          <div className="text-sm font-medium text-gray-900">
                            ${invoice.total.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </td>
                        <td className="px-3 py-4 text-right">
                          <div className="text-sm font-medium text-gray-900">
                            ${invoice.amountDue.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <div className="text-sm text-gray-600">
                            {invoice.dueDate ? format(new Date(invoice.dueDate), 'MMM d, yyyy') : '—'}
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add menu logic here
                            }}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Results count */}
              <div className="mt-6 pb-8 text-sm text-gray-500">
                Showing {invoices.length} {invoices.length === 1 ? 'result' : 'results'}
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden mt-4 space-y-3">
              {invoices.map((invoice: any) => (
                <div
                  key={invoice._id || invoice.id}
                  onClick={() => navigate(`/invoices/${invoice._id || invoice.id}`)}
                  className="bg-white border border-gray-200 rounded-lg p-4 active:scale-98 transition-transform cursor-pointer animate-slide-up"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-[#635bff]">
                        {invoice.invoiceNumber}
                      </div>
                      <div className="text-sm text-gray-900 mt-0.5">
                        {invoice.customerId?.name || invoice.customerId?.company || '—'}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${getStatusBadge(
                        invoice.status
                      )}`}
                    >
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Amount</div>
                      <div className="text-sm font-semibold text-gray-900">
                        ${invoice.total.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Amount Due</div>
                      <div className="text-sm font-semibold text-gray-900">
                        ${invoice.amountDue.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  {invoice.dueDate && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Due {format(new Date(invoice.dueDate), 'MMM d, yyyy')}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Results count */}
              <div className="py-4 text-xs text-center text-gray-500">
                Showing {invoices.length} {invoices.length === 1 ? 'result' : 'results'}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
