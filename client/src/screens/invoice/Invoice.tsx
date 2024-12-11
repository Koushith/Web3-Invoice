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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-[22px] font-semibold text-gray-900">Invoices</h1>
            <p className="text-[13px] text-gray-500 mt-1">Manage your billing and payment history</p>
          </div>
          <Button
            className="bg-[#635bff] hover:bg-[#5851ea] text-white rounded-md h-9 px-4 text-[13px]"
            onClick={() => navigate('/invoices/new')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>

        {/* Card Container */}
        <div className="bg-white">
          {/* Filters */}
          <div className="px-5 py-3.5 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search invoices..."
                  className="h-9 w-full pl-9 text-[13px] bg-white border border-gray-300 rounded-md 
                    focus-visible:ring-1 focus-visible:ring-[#635bff] focus-visible:border-[#635bff]
                    placeholder:text-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                <SelectTrigger
                  className="h-9 w-[160px] text-[13px] border border-gray-300 rounded-md
                  focus:ring-1 focus:ring-[#635bff] focus:border-[#635bff]
                  bg-white"
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
                  <tr key={invoice.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-[13px] font-medium text-gray-900">{invoice.number}</td>
                    <td className="px-5 py-3 text-[13px] text-gray-600">{invoice.customer}</td>
                    <td className="px-5 py-3 text-[13px] text-gray-900">${invoice.amount.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`
                          inline-flex items-center px-2 py-0.5 text-[12px] font-medium rounded-full
                          ${
                            invoice.status === 'paid'
                              ? 'bg-green-50 text-green-700'
                              : invoice.status === 'pending'
                              ? 'bg-yellow-50 text-yellow-700'
                              : 'bg-red-50 text-red-700'
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
