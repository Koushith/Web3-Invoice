import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, Plus, Mail, Phone, MapPin, Building2, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCustomerQuery, useDeleteCustomerMutation } from '@/services/api.service';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load customer details</p>
          <Button onClick={() => navigate('/customers')}>Back to Customers</Button>
        </div>
      </div>
    );
  }

  const formatAddress = () => {
    if (!customer.address?.street) return 'No address provided';

    const parts = [
      customer.address.street,
      [customer.address.city, customer.address.state, customer.address.zipCode]
        .filter(Boolean)
        .join(', '),
      customer.address.country,
    ].filter(Boolean);

    return parts.join('\n');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="py-8">
            <button
              onClick={() => navigate('/customers')}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Customers
            </button>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-gray-900">{customer.name}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {customer.email}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/customers/${id}/edit`)}
                  className="h-9 px-4 text-sm font-medium border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4 mr-1.5" />
                  Edit
                </Button>
                <Button
                  onClick={() => navigate('/invoices/new')}
                  className="bg-[#635bff] hover:bg-[#0a2540] text-white text-sm font-medium px-4 h-9 rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  New invoice
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Section */}
            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-4">Overview</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <p className="text-sm text-gray-500">Total invoiced</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    ${(customer.totalInvoiced || 0).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <p className="text-sm text-gray-500">Total paid</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    ${(customer.totalPaid || 0).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <p className="text-sm text-gray-500">Invoices</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">0</p>
                </div>
              </div>
            </div>

            {/* Invoices Section */}
            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-4">Invoices</h2>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-12 text-center">
                  <p className="text-sm text-gray-500 mb-4">No invoices yet</p>
                  <Button
                    onClick={() => navigate('/invoices/new')}
                    className="bg-[#635bff] hover:bg-[#0a2540] text-white text-sm font-medium px-4 h-9 rounded-md"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Create invoice
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details Section */}
            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-4">Details</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
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

                {customer.preferredPaymentMethod && customer.preferredPaymentMethod !== 'none' && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Payment Method</p>
                    <p className="text-sm text-gray-900">
                      {customer.preferredPaymentMethod
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </p>
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
              <h2 className="text-sm font-medium text-gray-900 mb-4">Actions</h2>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full h-9 justify-start text-sm font-medium border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => navigate(`/customers/${id}/edit`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit customer
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-9 justify-start text-sm font-medium border-red-200 text-red-600 hover:bg-red-50 rounded-md"
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
