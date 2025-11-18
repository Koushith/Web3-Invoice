import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TableSkeleton, CardSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { useNavigate } from 'react-router-dom';
import { useGetCustomersQuery } from '@/services/api.service';
import { format } from 'date-fns';
import { auth } from '@/lib/firebase';

export const CustomersScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Fetch customers from API only when auth is ready
  const { data, isLoading, error } = useGetCustomersQuery(
    {
      search: searchQuery,
      page: currentPage,
      limit: 15,
    },
    {
      skip: !isAuthReady,
    }
  );

  const customers = data?.data || [];
  const pagination = data?.pagination;

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
            icon={Users}
            title="Failed to load customers"
            description="There was an error loading your customers. Please try again later."
          />
        )}

        {/* Empty State */}
        {isAuthReady && !isLoading && !error && customers.length === 0 && (
          <EmptyState
            icon={Users}
            title={searchQuery ? 'No customers found' : 'No customers yet'}
            description={
              searchQuery
                ? 'Try adjusting your search to find what you are looking for.'
                : 'Get started by adding your first customer to send them invoices.'
            }
            actionLabel={!searchQuery ? 'Add customer' : undefined}
            onAction={!searchQuery ? () => navigate('/customers/new') : undefined}
          />
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
                        Default payment method
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
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
                            {customer.preferredPaymentMethod && customer.preferredPaymentMethod !== 'none'
                              ? customer.preferredPaymentMethod
                                  .split('_')
                                  .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                                  .join(' ')
                              : '—'}
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <div className="text-sm text-gray-600">
                            {customer.createdAt ? format(new Date(customer.createdAt), 'MMM d, yyyy') : '—'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-6 pb-8 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} customers
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className="h-8 px-3"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                          return (
                            page === 1 ||
                            page === pagination.totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          );
                        })
                        .map((page, index, array) => {
                          const prevPage = array[index - 1];
                          const showEllipsis = prevPage && page - prevPage > 1;

                          return (
                            <div key={page} className="flex items-center gap-1">
                              {showEllipsis && <span className="px-2 text-gray-400">...</span>}
                              <Button
                                variant={currentPage === page ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className={`h-8 w-8 p-0 ${
                                  currentPage === page ? 'bg-[#635bff] hover:bg-[#0a2540]' : ''
                                }`}
                              >
                                {page}
                              </Button>
                            </div>
                          );
                        })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="h-8 px-3"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
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
                    {customer.preferredPaymentMethod && customer.preferredPaymentMethod !== 'none' && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Payment Method</span>
                        <span className="text-sm text-gray-900">
                          {customer.preferredPaymentMethod
                            .split('_')
                            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Created {customer.createdAt ? format(new Date(customer.createdAt), 'MMM d, yyyy') : '—'}
                    </div>
                  </div>
                </div>
              ))}

              {/* Mobile Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="py-4 space-y-3">
                  <div className="text-xs text-center text-gray-500">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} customers
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className="h-8 px-3"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="h-8 px-3"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
