import { InvoiceStyleProps } from '@/screens/invoice/NewInvoice';

export const CloudflareTemplate = ({ logo, invoiceData, paymentDetails: _paymentDetails }: InvoiceStyleProps) => {
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const taxAmount = (subtotal * (invoiceData.taxRate || 0)) / 100;
  const total = subtotal + taxAmount;

  return (
    <div className="w-full min-h-full bg-[#F5F5F0] p-12 font-sans text-gray-900">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-3xl font-normal text-black mb-8">Invoice</h1>
          <div className="space-y-0.5 text-sm text-gray-900">
            <div className="grid grid-cols-[140px_1fr]">
              <span>Invoice number</span>
              <span className="font-normal">{invoiceData.invoiceNumber}</span>
            </div>
            <div className="grid grid-cols-[140px_1fr]">
              <span>Date of issue</span>
              <span className="font-normal">{new Date(invoiceData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="grid grid-cols-[140px_1fr]">
              <span>Date due</span>
              <span className="font-normal">{invoiceData.dueDate ? new Date(invoiceData.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Upon receipt'}</span>
            </div>
          </div>
        </div>

        {/* Logo */}
        {logo && (
          <div className="flex-shrink-0">
            <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
          </div>
        )}
      </div>

      {/* From / Bill To Section */}
      <div className="grid grid-cols-2 gap-20 mb-10">
        {/* From */}
        <div className="text-sm space-y-0.5">
          <div className="font-semibold text-gray-900">{invoiceData.fromCompany}</div>
          {invoiceData.fromAddress && (
            <div className="whitespace-pre-line text-gray-900">{invoiceData.fromAddress}</div>
          )}
          {invoiceData.fromEmail && <div className="text-gray-900">{invoiceData.fromEmail}</div>}
          {invoiceData.fromTaxId && (
            <div className="text-gray-900 mt-1">
              IN GST {invoiceData.fromTaxId}
            </div>
          )}
        </div>

        {/* Bill To */}
        <div className="text-sm space-y-0.5">
          <div className="font-semibold text-gray-900 mb-0.5">Bill to</div>
          <div className="font-normal text-gray-900">{invoiceData.toCompany}</div>
          {invoiceData.toAddress && (
            <div className="whitespace-pre-line text-gray-900">{invoiceData.toAddress}</div>
          )}
          {invoiceData.toEmail && <div className="text-gray-900">{invoiceData.toEmail}</div>}
        </div>
      </div>

      {/* Amount Due Banner */}
      <div className="text-2xl font-semibold mb-10 text-black">
        ${total.toFixed(2)} {invoiceData.currency || 'USD'} due {invoiceData.dueDate ? new Date(invoiceData.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'upon receipt'}
      </div>

      {/* Line Items Table */}
      <div className="mb-8 border-t border-gray-300">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 py-3 border-b border-gray-300">
          <div className="col-span-6 text-sm text-gray-900">Description</div>
          <div className="col-span-2 text-sm text-gray-900 text-right">Qty</div>
          <div className="col-span-2 text-sm text-gray-900 text-right">Unit price</div>
          <div className="col-span-2 text-sm text-gray-900 text-right">Amount</div>
        </div>

        {/* Line Items */}
        {invoiceData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 py-4 border-b border-gray-200 last:border-b-gray-300">
            <div className="col-span-6">
              <div className="text-sm text-gray-900">{item.description}</div>
              {invoiceData.memo && index === 0 && (
                <div className="text-xs text-gray-700 mt-0.5">{invoiceData.memo}</div>
              )}
            </div>
            <div className="col-span-2 text-sm text-gray-900 text-right">{item.quantity}</div>
            <div className="col-span-2 text-sm text-gray-900 text-right">
              ${item.price.toFixed(2)}
            </div>
            <div className="col-span-2 text-sm text-gray-900 text-right">
              ${(item.quantity * item.price).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-16">
        <div className="w-80 space-y-1">
          <div className="grid grid-cols-2 gap-4 text-sm py-2">
            <span className="text-gray-900">Subtotal</span>
            <span className="text-gray-900 text-right">${subtotal.toFixed(2)}</span>
          </div>
          {invoiceData.taxRate && invoiceData.taxRate > 0 && (
            <div className="grid grid-cols-2 gap-4 text-sm py-2">
              <span className="text-gray-900">Tax ({invoiceData.taxRate}%)</span>
              <span className="text-gray-900 text-right">${taxAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 text-sm py-2 border-t border-gray-300">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900 text-right">${total.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm py-2 border-t border-gray-300 font-semibold">
            <span className="text-gray-900">Amount due</span>
            <span className="text-gray-900 text-right">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-gray-700 leading-relaxed space-y-3">
        {invoiceData.notes && (
          <p>{invoiceData.notes}</p>
        )}
        {invoiceData.terms && (
          <p>{invoiceData.terms}</p>
        )}
        <p className="text-gray-700">
          If this request is concerning an Enterprise invoice reach out to ar@{invoiceData.fromCompany?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'company'}.com. For all other billing concerns, submit your request here: https://dash.{invoiceData.fromCompany?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'company'}.com/?to=/account/support
        </p>
      </div>

      {/* Page Number */}
      <div className="text-right text-xs text-gray-600 mt-8">
        Page 1 of 1
      </div>
    </div>
  );
};
