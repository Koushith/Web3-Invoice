import { useState, useEffect } from 'react';
import { Plus, Search, Loader2, MoreVertical, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useGetCustomersQuery } from '@/services/api.service';
import { format } from 'date-fns';
import { auth } from '@/lib/firebase';

export const CustomersScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthReady, setIsAuthReady] = useState(false);
  const navigate = useNavigate();

  // Wait for Firebase auth to be ready
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthReady(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch customers from API only when auth is ready
  const { data, isLoading, error } = useGetCustomersQuery(
    {
      search: searchQuery,
      page: 1,
      limit: 100,
    },
    {
      skip: !isAuthReady,
    }
  );

  const customers = data?.data || [];

  return (
    <div className="min-h-screen bg-[#FEFFFE]">
      <div className="border-b border-gray-200 md:border-b">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="py-4 md:py-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Customers</h1>
                {data && (
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    {data.pagination.total} {data.pagination.total === 1 ? 'customer' : 'customers'}
                  </p>
                )}
              </div>
              <Button
                onClick={() => navigate('/customers/new')}
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
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="py-24 text-center">
            <p className="text-sm text-red-600">Failed to load customers. Please try again.</p>
          </div>
        )}

        {/* Empty State */}
        {isAuthReady && !isLoading && !error && customers.length === 0 && (
          <div className="py-24 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              {searchQuery ? 'No customers found' : 'No customers yet'}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {searchQuery
                ? 'Try adjusting your search to find what you are looking for.'
                : 'Get started by creating a new customer.'}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => navigate('/customers/new')}
                className="bg-[#635bff] hover:bg-[#0a2540] text-white text-sm font-medium px-4 h-9 rounded-md"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                New customer
              </Button>
            )}
          </div>
        )}

        {/* Desktop Table View & Mobile Card View */}
        {isAuthReady && !isLoading && !error && customers.length > 0 && (
          <>
            {/* Desktop Table */}
            <div className="mt-6 hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Default payment method
                      </th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total invoiced
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {customers.map((customer: any) => (
                      <tr
                        key={customer.id || customer._id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/customers/${customer.id || customer._id}`)}
                      >
                        <td className="px-3 py-4">
                          <div className="text-sm font-medium text-[#635bff] hover:text-[#0a2540]">
                            {customer.name}
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <div className="text-sm text-gray-600">{customer.email}</div>
                        </td>
                        <td className="px-3 py-4">
                          <div className="text-sm text-gray-900">
                            {customer.company || '—'}
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <div className="text-sm text-gray-600">
                            {customer.preferredPaymentMethod && customer.preferredPaymentMethod !== 'none'
                              ? customer.preferredPaymentMethod
                                  .replace(/_/g, ' ')
                                  .replace(/\b\w/g, (l: string) => l.toUpperCase())
                              : '—'}
                          </div>
                        </td>
                        <td className="px-3 py-4 text-right">
                          <div className="text-sm font-medium text-gray-900">
                            ${(customer.totalInvoiced || 0).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <div className="text-sm text-gray-600">
                            {customer.createdAt ? format(new Date(customer.createdAt), 'MMM d, yyyy') : '—'}
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
                Showing {customers.length} {customers.length === 1 ? 'result' : 'results'}
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden mt-4 space-y-3">
              {customers.map((customer: any) => (
                <div
                  key={customer.id || customer._id}
                  onClick={() => navigate(`/customers/${customer.id || customer._id}`)}
                  className="bg-white border border-gray-200 rounded-lg p-4 active:scale-98 transition-transform cursor-pointer animate-slide-up"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-[#635bff]">
                        {customer.name}
                      </div>
                      <div className="text-sm text-gray-600 mt-0.5">
                        {customer.email}
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="space-y-2">
                    {customer.company && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Company</span>
                        <span className="text-sm text-gray-900">{customer.company}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Total Invoiced</span>
                      <span className="text-sm font-semibold text-gray-900">
                        ${(customer.totalInvoiced || 0).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Created {customer.createdAt ? format(new Date(customer.createdAt), 'MMM d, yyyy') : '—'}
                    </div>
                  </div>
                </div>
              ))}

              {/* Results count */}
              <div className="py-4 text-xs text-center text-gray-500">
                Showing {customers.length} {customers.length === 1 ? 'result' : 'results'}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
