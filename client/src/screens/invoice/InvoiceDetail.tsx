import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Send, MoreVertical, Copy, Edit2, User, CreditCard, FileText, Info } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useGetInvoiceQuery } from '@/services/api.service';
import { toast } from 'sonner';

export const InvoiceDetailScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: invoice, isLoading, error } = useGetInvoiceQuery(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading invoice...</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-900 font-semibold mb-2">Invoice not found</p>
          <Button onClick={() => navigate('/invoices')} variant="outline">
            Back to Invoices
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">Paid</span>;
      case 'pending':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">Pending</span>;
      case 'overdue':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200">Overdue</span>;
      case 'draft':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">Draft</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => navigate('/invoices')}
            className="flex items-center gap-1 text-sm text-[#635BFF] hover:text-[#5045e5] mb-4 md:mb-6 font-medium active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Invoices
          </button>

          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">{invoice.invoiceNumber}</h1>
                {getStatusBadge(invoice.status)}
              </div>
              <p className="text-sm md:text-base text-gray-600">
                Billed to {invoice.customer?.name || 'Customer'} · ${invoice.total.toLocaleString()}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 md:px-4 text-xs md:text-sm font-medium border-gray-300 hidden sm:flex"
              >
                Edit draft
              </Button>
              <Button
                size="sm"
                className="h-9 px-3 md:px-4 text-xs md:text-sm font-medium bg-[#635BFF] hover:bg-[#5045e5] text-white active:scale-95"
              >
                <Send className="w-4 h-4 md:mr-1.5" />
                <span className="hidden md:inline">Send invoice</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 md:px-4 text-xs md:text-sm font-medium border-gray-300 hidden lg:flex"
              >
                Charge customer
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0 border-gray-300 active:scale-95">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy invoice ID
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">Recent activity</h3>
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs border-gray-300">
                  + Add note
                </Button>
              </div>
              <div className="text-center py-12">
                <p className="text-sm text-gray-500">No recent activity</p>
              </div>
            </div>

            {/* Summary */}
            <div className="border border-gray-200 rounded-lg p-4 md:p-6">
              <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-4 md:mb-6">Summary</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-8 md:gap-x-12 gap-y-4 md:gap-y-6 mb-6 md:mb-8">
                {/* Billed to */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">Billed to</h4>
                  <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-2">
                    <User className="w-4 h-4" />
                    {invoice.customer?.name || 'Customer'}
                  </button>
                  <p className="text-sm text-gray-600">{invoice.customer?.email || '-'}</p>
                </div>

                {/* Invoice number */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">Invoice number</h4>
                  <p className="text-sm text-gray-900">{invoice.invoiceNumber}</p>
                </div>

                {/* Billing details */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">Billing details</h4>
                  <p className="text-sm text-gray-600">{invoice.customer?.address || 'No address'}</p>
                  {invoice.customer?.phone && <p className="text-sm text-gray-600 mt-1">{invoice.customer.phone}</p>}
                </div>

                {/* Currency */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">Currency</h4>
                  <p className="text-sm text-gray-900">{invoice.currency}</p>
                </div>

                {/* Notes */}
                <div className="col-span-2">
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">Notes</h4>
                  <p className="text-sm text-gray-600">{invoice.notes || '-'}</p>
                </div>

                {/* Payment method */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">Payment method</h4>
                  <p className="text-sm text-gray-900">{invoice.paymentMethod || 'Not specified'}</p>
                </div>

                {/* Tax calculation */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">Tax calculation</h4>
                  <div className="flex items-center gap-1 text-sm text-gray-900">
                    <span>{invoice.taxRate > 0 ? `${invoice.taxRate}% tax applied` : 'No tax rate applied'}</span>
                    <Info className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border-t border-gray-200 pt-6">
                <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 text-left text-xs font-semibold text-gray-700">Description</th>
                      <th className="pb-3 text-right text-xs font-semibold text-gray-700">Qty</th>
                      <th className="pb-3 text-right text-xs font-semibold text-gray-700">Unit price</th>
                      <th className="pb-3 text-right text-xs font-semibold text-gray-700">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items?.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-3 text-sm text-gray-900">{item.description}</td>
                        <td className="py-3 text-sm text-gray-600 text-right">{item.quantity}</td>
                        <td className="py-3 text-sm text-gray-600 text-right">${item.unitPrice.toLocaleString()}</td>
                        <td className="py-3 text-sm text-gray-900 text-right">${item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>

                {/* Totals */}
                <div className="mt-6 flex justify-end">
                  <div className="w-full sm:w-80 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">${invoice.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tax {invoice.taxRate > 0 && `(${invoice.taxRate}%)`}</span>
                      <span className="text-gray-900">{invoice.taxAmount ? `$${invoice.taxAmount.toLocaleString()}` : '-'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-semibold pt-2 border-t border-gray-200">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">${invoice.total.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-200">
                      <span className="text-gray-600">Amount paid</span>
                      <span className="text-gray-900">${invoice.amountPaid?.toLocaleString() || '0.00'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Amount due</span>
                      <span className="text-gray-900 font-semibold">${invoice.amountDue?.toLocaleString() || '0.00'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Calculation */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Tax calculation</h3>
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 mb-4">No tax rate applied.</p>
                <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                  <Info className="w-4 h-4" />
                  <span>Calculate tax automatically on future invoices using Stripe Tax.</span>
                  <button className="text-[#635BFF] hover:text-[#5045e5] ml-1">Start now</button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details */}
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-gray-900">Details</h3>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
                  <Edit2 className="w-3.5 h-3.5 text-gray-600" />
                </Button>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-xs text-gray-500 mb-2">ID</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-gray-900">{invoice.id}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 hover:bg-gray-100"
                      onClick={() => {
                        navigator.clipboard.writeText(invoice.id);
                        toast.success('Invoice ID copied to clipboard');
                      }}
                    >
                      <Copy className="w-3.5 h-3.5 text-gray-500" />
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2">Issue Date</p>
                  <p className="text-sm text-gray-900">
                    {new Date(invoice.issueDate).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                {invoice.dueDate && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Due Date</p>
                    <p className="text-sm text-gray-900">
                      {new Date(invoice.dueDate).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 mb-2">Created</p>
                  <p className="text-sm text-gray-900">
                    {new Date(invoice.createdAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-gray-900">Metadata</h3>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
                  <Edit2 className="w-3.5 h-3.5 text-gray-600" />
                </Button>
              </div>
              <p className="text-sm text-gray-500">No metadata</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
