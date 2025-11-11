import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, MoreVertical } from 'lucide-react';

interface Payment {
  id: string;
  invoice: string;
  customer: string;
  amount: number;
  method: 'bank' | 'crypto' | 'card' | 'other';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  transactionId: string;
}

export const PaymentsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  const payments: Payment[] = [
    {
      id: '1',
      invoice: 'INV-001',
      customer: 'Acme Corporation',
      amount: 12650,
      method: 'bank',
      status: 'completed',
      date: '2024-02-15T10:30:00Z',
      transactionId: 'TXN-1234567890',
    },
    {
      id: '2',
      invoice: 'INV-002',
      customer: 'Tech Solutions Inc',
      amount: 8500,
      method: 'crypto',
      status: 'completed',
      date: '2024-02-14T15:20:00Z',
      transactionId: '0x1234...5678',
    },
    {
      id: '3',
      invoice: 'INV-003',
      customer: 'Global Industries',
      amount: 15000,
      method: 'card',
      status: 'pending',
      date: '2024-02-13T09:15:00Z',
      transactionId: 'ch_1234567890',
    },
    {
      id: '4',
      invoice: 'INV-004',
      customer: 'Innovate LLC',
      amount: 3500,
      method: 'bank',
      status: 'failed',
      date: '2024-02-12T14:45:00Z',
      transactionId: 'TXN-9876543210',
    },
  ];

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.invoice.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
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
      <div className="border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="py-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-gray-900">Payments</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {filteredPayments.length} {filteredPayments.length === 1 ? 'payment' : 'payments'}
                </p>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex items-center gap-3 pb-4">
            <div className="relative flex-1 max-w-xs">
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
              <SelectTrigger className="h-9 w-[140px] text-sm border-gray-300 rounded-md">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="h-9 w-[140px] text-sm border-gray-300 rounded-md">
                <SelectValue placeholder="All methods" />
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
              className="h-9 px-3 text-sm font-medium border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-1.5" />
              More filters
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Table */}
        <div className="mt-6">
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
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-3 py-4">
                      <div className="text-sm font-mono text-gray-600">{payment.transactionId}</div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="text-sm font-medium text-[#635bff] hover:text-[#0a2540]">
                        {payment.invoice}
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="text-sm text-gray-900">{payment.customer}</div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="text-sm text-gray-600">{getMethodLabel(payment.method)}</div>
                    </td>
                    <td className="px-3 py-4 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        ${payment.amount.toLocaleString('en-US', {
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
                        {new Date(payment.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
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
            Showing {filteredPayments.length} {filteredPayments.length === 1 ? 'result' : 'results'}
          </div>
        </div>
      </div>
    </div>
  );
};
