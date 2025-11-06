import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, Plus, Mail, Phone, MapPin, DollarSign, FileText, TrendingUp } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface Invoice {
  id: string;
  number: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  dueDate: string;
}

export const CustomerDetailScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data - replace with API call
  const customer = {
    id: '1',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street\nSan Francisco, CA 94103\nUnited States',
    taxId: '12-3456789',
    currency: 'USD',
    paymentTerms: 'Net 30',
    created: '2023-01-10',
    totalSpent: 45000,
    outstandingBalance: 5000,
    invoiceCount: 12,
    lastPayment: '2024-02-15',
  };

  const invoices: Invoice[] = [
    { id: '1', number: 'INV-001', amount: 12650, status: 'paid', date: '2024-02-15', dueDate: '2024-03-15' },
    { id: '2', number: 'INV-002', amount: 8500, status: 'pending', date: '2024-02-10', dueDate: '2024-03-10' },
    { id: '3', number: 'INV-003', amount: 15000, status: 'paid', date: '2024-01-20', dueDate: '2024-02-20' },
    { id: '4', number: 'INV-004', amount: 3500, status: 'overdue', date: '2024-01-05', dueDate: '2024-02-05' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-50 text-green-700 ring-1 ring-green-200/50';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200/50';
      case 'overdue':
        return 'bg-red-50 text-red-700 ring-1 ring-red-200/50';
      default:
        return 'bg-gray-50 text-gray-700 ring-1 ring-gray-200/50';
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-[1200px] mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/customers')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Customers
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">{customer.name}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Customer since {new Date(customer.created).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/customers/${id}/edit`)}
                className="h-10 px-4 border-gray-300 rounded-lg"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                size="sm"
                onClick={() => navigate('/invoices/new')}
                className="h-10 px-4 bg-gradient-to-r from-[#635bff] to-[#5045e5] hover:from-[#5045e5] hover:to-[#3d38d1] text-white rounded-lg font-semibold shadow-lg shadow-[#635bff]/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Invoice
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">${customer.totalSpent.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Total Spent</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">${customer.outstandingBalance.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Outstanding</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{customer.invoiceCount}</p>
                <p className="text-xs text-gray-500 mt-1">Invoices</p>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200/60">
                <h3 className="text-lg font-semibold text-gray-900">Invoice History</h3>
                <p className="text-sm text-gray-500 mt-1">All invoices for this customer</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Invoice</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Due Date</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{invoice.number}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(invoice.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                          ${invoice.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/invoices/${invoice.id}`)}
                            className="h-8 px-3 border-gray-300 rounded-lg text-xs"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Email</p>
                    <a href={`mailto:${customer.email}`} className="text-sm text-blue-600 hover:text-blue-700">
                      {customer.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Phone</p>
                    <a href={`tel:${customer.phone}`} className="text-sm text-gray-900">
                      {customer.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Address</p>
                    <p className="text-sm text-gray-900 whitespace-pre-line">{customer.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Currency</p>
                  <p className="text-sm text-gray-900">{customer.currency}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Payment Terms</p>
                  <p className="text-sm text-gray-900">{customer.paymentTerms}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Tax ID</p>
                  <p className="text-sm text-gray-900 font-mono">{customer.taxId}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Last Payment</p>
                  <p className="text-sm text-gray-900">
                    {new Date(customer.lastPayment).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full h-10 justify-start border-gray-300 rounded-lg"
                  onClick={() => navigate(`/customers/${id}/edit`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Customer
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-10 justify-start border-red-200 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Customer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
