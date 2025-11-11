import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, Plus, Copy, Trash2, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  lastUsed: string;
  created: string;
  status: 'active' | 'revoked';
}

export const ApiKeysScreen = () => {
  const navigate = useNavigate();
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const apiKeys: ApiKey[] = [
    {
      id: '1',
      name: 'Production API',
      key: 'sk_live_51NXxxx...xxxxx',
      lastUsed: '2024-02-15T10:30:00Z',
      created: '2024-01-10',
      status: 'active',
    },
    {
      id: '2',
      name: 'Development API',
      key: 'sk_test_51NXxxx...xxxxx',
      lastUsed: '2024-02-14T15:20:00Z',
      created: '2024-01-15',
      status: 'active',
    },
  ];

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
  };

  return (
    <div className="min-h-screen bg-[#FEFFFE]">
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">API Keys</h1>
          <p className="text-sm text-gray-500 mt-2">Manage your API keys for programmatic access</p>
        </div>

        {/* Warning Banner */}
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-amber-900">Keep your API keys secure</h3>
            <p className="text-xs text-amber-700 mt-1">
              Never share your secret keys in publicly accessible areas such as GitHub, client-side code, and so forth.
            </p>
          </div>
        </div>

        {/* Create New Key Button */}
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => setShowNewKeyModal(true)}
            className="bg-gradient-to-r from-[#635bff] to-[#5045e5] hover:from-[#5045e5] hover:to-[#3d38d1] text-white rounded-lg h-10 px-5 text-[13px] font-semibold shadow-lg shadow-[#635bff]/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Key
          </Button>
        </div>

        {/* API Keys List */}
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center flex-shrink-0">
                    <Key className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{apiKey.name}</h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                          apiKey.status === 'active'
                            ? 'bg-green-50 text-green-700 ring-1 ring-green-200/50'
                            : 'bg-gray-50 text-gray-700 ring-1 ring-gray-200/50'
                        }`}
                      >
                        {apiKey.status.charAt(0).toUpperCase() + apiKey.status.slice(1)}
                      </span>
                    </div>

                    {/* API Key Display */}
                    <div className="flex items-center gap-2 mb-3">
                      <code className="flex-1 text-sm font-mono bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-gray-700">
                        {visibleKeys.has(apiKey.id) ? apiKey.key : apiKey.key.replace(/(?<=.{12}).*(?=.{5})/, '...')}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="h-9 w-9 p-0"
                      >
                        {visibleKeys.has(apiKey.id) ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(apiKey.key)}
                        className="h-9 w-9 p-0"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>
                        Created{' '}
                        {new Date(apiKey.created).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span>
                        Last used{' '}
                        {new Date(apiKey.lastUsed).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 border-red-200 h-9 px-4"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Revoke
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* New Key Modal */}
        {showNewKeyModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                  <Key className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Create New API Key</h2>
                  <p className="text-sm text-gray-500">Give your API key a descriptive name</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="key-name" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Key Name
                  </Label>
                  <Input
                    id="key-name"
                    placeholder="e.g., Production API, Mobile App"
                    className="h-11 border-gray-300 rounded-lg"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200/60 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    <strong>Note:</strong> Store your API key securely. You'll only be able to view it once after creation.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowNewKeyModal(false)}
                  className="flex-1 h-11 border-gray-300 rounded-lg"
                >
                  Cancel
                </Button>
                <Button className="flex-1 h-11 bg-gradient-to-r from-[#635bff] to-[#5045e5] hover:from-[#5045e5] hover:to-[#3d38d1] text-white rounded-lg font-semibold shadow-lg shadow-[#635bff]/20">
                  Create Key
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
