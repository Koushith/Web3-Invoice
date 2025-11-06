import { useState } from 'react';
import { Plus, Search } from 'lucide-react'; // For icons
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

interface Invoice {
  id: string;
  number: string;
  customer: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
}

export const InvoicesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const invoices: Invoice[] = [
    {
      id: '1',
      number: 'INV-001',
      customer: 'Acme Corp',
      amount: 1500.0,
      status: 'paid',
      date: '2024-01-15',
    },
    {
      id: '2',
      number: 'INV-002',
      customer: 'Tech Solutions',
      amount: 2300.0,
      status: 'pending',
      date: '2024-01-20',
    },
    {
      id: '3',
      number: 'INV-003',
      customer: 'Global Industries',
      amount: 3200.0,
      status: 'overdue',
      date: '2024-01-25',
    },
    {
      id: '4',
      number: 'INV-004',
      customer: 'Innovate LLC',
      amount: 4500.0,
      status: 'paid',
      date: '2024-02-01',
    },
    {
      id: '5',
      number: 'INV-005',
      customer: 'Future Tech',
      amount: 2750.0,
      status: 'pending',
      date: '2024-02-10',
    },
    // Add more mock data as needed
  ];

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <div className="max-w-[1300px] mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Invoices</h1>
            <p className="text-[14px] text-gray-500 mt-1.5">Manage your billing and payment history</p>
          </div>
          <Button
            className="bg-gradient-to-r from-[#635bff] to-[#5045e5] hover:from-[#5045e5] hover:to-[#3d38d1] text-white rounded-lg h-10 px-5 text-[13px] font-semibold shadow-lg shadow-[#635bff]/20 hover:shadow-xl transition-all"
            onClick={() => navigate('/invoices/new')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>

        {/* Card Container */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-sm overflow-hidden">
          {/* Filters */}
          <div className="px-6 py-4 border-b border-gray-200/60 bg-gray-50/30">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search invoices..."
                  className="h-10 w-full pl-9 text-[13px] bg-white border border-gray-300 rounded-lg
                    focus-visible:ring-2 focus-visible:ring-[#635bff]/20 focus-visible:border-[#635bff]
                    placeholder:text-gray-400 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                <SelectTrigger
                  className="h-10 w-[160px] text-[13px] border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff]
                  bg-white font-medium transition-all"
                >
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-[13px]">
                    All Status
                  </SelectItem>
                  <SelectItem value="paid" className="text-[13px]">
                    Paid
                  </SelectItem>
                  <SelectItem value="pending" className="text-[13px]">
                    Pending
                  </SelectItem>
                  <SelectItem value="overdue" className="text-[13px]">
                    Overdue
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-5 py-3 text-left text-[13px] font-medium text-gray-500">Invoice Number</th>
                  <th className="px-5 py-3 text-left text-[13px] font-medium text-gray-500">Customer</th>
                  <th className="px-5 py-3 text-left text-[13px] font-medium text-gray-500">Amount</th>
                  <th className="px-5 py-3 text-left text-[13px] font-medium text-gray-500">Status</th>
                  <th className="px-5 py-3 text-left text-[13px] font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all cursor-pointer group">
                    <td className="px-6 py-4 text-[13px] font-semibold text-gray-900 group-hover:text-[#635bff]">{invoice.number}</td>
                    <td className="px-6 py-4 text-[13px] text-gray-600">{invoice.customer}</td>
                    <td className="px-6 py-4 text-[13px] font-semibold text-gray-900">${invoice.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`
                          inline-flex items-center px-3 py-1 text-[11px] font-semibold rounded-full
                          ${
                            invoice.status === 'paid'
                              ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 ring-1 ring-green-200/50'
                              : invoice.status === 'pending'
                              ? 'bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 ring-1 ring-yellow-200/50'
                              : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 ring-1 ring-red-200/50'
                          }
                        `}
                      >
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[13px] text-gray-600">
                      {new Date(invoice.date).toLocaleDateString('en-US', {
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
