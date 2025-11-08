import { useState } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useGetCustomersQuery } from '@/services/api.service';
import { format } from 'date-fns';

export const CustomersScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Fetch customers from API
  const { data, isLoading, error } = useGetCustomersQuery({
    search: searchQuery,
    page: 1,
    limit: 100,
  });

  const customers = data?.data || [];

  return (
    <div className="min-h-screen">
      <div className="max-w-[1300px] mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Customers</h1>
            <p className="text-[14px] text-gray-500 mt-1.5">
              View and manage your customer information
              {data && ` • ${data.pagination.total} total`}
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-[#635bff] to-[#5045e5] hover:from-[#5045e5] hover:to-[#3d38d1] text-white rounded-lg h-10 px-5 text-[13px] font-semibold shadow-lg shadow-[#635bff]/20 hover:shadow-xl transition-all"
            onClick={() => navigate('/customers/new')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>

        {/* Card Container */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-sm overflow-hidden">
          {/* Search */}
          <div className="px-6 py-4 border-b border-gray-200/60 bg-gray-50/30">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search customers..."
                  className="h-10 w-full pl-9 text-[13px] bg-white border border-gray-300 rounded-lg
                    focus-visible:ring-2 focus-visible:ring-[#635bff]/20 focus-visible:border-[#635bff]
                    placeholder:text-gray-400 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-red-600">Failed to load customers. Please try again.</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && customers.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-gray-500 mb-4">
                {searchQuery ? 'No customers found matching your search.' : 'No customers yet.'}
              </p>
              {!searchQuery && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/customers/new')}
                  className="h-10 px-5 text-[13px]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Customer
                </Button>
              )}
            </div>
          )}

          {/* Table */}
          {!isLoading && !error && customers.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-5 py-3 text-left text-[13px] font-medium text-gray-500">Name</th>
                    <th className="px-5 py-3 text-left text-[13px] font-medium text-gray-500">Email</th>
                    <th className="px-5 py-3 text-left text-[13px] font-medium text-gray-500">Company</th>
                    <th className="px-5 py-3 text-left text-[13px] font-medium text-gray-500">Phone</th>
                    <th className="px-5 py-3 text-right text-[13px] font-medium text-gray-500">Total Invoiced</th>
                    <th className="px-5 py-3 text-left text-[13px] font-medium text-gray-500">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer: any) => (
                    <tr
                      key={customer.id || customer._id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/customers/${customer.id || customer._id}`)}
                    >
                      <td className="px-5 py-3 text-[13px] font-medium text-gray-900">{customer.name}</td>
                      <td className="px-5 py-3 text-[13px] text-gray-600">{customer.email}</td>
                      <td className="px-5 py-3 text-[13px] text-gray-600">{customer.company || '-'}</td>
                      <td className="px-5 py-3 text-[13px] text-gray-600">{customer.phone || '-'}</td>
                      <td className="px-5 py-3 text-[13px] text-gray-900 text-right">
                        ${(customer.totalInvoiced || 0).toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-[13px] text-gray-600">
                        {customer.createdAt ? format(new Date(customer.createdAt), 'MMM d, yyyy') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
