import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, Plus, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { DetailSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { useGetCustomerQuery, useDeleteCustomerMutation, useGetInvoicesQuery, useGetPaymentsQuery } from '@/services/api.service';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';

export const CustomerDetailScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomerMutation();

  // Wait for Firebase auth to be ready
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthReady(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch customer data
  const { data: customer, isLoading, error } = useGetCustomerQuery(id!, {
    skip: !isAuthReady || !id,
  });

  // Fetch customer invoices
  const { data: invoicesData, isLoading: invoicesLoading } = useGetInvoicesQuery(
    {
      filters: { customerId: id },
      limit: 10,
      sort: 'createdAt',
      order: 'desc',
    },
    {
      skip: !isAuthReady || !id,
    }
  );

  // Fetch customer payments
  const { data: paymentsData, isLoading: paymentsLoading } = useGetPaymentsQuery(
    {
      filters: { customerId: id },
      limit: 10,
      sort: 'createdAt',
      order: 'desc',
    },
    {
      skip: !isAuthReady || !id,
    }
  );

  const invoices = invoicesData?.data || [];
  const payments = paymentsData?.data || [];

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteCustomer(id!).unwrap();
      toast.success('Customer deleted successfully');
      navigate('/customers');
    } catch (error: any) {
      console.error('Delete customer error:', error);
      toast.error(error?.data?.message || 'Failed to delete customer');
    }
  };

  if (!isAuthReady || isLoading) {
    return (
      <div className="min-h-screen bg-[#FEFFFE] p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <DetailSkeleton />
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen bg-[#FEFFFE] flex items-center justify-center p-4">
        <EmptyState
          icon={AlertCircle}
          title="Customer not found"
          description="The customer you are looking for does not exist or has been removed."
          actionLabel="Back to Customers"
          onAction={() => navigate('/customers')}
        />
      </div>
    );
  }

  const formatAddress = () => {
    if (!customer.address?.street) return 'No address provided';

    const parts = [
      customer.address.street,
      [customer.address.city, customer.address.state, customer.address.postalCode]
        .filter(Boolean)
        .join(', '),
      customer.address.country,
    ].filter(Boolean);

    return parts.join('\n');
  };

  return (
    <div className="min-h-screen bg-[#FEFFFE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => navigate('/customers')}
            className="flex items-center gap-1 text-sm text-[#635BFF] hover:text-[#5045e5] mb-4 md:mb-6 font-medium active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Customers
          </button>

          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">{customer.name}</h1>
              </div>
              <p className="text-sm md:text-base text-gray-600">
                {customer.email}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={() => navigate(`/customers/${id}/edit`)}
                variant="outline"
                size="sm"
                className="h-9 px-3 md:px-4 text-xs md:text-sm font-medium border-gray-300"
              >
                <Edit className="w-4 h-4 md:mr-1.5" />
                <span className="hidden md:inline">Edit</span>
              </Button>
              <Button
                onClick={() => navigate('/invoices/new')}
                size="sm"
                className="h-9 px-3 md:px-4 text-xs md:text-sm font-medium bg-[#635BFF] hover:bg-[#5045e5] text-white active:scale-95 disabled:opacity-50"
              >
                <Plus className="w-4 h-4 md:mr-1.5" />
                <span className="hidden md:inline">New invoice</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Section */}
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-4">Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 md:p-5">
                  <p className="text-sm text-gray-600 mb-2">Total invoiced</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${(customer.totalInvoiced || 0).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 md:p-5">
                  <p className="text-sm text-gray-600 mb-2">Total paid</p>
                  <p className="text-2xl font-semibold text-green-600">
                    ${(customer.totalPaid || 0).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 md:p-5">
                  <p className="text-sm text-gray-600 mb-2">Outstanding</p>
                  <p className="text-2xl font-semibold text-orange-600">
                    ${((customer.totalInvoiced || 0) - (customer.totalPaid || 0)).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Invoices Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">Invoices</h2>
                <Button
                  onClick={() => navigate('/invoices/new')}
                  size="sm"
                  className="h-8 px-3 text-xs font-medium bg-[#635BFF] hover:bg-[#5045e5] text-white"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  New
                </Button>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {invoicesLoading ? (
                  <div className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                  </div>
                ) : invoices.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <p className="text-sm text-gray-500 mb-4">No invoices yet</p>
                    <Button
                      onClick={() => navigate('/invoices/new')}
                      variant="outline"
                      className="text-sm font-medium"
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      Create invoice
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {invoices.map((invoice: any) => (
                      <div
                        key={invoice.id || invoice._id}
                        onClick={() => navigate(`/invoices/${invoice.id || invoice._id}`)}
                        className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <p className="text-sm font-medium text-gray-900">
                                {invoice.invoiceNumber}
                              </p>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  invoice.status === 'paid'
                                    ? 'bg-green-100 text-green-800'
                                    : invoice.status === 'overdue'
                                    ? 'bg-red-100 text-red-800'
                                    : invoice.status === 'sent'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {invoice.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {invoice.createdAt ? format(new Date(invoice.createdAt), 'MMM d, yyyy') : '—'}
                              {invoice.dueDate && ` • Due ${format(new Date(invoice.dueDate), 'MMM d, yyyy')}`}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">
                                {invoice.currency} {(invoice.total || 0).toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Payments Section */}
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-4">Payment History</h2>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {paymentsLoading ? (
                  <div className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                  </div>
                ) : payments.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <p className="text-sm text-gray-500">No payments yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {payments.map((payment: any) => (
                      <div
                        key={payment.id || payment._id}
                        className="px-6 py-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <p className="text-sm font-medium text-gray-900">
                                {payment.paymentMethod?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Payment'}
                              </p>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  payment.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : payment.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : payment.status === 'failed'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {payment.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {payment.createdAt ? format(new Date(payment.createdAt), 'MMM d, yyyy h:mm a') : '—'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              {payment.currency || 'USD'} {(payment.amount || 0).toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details Section */}
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-4">Details</h2>
              <div className="border border-gray-200 rounded-lg p-5 space-y-4">
                {customer.company && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Company</p>
                    <p className="text-sm text-gray-900">{customer.company}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Email</p>
                  <a href={`mailto:${customer.email}`} className="text-sm text-[#635bff] hover:text-[#0a2540]">
                    {customer.email}
                  </a>
                </div>

                {customer.phone && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                    <a href={`tel:${customer.phone}`} className="text-sm text-gray-900">
                      {customer.phone}
                    </a>
                  </div>
                )}

                {customer.address?.street && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Address</p>
                    <p className="text-sm text-gray-900 whitespace-pre-line">{formatAddress()}</p>
                  </div>
                )}


                {customer.taxId && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Tax ID</p>
                    <p className="text-sm text-gray-900 font-mono">{customer.taxId}</p>
                  </div>
                )}

                {customer.walletAddress && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Payment Address</p>
                    <p className="text-sm text-gray-900 font-mono break-all">{customer.walletAddress}</p>
                  </div>
                )}

                {customer.notes && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Notes</p>
                    <p className="text-sm text-gray-900 whitespace-pre-line">{customer.notes}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Created</p>
                  <p className="text-sm text-gray-900">
                    {format(new Date(customer.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full h-9 justify-start text-sm font-medium border-red-200 text-red-600 hover:bg-red-50"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete customer
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
