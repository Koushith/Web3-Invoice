import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableSkeleton, CardSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Search, Filter, MoreVertical, CreditCard } from 'lucide-react';
import { useGetPaymentsQuery } from '@/services/api.service';
import { auth } from '@/lib/firebase';

export const PaymentsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Wait for Firebase auth to be ready
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthReady(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch payments from API
  const { data, isLoading, error } = useGetPaymentsQuery(
    {
      search: searchQuery,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      page: 1,
      limit: 100,
    },
    {
      skip: !isAuthReady,
    }
  );

  const payments = data?.data || [];

  const filteredPayments = payments.filter((payment: any) => {
    const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter;
    return matchesMethod;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: 'bg-green-50 text-green-700 border-green-200',
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      failed: 'bg-red-50 text-red-700 border-red-200',
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'bank':
        return 'Bank Transfer';
      case 'crypto':
        return 'Cryptocurrency';
      case 'card':
        return 'Credit Card';
      default:
        return 'Other';
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFFFE]">
      <div className="border-b border-gray-200 md:border-b">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="py-4 md:py-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Transactions</h1>
                {data && (
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    {data.pagination.total} {data.pagination.total === 1 ? 'transaction' : 'transactions'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex items-center gap-2 md:gap-3 pb-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
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
              <SelectTrigger className="h-9 w-[110px] md:w-[140px] text-xs md:text-sm border-gray-300 rounded-md">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="h-9 w-[110px] md:w-[140px] text-xs md:text-sm border-gray-300 rounded-md">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All methods</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="crypto">Cryptocurrency</SelectItem>
                <SelectItem value="card">Credit Card</SelectItem>
                <SelectItem value="other">Other</SelectItem>
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
            icon={CreditCard}
            title="Failed to load payments"
            description="There was an error loading your payments. Please try again later."
          />
        )}

        {/* Empty State */}
        {isAuthReady && !isLoading && !error && payments.length === 0 && (
          <EmptyState
            icon={CreditCard}
            title="No payments yet"
            description="Payment transactions will appear here once your customers pay their invoices."
          />
        )}

        {/* Desktop Table */}
        {isAuthReady && !isLoading && !error && payments.length > 0 && (
          <div className="mt-6 hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment: any) => (
                  <tr
                    key={payment.id || payment._id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-3 py-4">
                      <div className="text-sm font-mono text-gray-600">{payment.transactionId || '—'}</div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="text-sm font-medium text-[#635bff] hover:text-[#0a2540]">
                        {payment.invoiceId?.invoiceNumber || payment.invoiceId || '—'}
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="text-sm text-gray-900">{payment.customerId?.name || payment.customerId || '—'}</div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="text-sm text-gray-600">{getMethodLabel(payment.paymentMethod)}</div>
                    </td>
                    <td className="px-3 py-4 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.currency || 'USD'} {(payment.amount || 0).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${getStatusBadge(
                          payment.status
                        )}`}
                      >
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="text-sm text-gray-600">
                        {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }) : '—'}
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
            Showing {filteredPayments.length} {filteredPayments.length === 1 ? 'transaction' : 'transactions'}
          </div>
        </div>
        )}

        {/* Mobile Card View */}
        {isAuthReady && !isLoading && !error && payments.length > 0 && (
          <div className="md:hidden mt-4 space-y-3">
            {filteredPayments.map((payment: any) => (
              <div
                key={payment.id || payment._id}
                className="bg-white border border-gray-200 rounded-lg p-4 active:scale-98 transition-transform cursor-pointer animate-slide-up"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-[#635bff]">
                      {payment.invoiceId?.invoiceNumber || payment.invoiceId || '—'}
                    </div>
                    <div className="text-sm text-gray-900 mt-0.5">
                      {payment.customerId?.name || payment.customerId || '—'}
                    </div>
                    <div className="text-xs font-mono text-gray-500 mt-1">
                      {payment.transactionId || '—'}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${getStatusBadge(
                      payment.status
                    )}`}
                  >
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Amount</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {payment.currency || 'USD'} {(payment.amount || 0).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Method</div>
                    <div className="text-sm text-gray-900">
                      {getMethodLabel(payment.paymentMethod)}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }) : '—'}
                  </div>
                </div>
              </div>
            ))}

            {/* Results count */}
            <div className="py-4 text-xs text-center text-gray-500">
              Showing {filteredPayments.length} {filteredPayments.length === 1 ? 'transaction' : 'transactions'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
