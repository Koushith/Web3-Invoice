import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Printer, Send, MoreVertical, CheckCircle, Clock, XCircle, Edit, Trash2, Copy } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const InvoiceDetailScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data - replace with API call
  const invoice = {
    id: 'INV-001',
    number: 'INV-001',
    status: 'paid',
    customer: {
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      address: '123 Main Street\nSan Francisco, CA 94103\nUnited States',
    },
    issueDate: '2024-02-15',
    dueDate: '2024-03-15',
    items: [
      { id: '1', description: 'Website Design', quantity: 1, rate: 5000, amount: 5000 },
      { id: '2', description: 'Development Hours', quantity: 40, rate: 150, amount: 6000 },
      { id: '3', description: 'Hosting Setup', quantity: 1, rate: 500, amount: 500 },
    ],
    subtotal: 11500,
    tax: 1150,
    total: 12650,
    currency: 'USD',
    notes: 'Thank you for your business!',
    paymentMethod: 'Bank Transfer',
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5" />;
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'overdue':
        return <XCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-[1100px] mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/invoices')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Invoices
          </button>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">{invoice.number}</h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                  {getStatusIcon(invoice.status)}
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Issued {new Date(invoice.issueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-4 border-gray-300 rounded-lg"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-4 border-gray-300 rounded-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                size="sm"
                className="h-10 px-4 bg-gradient-to-r from-[#635bff] to-[#5045e5] hover:from-[#5045e5] hover:to-[#3d38d1] text-white rounded-lg font-semibold shadow-lg shadow-[#635bff]/20"
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 p-0 border-gray-300 rounded-lg"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invoice Details Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-8 shadow-sm">
              {/* Bill To / From */}
              <div className="grid grid-cols-2 gap-12 mb-8">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Bill To</p>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">{invoice.customer.name}</p>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{invoice.customer.address}</p>
                    <p className="text-sm text-gray-600 mt-2">{invoice.customer.email}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">From</p>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">DefInvoice Inc.</p>
                    <p className="text-sm text-gray-600 whitespace-pre-line">
                      456 Business Ave{'\n'}
                      New York, NY 10001{'\n'}
                      United States
                    </p>
                    <p className="text-sm text-gray-600 mt-2">hello@definvoice.com</p>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
                      <th className="py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Qty</th>
                      <th className="py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Rate</th>
                      <th className="py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 last:border-0">
                        <td className="py-4 text-sm text-gray-900">{item.description}</td>
                        <td className="py-4 text-sm text-gray-600 text-right">{item.quantity}</td>
                        <td className="py-4 text-sm text-gray-600 text-right">${item.rate.toFixed(2)}</td>
                        <td className="py-4 text-sm font-semibold text-gray-900 text-right">${item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-80 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-semibold text-gray-900">${invoice.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-bold pt-3 border-t border-gray-200">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">${invoice.total.toFixed(2)} {invoice.currency}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Notes</p>
                  <p className="text-sm text-gray-600">{invoice.notes}</p>
                </div>
              )}
            </div>

            {/* Payment Information */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Payment Method</p>
                  <p className="text-sm text-gray-900">{invoice.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Due Date</p>
                  <p className="text-sm text-gray-900">
                    {new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full h-10 justify-start border-gray-300 rounded-lg"
                  onClick={() => navigate(`/invoices/${id}/edit`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Invoice
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-10 justify-start border-gray-300 rounded-lg"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-10 justify-start border-gray-300 rounded-lg"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Reminder
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-10 justify-start border-red-200 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity</h3>
              <div className="space-y-4">
                {[
                  { event: 'Invoice paid', time: '2 days ago', icon: CheckCircle, color: 'text-green-500' },
                  { event: 'Payment received', time: '2 days ago', icon: CheckCircle, color: 'text-green-500' },
                  { event: 'Invoice viewed', time: '5 days ago', icon: Clock, color: 'text-blue-500' },
                  { event: 'Invoice sent', time: '1 week ago', icon: Send, color: 'text-purple-500' },
                  { event: 'Invoice created', time: '1 week ago', icon: CheckCircle, color: 'text-gray-500' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <activity.icon className={`w-5 h-5 ${activity.color} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.event}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
