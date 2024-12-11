import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Customer {
  id: string;
  name: string;
  email: string;
  defaultPaymentMethod: string;
  totalSpend: number;
  payments: number;
  lastPayment: string;
  created: string;
}

export const CustomersScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const customers: Customer[] = [
    {
      id: '1',
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      defaultPaymentMethod: 'Visa •••• 4242',
      totalSpend: 15000.0,
      payments: 24,
      lastPayment: '2024-02-15',
      created: '2023-01-10',
    },
    {
      id: '2',
      name: 'Tech Solutions Inc',
      email: 'info@techsolutions.com',
      defaultPaymentMethod: 'Mastercard •••• 5555',
      totalSpend: 23400.0,
      payments: 36,
      lastPayment: '2024-02-10',
      created: '2023-03-15',
    },
    // Add more mock data as needed
  ];

  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <div className="max-w-[1300px] mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-[22px] font-semibold text-gray-900">Customers</h1>
            <p className="text-[13px] text-gray-500 mt-1">View and manage your customer information</p>
          </div>
          <Button
            className="bg-[#635bff] hover:bg-[#5851ea] text-white rounded-md h-9 px-4 text-[13px]"
            onClick={() => navigate('/customers/new')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>

        {/* Card Container */}
        <div className="bg-white">
          {/* Search */}
          <div className="px-5 py-3.5 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search customers..."
                  className="h-9 w-full pl-9 text-[13px] bg-white border border-gray-300 rounded-md 
                    focus-visible:ring-1 focus-visible:ring-[#635bff] focus-visible:border-[#635bff]
                    placeholder:text-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-5 py-3 text-left text-[13px] font-medium text-gray-500">Name</th>
                  <th className="px-5 py-3 text-left text-[13px] font-medium text-gray-500">Email</th>
                  <th className="px-5 py-3 text-left text-[13px] font-medium text-gray-500">Default payment method</th>
                  <th className="px-5 py-3 text-right text-[13px] font-medium text-gray-500">Total spend</th>
                  <th className="px-5 py-3 text-right text-[13px] font-medium text-gray-500">Payments</th>
                  <th className="px-5 py-3 text-left text-[13px] font-medium text-gray-500">Last payment</th>
                  <th className="px-5 py-3 text-left text-[13px] font-medium text-gray-500">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-[13px] font-medium text-gray-900">{customer.name}</td>
                    <td className="px-5 py-3 text-[13px] text-gray-600">{customer.email}</td>
                    <td className="px-5 py-3 text-[13px] text-gray-600">{customer.defaultPaymentMethod}</td>
                    <td className="px-5 py-3 text-[13px] text-gray-900 text-right">
                      ${customer.totalSpend.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-[13px] text-gray-900 text-right">{customer.payments}</td>
                    <td className="px-5 py-3 text-[13px] text-gray-600">
                      {new Date(customer.lastPayment).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3 text-[13px] text-gray-600">
                      {new Date(customer.created).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
