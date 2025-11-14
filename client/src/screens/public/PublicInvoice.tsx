import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, CheckCircle2, Clock, AlertCircle, Download, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface Invoice {
  _id: string;
  invoiceNumber: string;
  status: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  notes?: string;
  terms?: string;
  customerId: {
    name: string;
    email: string;
    company?: string;
    address?: any;
    phone?: string;
  };
  organizationId: {
    name: string;
    email?: string;
    phone?: string;
    address?: any;
    logo?: string;
    website?: string;
  };
}

export const PublicInvoiceScreen = () => {
  const { publicId } = useParams<{ publicId: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
        const response = await fetch(`${apiUrl}/invoices/public/${publicId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to load invoice');
        }

        const data = await response.json();
        setInvoice(data.data);
      } catch (err: any) {
        console.error('Error fetching invoice:', err);
        setError(err.message || 'Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };

    if (publicId) {
      fetchInvoice();
    }
  }, [publicId]);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
      paid: { color: 'bg-green-50 text-green-700 border border-green-200', icon: CheckCircle2, label: 'Paid' },
      partial: { color: 'bg-blue-50 text-blue-700 border border-blue-200', icon: Clock, label: 'Partially Paid' },
      sent: { color: 'bg-gray-100 text-gray-700 border border-gray-200', icon: Clock, label: 'Sent' },
      viewed: { color: 'bg-purple-50 text-purple-700 border border-purple-200', icon: Clock, label: 'Viewed' },
      overdue: { color: 'bg-red-50 text-red-700 border border-red-200', icon: AlertCircle, label: 'Overdue' },
      draft: { color: 'bg-gray-100 text-gray-600 border border-gray-200', icon: Clock, label: 'Draft' },
    };

    const config = statusConfig[status] || statusConfig.sent;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg ${config.color}`}>
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#635bff] mx-auto mb-4" />
          <p className="text-sm text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Invoice Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || 'The invoice you are looking for does not exist or has been removed.'}
          </p>
        </div>
      </div>
    );
  }

  const formatAddress = (address: any) => {
    if (!address) return null;
    const parts = [
      address.street,
      [address.city, address.state, address.postalCode || address.zipCode].filter(Boolean).join(', '),
      address.country,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join('\n') : null;
  };

  return (
    <>
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          body {
            margin: 0;
            padding: 20px;
            background: white !important;
          }
          .no-print { display: none !important; }
          .print-full-width { max-width: 100% !important; }
          .bg-gray-50 { background: white !important; }
          .shadow-lg, .shadow-md, .shadow-sm { box-shadow: none !important; }
        }
      `}</style>
      <div className="min-h-screen bg-gray-50 py-8 px-4 print:bg-white print:py-0">
        <div className="max-w-4xl mx-auto print-full-width">
        {/* Branding Bar */}
        <div className="text-center mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Invoice</p>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-10 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            {/* Organization Info */}
            <div className="flex-1">
              {invoice.organizationId.logo ? (
                <img src={invoice.organizationId.logo} alt={invoice.organizationId.name} className="h-12 mb-4" />
              ) : (
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#635bff] rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{invoice.organizationId.name}</h2>
                  </div>
                </div>
              )}
              {invoice.organizationId.email && (
                <p className="text-sm text-gray-600">{invoice.organizationId.email}</p>
              )}
              {invoice.organizationId.phone && (
                <p className="text-sm text-gray-600">{invoice.organizationId.phone}</p>
              )}
              {formatAddress(invoice.organizationId.address) && (
                <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">
                  {formatAddress(invoice.organizationId.address)}
                </p>
              )}
            </div>

            {/* Invoice Info */}
            <div className="text-left md:text-right">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                INVOICE
              </h1>
              <p className="text-xl font-bold text-gray-900 mb-4">{invoice.invoiceNumber}</p>
              {getStatusBadge(invoice.status)}
            </div>
          </div>

          {/* Bill To & Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-gray-200">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Bill To</h3>
              <div>
                <p className="font-semibold text-gray-900">{invoice.customerId.company || invoice.customerId.name}</p>
                {invoice.customerId.company && invoice.customerId.name && (
                  <p className="text-sm text-gray-600">{invoice.customerId.name}</p>
                )}
                <p className="text-sm text-gray-600">{invoice.customerId.email}</p>
                {invoice.customerId.phone && (
                  <p className="text-sm text-gray-600">{invoice.customerId.phone}</p>
                )}
                {formatAddress(invoice.customerId.address) && (
                  <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">
                    {formatAddress(invoice.customerId.address)}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Issue Date</p>
                  <p className="text-sm text-gray-900">{format(new Date(invoice.issueDate), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Due Date</p>
                  <p className="text-sm text-gray-900">{invoice.dueDate ? format(new Date(invoice.dueDate), 'MMM d, yyyy') : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-900">
                    <th className="text-left py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="text-right py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="text-right py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="text-right py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoice.lineItems.map((item, index) => (
                    <tr key={index}>
                      <td className="py-4 text-sm text-gray-900">{item.description}</td>
                      <td className="py-4 text-sm text-gray-600 text-right">{item.quantity}</td>
                      <td className="py-4 text-sm text-gray-600 text-right">
                        {invoice.currency} {item.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-4 text-sm font-medium text-gray-900 text-right">
                        {invoice.currency} {item.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-8 flex justify-end">
              <div className="w-full md:w-80 space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium text-gray-900">
                    {invoice.currency} {invoice.subtotal.toFixed(2)}
                  </span>
                </div>
                {invoice.taxRate > 0 && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Tax ({invoice.taxRate}%)</span>
                    <span className="text-sm font-medium text-gray-900">
                      {invoice.currency} {invoice.taxAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-4 bg-gray-900 px-6 rounded-xl">
                  <span className="text-base font-bold text-white uppercase tracking-wide">Total</span>
                  <span className="text-2xl font-bold text-white">
                    {invoice.currency} {invoice.total.toFixed(2)}
                  </span>
                </div>
                {invoice.amountPaid > 0 && (
                  <>
                    <div className="flex justify-between py-3 bg-green-50 px-4 rounded-lg border border-green-200">
                      <span className="text-sm font-semibold text-green-900">Amount Paid</span>
                      <span className="text-base font-bold text-green-700">
                        -{invoice.currency} {invoice.amountPaid.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between py-4 bg-blue-600 px-6 rounded-xl border border-blue-500">
                      <span className="text-base font-bold text-white uppercase tracking-wide">Amount Due</span>
                      <span className="text-2xl font-bold text-white">
                        {invoice.currency} {invoice.amountDue.toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          {(invoice.notes || invoice.terms) && (
            <div className="mt-8 pt-8 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
              {invoice.notes && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Notes</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{invoice.notes}</p>
                </div>
              )}
              {invoice.terms && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Terms</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{invoice.terms}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center no-print">
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="h-12 px-8 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl font-semibold text-gray-700 transition-all shadow-sm hover:shadow-md"
          >
            <Download className="w-5 h-5 mr-2" />
            Download PDF
          </Button>
          {invoice.status !== 'paid' && invoice.amountDue > 0 && (
            <Button
              className="h-12 px-10 bg-[#635bff] hover:bg-[#5045e5] text-white rounded-xl font-semibold"
            >
              Pay {invoice.currency} {invoice.amountDue.toFixed(2)}
            </Button>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            This invoice was generated electronically and is valid without signature.
          </p>
          <a
            href="https://definvoice.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#635bff] hover:text-[#5045e5] mt-2 inline-block no-print"
          >
            visit definvoice
          </a>
        </div>
      </div>
      </div>
    </>
  );
};
