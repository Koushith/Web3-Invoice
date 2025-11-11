import { QRCode } from 'react-qr-code';

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  memo: string;
  fromCompany: string;
  fromAddress: string;
  toCompany: string;
  toAddress: string;
  items: InvoiceItem[];
  notes: string;
  terms: string;
}

interface PaymentDetails {
  method: 'bank' | 'crypto' | 'other';
  bankDetails?: {
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    swiftCode?: string;
  };
  cryptoDetails?: {
    currency?: string;
    network?: string;
    walletAddress?: string;
  };
  otherDetails?: string;
}

interface TemplateProps {
  logo: string | null;
  invoiceData: InvoiceData;
  paymentDetails: PaymentDetails;
}

export function StandardTemplate({ logo, invoiceData, paymentDetails }: TemplateProps) {
  return (
    <div className="p-[25mm] space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="space-y-4">
          {logo && (
            <div className="w-32 h-16">
              <img src={logo} alt="Company Logo" className="w-full h-full object-contain" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">INVOICE</h1>
            <p className="text-sm text-muted-foreground mt-1">#{invoiceData.invoiceNumber}</p>
          </div>
        </div>

        <div className="text-right space-y-1">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Issue Date</p>
            <p className="font-medium">
              {invoiceData.date
                ? new Date(invoiceData.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Not specified'}
            </p>
          </div>
          {invoiceData.dueDate && (
            <div className="space-y-1 mt-4">
              <p className="text-sm text-muted-foreground">Due Date</p>
              <p className="font-medium">
                {new Date(invoiceData.dueDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-12">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">From</p>
          <div className="space-y-1">
            <p className="font-semibold text-gray-900">{invoiceData.fromCompany}</p>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {invoiceData.fromAddress}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Bill To</p>
          <div className="space-y-1">
            <p className="font-semibold text-gray-900">{invoiceData.toCompany}</p>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {invoiceData.toAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mt-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="py-3 text-left text-sm font-medium text-muted-foreground">Description</th>
              <th className="py-3 text-right text-sm font-medium text-muted-foreground w-24">Qty</th>
              <th className="py-3 text-right text-sm font-medium text-muted-foreground w-32">Price</th>
              <th className="py-3 text-right text-sm font-medium text-muted-foreground w-32">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {invoiceData.items.map((item, index) => (
              <tr key={index}>
                <td className="py-4 text-sm">{item.description}</td>
                <td className="py-4 text-sm text-right">{item.quantity}</td>
                <td className="py-4 text-sm text-right">${item.price.toFixed(2)}</td>
                <td className="py-4 text-sm text-right">${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border">
              <td colSpan={3} className="py-4 text-right font-medium">
                Total
              </td>
              <td className="py-4 text-right font-semibold text-lg">
                ${invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Payment Details */}
      <div className="space-y-4 pt-8 border-t border-border/50">
        <p className="text-sm font-medium text-muted-foreground">Payment Details</p>
        {paymentDetails.method === 'bank' && paymentDetails.bankDetails && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Bank Name</p>
              <p className="font-medium">{paymentDetails.bankDetails.bankName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Account Name</p>
              <p className="font-medium">{paymentDetails.bankDetails.accountName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Account Number</p>
              <p className="font-medium">{paymentDetails.bankDetails.accountNumber}</p>
            </div>
            {paymentDetails.bankDetails.swiftCode && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">SWIFT/BIC</p>
                <p className="font-medium">{paymentDetails.bankDetails.swiftCode}</p>
              </div>
            )}
          </div>
        )}
        {paymentDetails.method === 'crypto' && paymentDetails.cryptoDetails && paymentDetails.cryptoDetails.walletAddress && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {paymentDetails.cryptoDetails.currency && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Currency</p>
                  <p className="font-medium">{paymentDetails.cryptoDetails.currency}</p>
                </div>
              )}
              {paymentDetails.cryptoDetails.network && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Chain</p>
                  <p className="font-medium">{paymentDetails.cryptoDetails.network}</p>
                </div>
              )}
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-1 space-y-2">
                <p className="text-sm text-muted-foreground">Payment Address</p>
                <p className="font-medium font-mono text-sm break-all">
                  {paymentDetails.cryptoDetails.walletAddress}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border-2 border-gray-200 relative">
                <QRCode
                  value={paymentDetails.cryptoDetails.walletAddress}
                  size={120}
                  level="H"
                  className="w-full h-full"
                  style={{ height: "auto", maxWidth: "100%", width: "120px" }}
                />
                {logo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white p-1 rounded">
                      <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {paymentDetails.method === 'other' && paymentDetails.otherDetails && (
          <p className="text-sm whitespace-pre-line">{paymentDetails.otherDetails}</p>
        )}
      </div>

      {/* Notes & Terms */}
      <div className="grid grid-cols-2 gap-12 pt-8 border-t border-border/50">
        {invoiceData.notes && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Notes</p>
            <p className="text-sm text-gray-600 whitespace-pre-line">{invoiceData.notes}</p>
          </div>
        )}
        {invoiceData.terms && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Terms & Conditions</p>
            <p className="text-sm text-gray-600 whitespace-pre-line">{invoiceData.terms}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function ModernTemplate({ logo, invoiceData, paymentDetails }: TemplateProps) {
  return (
    <div className="p-[25mm] space-y-8">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-[#635bff] to-[#5045e5] -mx-[25mm] -mt-[25mm] px-[25mm] pt-[25mm] pb-12 text-white">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            {logo && (
              <div className="w-32 h-16 bg-white rounded-lg p-2">
                <img src={logo} alt="Company Logo" className="w-full h-full object-contain" />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold">INVOICE</h1>
              <p className="text-lg opacity-90 mt-2">#{invoiceData.invoiceNumber}</p>
            </div>
          </div>

          <div className="text-right space-y-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="space-y-1">
              <p className="text-sm opacity-80">Issue Date</p>
              <p className="font-semibold">
                {invoiceData.date
                  ? new Date(invoiceData.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Not specified'}
              </p>
            </div>
            {invoiceData.dueDate && (
              <div className="space-y-1 pt-2 border-t border-white/20">
                <p className="text-sm opacity-80">Due Date</p>
                <p className="font-semibold">
                  {new Date(invoiceData.dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-12">
        <div className="space-y-3">
          <div className="inline-block bg-gray-100 rounded-full px-3 py-1">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">From</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-gray-900 text-lg">{invoiceData.fromCompany}</p>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {invoiceData.fromAddress}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="inline-block bg-[#635bff]/10 rounded-full px-3 py-1">
            <p className="text-xs font-bold text-[#635bff] uppercase tracking-wider">Bill To</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-gray-900 text-lg">{invoiceData.toCompany}</p>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {invoiceData.toAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mt-8">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-y border-gray-200">
              <th className="py-4 px-4 text-left text-sm font-bold text-gray-700">Description</th>
              <th className="py-4 px-4 text-right text-sm font-bold text-gray-700 w-24">Qty</th>
              <th className="py-4 px-4 text-right text-sm font-bold text-gray-700 w-32">Price</th>
              <th className="py-4 px-4 text-right text-sm font-bold text-gray-700 w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-4 px-4 text-sm font-medium">{item.description}</td>
                <td className="py-4 px-4 text-sm text-right">{item.quantity}</td>
                <td className="py-4 px-4 text-sm text-right">${item.price.toFixed(2)}</td>
                <td className="py-4 px-4 text-sm text-right font-semibold">${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gradient-to-r from-[#635bff] to-[#5045e5] text-white">
              <td colSpan={3} className="py-4 px-4 text-right font-bold text-lg">
                Total
              </td>
              <td className="py-4 px-4 text-right font-bold text-2xl">
                ${invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Payment Details */}
      <div className="space-y-4 pt-6 border-t-2 border-gray-200">
        <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">Payment Details</p>
        {paymentDetails.method === 'bank' && paymentDetails.bankDetails && (
          <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-6">
            {paymentDetails.bankDetails.bankName && (
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-semibold uppercase">Bank Name</p>
                <p className="font-bold text-gray-900">{paymentDetails.bankDetails.bankName}</p>
              </div>
            )}
            {paymentDetails.bankDetails.accountName && (
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-semibold uppercase">Account Name</p>
                <p className="font-bold text-gray-900">{paymentDetails.bankDetails.accountName}</p>
              </div>
            )}
            {paymentDetails.bankDetails.accountNumber && (
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-semibold uppercase">Account Number</p>
                <p className="font-bold text-gray-900">{paymentDetails.bankDetails.accountNumber}</p>
              </div>
            )}
            {paymentDetails.bankDetails.swiftCode && (
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-semibold uppercase">SWIFT/BIC</p>
                <p className="font-bold text-gray-900">{paymentDetails.bankDetails.swiftCode}</p>
              </div>
            )}
          </div>
        )}
        {paymentDetails.method === 'crypto' && paymentDetails.cryptoDetails && paymentDetails.cryptoDetails.walletAddress && (
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex gap-6 items-start">
              <div className="flex-1 space-y-4">
                {paymentDetails.cryptoDetails.currency && (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 font-semibold uppercase">Currency</p>
                    <p className="font-bold text-gray-900">{paymentDetails.cryptoDetails.currency}</p>
                  </div>
                )}
                {paymentDetails.cryptoDetails.network && (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 font-semibold uppercase">Chain</p>
                    <p className="font-bold text-gray-900">{paymentDetails.cryptoDetails.network}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-semibold uppercase">Address</p>
                  <p className="font-bold text-gray-900 font-mono text-xs break-all">{paymentDetails.cryptoDetails.walletAddress}</p>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border-2 border-gray-200 relative flex-shrink-0">
                <QRCode
                  value={paymentDetails.cryptoDetails.walletAddress}
                  size={120}
                  level="H"
                  style={{ height: "auto", maxWidth: "100%", width: "120px" }}
                />
                {logo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white p-1 rounded">
                      <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {paymentDetails.method === 'other' && paymentDetails.otherDetails && (
          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-sm whitespace-pre-line text-gray-700">{paymentDetails.otherDetails}</p>
          </div>
        )}
      </div>

      {/* Notes */}
      {(invoiceData.notes || invoiceData.terms) && (
        <div className="grid grid-cols-2 gap-12 pt-6 border-t border-gray-200">
          {invoiceData.notes && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Notes</p>
              <p className="text-sm text-gray-600 whitespace-pre-line">{invoiceData.notes}</p>
            </div>
          )}
          {invoiceData.terms && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Terms</p>
              <p className="text-sm text-gray-600 whitespace-pre-line">{invoiceData.terms}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function MinimalTemplate({ logo, invoiceData, paymentDetails }: TemplateProps) {
  return (
    <div className="p-[30mm] space-y-12">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-gray-900 pb-6">
        <div>
          {logo && (
            <div className="w-28 h-14 mb-4">
              <img src={logo} alt="Company Logo" className="w-full h-full object-contain" />
            </div>
          )}
          <h1 className="text-5xl font-light text-gray-900 tracking-tight">Invoice</h1>
        </div>

        <div className="text-right">
          <p className="text-3xl font-light text-gray-900">#{invoiceData.invoiceNumber}</p>
          <div className="mt-4 space-y-1 text-sm">
            <p className="text-gray-600">{invoiceData.date ? new Date(invoiceData.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Date'}</p>
            {invoiceData.dueDate && (
              <p className="text-gray-900 font-medium">Due: {new Date(invoiceData.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            )}
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-16">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">From</p>
          <p className="font-semibold text-gray-900">{invoiceData.fromCompany}</p>
          <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
            {invoiceData.fromAddress}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">To</p>
          <p className="font-semibold text-gray-900">{invoiceData.toCompany}</p>
          <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
            {invoiceData.toAddress}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-4">
        {invoiceData.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.description}</p>
              <p className="text-sm text-gray-500 mt-1">{item.quantity} × ${item.price.toFixed(2)}</p>
            </div>
            <p className="font-semibold text-gray-900 text-lg">${(item.quantity * item.price).toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-end pt-6 border-t-2 border-gray-900">
        <div className="space-y-2">
          <div className="flex gap-12 items-baseline">
            <p className="text-lg font-light text-gray-600">Total</p>
            <p className="text-4xl font-light text-gray-900">
              ${invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      {paymentDetails.method === 'bank' && paymentDetails.bankDetails && (
        <div className="space-y-3 pt-8 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Payment Information</p>
          <div className="space-y-2 text-sm">
            <p className="text-gray-600">{paymentDetails.bankDetails.bankName}</p>
            <p className="text-gray-600">{paymentDetails.bankDetails.accountName}</p>
            <p className="font-mono text-gray-900">{paymentDetails.bankDetails.accountNumber}</p>
            {paymentDetails.bankDetails.swiftCode && (
              <p className="font-mono text-gray-900">{paymentDetails.bankDetails.swiftCode}</p>
            )}
          </div>
        </div>
      )}

      {paymentDetails.method === 'crypto' && paymentDetails.cryptoDetails && paymentDetails.cryptoDetails.walletAddress && (
        <div className="space-y-3 pt-8 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Payment Information</p>
          <div className="flex gap-6 items-start">
            <div className="flex-1 space-y-3">
              {paymentDetails.cryptoDetails.currency && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Currency</p>
                  <p className="font-medium">{paymentDetails.cryptoDetails.currency}</p>
                </div>
              )}
              {paymentDetails.cryptoDetails.network && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Chain</p>
                  <p className="font-medium">{paymentDetails.cryptoDetails.network}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 mb-1">Address</p>
                <p className="font-mono text-sm break-all">{paymentDetails.cryptoDetails.walletAddress}</p>
              </div>
            </div>
            <div className="bg-white p-2 border border-gray-900 relative">
              <QRCode
                value={paymentDetails.cryptoDetails.walletAddress}
                size={100}
                level="H"
                className="w-full h-full"
                style={{ height: "auto", maxWidth: "100%", width: "100px" }}
              />
              {logo && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-1">
                    <img src={logo} alt="Logo" className="w-6 h-6 object-contain" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {paymentDetails.method === 'other' && paymentDetails.otherDetails && (
        <div className="space-y-3 pt-8 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Payment Information</p>
          <p className="text-sm whitespace-pre-line">{paymentDetails.otherDetails}</p>
        </div>
      )}

      {/* Notes and Terms */}
      {(invoiceData.notes || invoiceData.terms) && (
        <div className="space-y-6 pt-8 border-t border-gray-200">
          {invoiceData.notes && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Notes</p>
              <p className="text-sm text-gray-600 whitespace-pre-line">{invoiceData.notes}</p>
            </div>
          )}
          {invoiceData.terms && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Terms & Conditions</p>
              <p className="text-sm text-gray-600 whitespace-pre-line">{invoiceData.terms}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ArtisticTemplate({ logo, invoiceData, paymentDetails }: TemplateProps) {
  return (
    <div className="p-[25mm] space-y-10 relative" style={{ fontFamily: "'Courier New', monospace" }}>
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-widest text-gray-500">From:</p>
          <div className="text-sm leading-relaxed">
            <p className="font-semibold">{invoiceData.fromCompany}</p>
            <p className="text-gray-600 whitespace-pre-line">{invoiceData.fromAddress}</p>
          </div>
        </div>

        <div className="text-right">
          <h1 className="text-2xl font-light tracking-wide">Invoice</h1>
          <p className="text-lg mt-1">#{invoiceData.invoiceNumber}</p>
        </div>
      </div>

      {/* Bill To & Dates */}
      <div className="grid grid-cols-2 gap-12">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-gray-500">Billed to:</p>
          <p className="text-sm font-semibold">{invoiceData.toCompany}</p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Issue Date</span>
            <span className="font-medium">
              {invoiceData.date ? new Date(invoiceData.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '4th October, 2025'}
            </span>
          </div>
          {invoiceData.dueDate && (
            <div className="flex justify-between">
              <span className="text-gray-600">Due Date</span>
              <span className="font-medium">
                {new Date(invoiceData.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Amount Due</span>
            <span className="font-medium">${invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(0)}</span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-6 py-8 border-t border-b border-gray-200">
        <div className="flex justify-between text-xs uppercase tracking-widest text-gray-500">
          <span>Item</span>
          <span>Cost</span>
        </div>
        {invoiceData.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{item.description}</span>
            <span className="font-medium">{item.quantity * item.price}</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-between text-base">
        <span className="font-semibold">Total</span>
        <span className="font-semibold">${invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)} USD</span>
      </div>

      {/* Floral Design - Bottom Left */}
      <div className="absolute bottom-[20mm] left-0 w-48 h-48 opacity-90">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Autumn Flowers Illustration */}
          <circle cx="60" cy="140" r="15" fill="#E8956C" opacity="0.8"/>
          <circle cx="58" cy="138" r="8" fill="#F5C89B" opacity="0.9"/>

          <ellipse cx="40" cy="155" rx="12" ry="18" fill="#D4887F" opacity="0.7" transform="rotate(-30 40 155)"/>
          <ellipse cx="42" cy="153" rx="6" ry="10" fill="#F5C89B" opacity="0.8" transform="rotate(-30 42 153)"/>

          <circle cx="85" cy="165" r="18" fill="#C97D6C" opacity="0.75"/>
          <circle cx="85" cy="165" r="10" fill="#F5D4A0" opacity="0.85"/>
          <circle cx="88" cy="162" r="4" fill="#8B5A3C" opacity="0.6"/>

          <path d="M 70 170 Q 75 160 80 170 Q 85 180 90 170 Q 95 160 100 170" stroke="#6B9080" strokeWidth="2" fill="none" opacity="0.6"/>
          <path d="M 75 175 L 75 185" stroke="#8B7355" strokeWidth="1.5" opacity="0.5"/>
          <path d="M 85 175 L 85 190" stroke="#8B7355" strokeWidth="2" opacity="0.6"/>

          <ellipse cx="30" cy="170" rx="10" ry="15" fill="#E8A87C" opacity="0.7" transform="rotate(20 30 170)"/>
          <ellipse cx="32" cy="168" rx="5" ry="8" fill="#F5D4A0" opacity="0.8" transform="rotate(20 32 168)"/>

          <path d="M 50 180 Q 55 175 60 180" stroke="#D4A574" strokeWidth="3" fill="none" opacity="0.5" strokeLinecap="round"/>
          <path d="M 65 185 Q 70 180 75 185" stroke="#C97D6C" strokeWidth="2.5" fill="none" opacity="0.5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Payment Details */}
      {paymentDetails.method === 'bank' && paymentDetails.bankDetails && (
        <div className="space-y-4 pt-6 relative z-10">
          <p className="text-sm font-semibold border-b border-gray-300 pb-2">Payment Details</p>
          <div className="text-sm space-y-1.5 leading-relaxed">
            <div className="flex">
              <span className="text-gray-600 w-32">Name</span>
              <span className="text-gray-600">:</span>
              <span className="ml-2 font-medium">{paymentDetails.bankDetails.accountName}</span>
            </div>
            <div className="flex">
              <span className="text-gray-600 w-32">Bank</span>
              <span className="text-gray-600">:</span>
              <span className="ml-2 font-medium">{paymentDetails.bankDetails.bankName}</span>
            </div>
            <div className="flex">
              <span className="text-gray-600 w-32">Account Number</span>
              <span className="text-gray-600">:</span>
              <span className="ml-2 font-medium font-mono">{paymentDetails.bankDetails.accountNumber}</span>
            </div>
            {paymentDetails.bankDetails.swiftCode && (
              <div className="flex">
                <span className="text-gray-600 w-32">SWIFT</span>
                <span className="text-gray-600">:</span>
                <span className="ml-2 font-medium font-mono">{paymentDetails.bankDetails.swiftCode}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {paymentDetails.method === 'crypto' && paymentDetails.cryptoDetails && paymentDetails.cryptoDetails.walletAddress && (
        <div className="space-y-4 pt-6 relative z-10">
          <p className="text-sm font-semibold border-b border-gray-300 pb-2">Payment Details</p>
          <div className="flex gap-6 items-start">
            <div className="flex-1 text-sm space-y-2">
              {paymentDetails.cryptoDetails.currency && (
                <div className="flex">
                  <span className="text-gray-600 w-32">Currency</span>
                  <span className="text-gray-600">:</span>
                  <span className="ml-2 font-medium">{paymentDetails.cryptoDetails.currency}</span>
                </div>
              )}
              {paymentDetails.cryptoDetails.network && (
                <div className="flex">
                  <span className="text-gray-600 w-32">Chain</span>
                  <span className="text-gray-600">:</span>
                  <span className="ml-2 font-medium">{paymentDetails.cryptoDetails.network}</span>
                </div>
              )}
              <div>
                <div className="flex mb-1">
                  <span className="text-gray-600 w-32">Address</span>
                  <span className="text-gray-600">:</span>
                </div>
                <p className="font-mono text-xs break-all ml-2">{paymentDetails.cryptoDetails.walletAddress}</p>
              </div>
            </div>
            <div className="bg-white p-2 border border-gray-300 relative shrink-0">
              <QRCode
                value={paymentDetails.cryptoDetails.walletAddress}
                size={100}
                level="H"
                className="w-full h-full"
                style={{ height: "auto", maxWidth: "100%", width: "100px" }}
              />
              {logo && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-1">
                    <img src={logo} alt="Logo" className="w-6 h-6 object-contain" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {paymentDetails.method === 'other' && paymentDetails.otherDetails && (
        <div className="space-y-4 pt-6 relative z-10">
          <p className="text-sm font-semibold border-b border-gray-300 pb-2">Payment Details</p>
          <p className="text-sm whitespace-pre-line leading-relaxed">{paymentDetails.otherDetails}</p>
        </div>
      )}

      {/* Notes and Terms */}
      {(invoiceData.notes || invoiceData.terms) && (
        <div className="space-y-6 pt-6 relative z-10">
          {invoiceData.notes && (
            <div>
              <p className="text-sm font-semibold border-b border-gray-300 pb-2">Notes</p>
              <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed pt-3">{invoiceData.notes}</p>
            </div>
          )}
          {invoiceData.terms && (
            <div>
              <p className="text-sm font-semibold border-b border-gray-300 pb-2">Terms & Conditions</p>
              <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed pt-3">{invoiceData.terms}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
