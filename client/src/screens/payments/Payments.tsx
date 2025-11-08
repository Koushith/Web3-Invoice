import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, Filter, CheckCircle, XCircle, Clock, CreditCard, Bitcoin } from 'lucide-react';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 ring-1 ring-green-200/50';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200/50';
      case 'failed':
        return 'bg-red-50 text-red-700 ring-1 ring-red-200/50';
      default:
        return 'bg-gray-50 text-gray-700 ring-1 ring-gray-200/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'bank':
        return '🏦';
      case 'crypto':
        return <Bitcoin className="w-4 h-4" />;
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      default:
        return '💳';
    }
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

  const totalReceived = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalFailed = payments
    .filter((p) => p.status === 'failed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen">
      <div className="max-w-[1300px] mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Payments</h1>
          <p className="text-[14px] text-gray-500 mt-1.5">Track all payment transactions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Received</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">${totalReceived.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{payments.filter((p) => p.status === 'completed').length} payments</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-50 to-amber-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pending</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">${totalPending.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{payments.filter((p) => p.status === 'pending').length} payments</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Failed</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">${totalFailed.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{payments.filter((p) => p.status === 'failed').length} payments</p>
          </div>
        </div>

        {/* Payments Table Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-sm overflow-hidden">
          {/* Filters */}
          <div className="px-6 py-4 border-b border-gray-200/60 bg-gray-50/30">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search payments..."
                  className="h-10 w-full pl-9 text-[13px] bg-white border border-gray-300 rounded-lg
                    focus-visible:ring-2 focus-visible:ring-[#635bff]/20 focus-visible:border-[#635bff]
                    placeholder:text-gray-400 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                <SelectTrigger className="h-10 w-[160px] text-[13px] border border-gray-300 rounded-lg bg-white font-medium">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={methodFilter} onValueChange={(value) => setMethodFilter(value)}>
                <SelectTrigger className="h-10 w-[160px] text-[13px] border border-gray-300 rounded-lg bg-white font-medium">
                  <SelectValue placeholder="All Methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="crypto">Digital Currency</SelectItem>
                  <SelectItem value="card">Credit Card</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" className="h-10 px-4 border-gray-300 rounded-lg">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-5 py-3 text-left text-[13px] font-medium text-gray-500">Transaction ID</th>
                  <th className="px-5 py-3 text-left text-[13px] font-medium text-gray-500">Invoice</th>
                  <th className="px-5 py-3 text-left text-[13px] font-medium text-gray-500">Customer</th>
                  <th className="px-5 py-3 text-left text-[13px] font-medium text-gray-500">Method</th>
                  <th className="px-5 py-3 text-right text-[13px] font-medium text-gray-500">Amount</th>
                  <th className="px-5 py-3 text-left text-[13px] font-medium text-gray-500">Status</th>
                  <th className="px-5 py-3 text-left text-[13px] font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-[13px] font-mono text-gray-600">{payment.transactionId}</td>
                    <td className="px-5 py-3 text-[13px] font-semibold text-gray-900">{payment.invoice}</td>
                    <td className="px-5 py-3 text-[13px] text-gray-600">{payment.customer}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 text-[13px] text-gray-600">
                        {typeof getMethodIcon(payment.method) === 'string' ? (
                          <span>{getMethodIcon(payment.method)}</span>
                        ) : (
                          getMethodIcon(payment.method)
                        )}
                        <span>{getMethodLabel(payment.method)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[13px] font-semibold text-gray-900 text-right">
                      ${payment.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[13px] text-gray-600">
                      {new Date(payment.date).toLocaleDateString('en-US', {
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
