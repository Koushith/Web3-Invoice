import QRCode from 'react-qr-code';

// Helper function to get currency symbol
const getCurrencySymbol = (currency?: string): string => {
  if (!currency) return '$';

  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    CNY: '¥',
    CAD: 'C$',
    AUD: 'A$',
  };

  return currencySymbols[currency] || currency;
};

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  memo?: string;
  fromCompany: string;
  fromAddress: string;
  toCompany: string;
  toAddress: string;
  items: InvoiceItem[];
  notes: string;
  terms: string;
  currency?: string;
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
  const currencySymbol = getCurrencySymbol(invoiceData.currency);

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
            <p className="text-sm text-gray-600 whitespace-pre-line">{invoiceData.fromAddress}</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Bill To</p>
          <div className="space-y-1">
            <p className="font-semibold text-gray-900">{invoiceData.toCompany}</p>
            <p className="text-sm text-gray-600 whitespace-pre-line">{invoiceData.toAddress}</p>
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
                <td className="py-4 text-sm text-right">
                  {currencySymbol}
                  {item.price.toFixed(2)}
                </td>
                <td className="py-4 text-sm text-right">
                  {currencySymbol}
                  {(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border">
              <td colSpan={3} className="py-4 text-right font-medium">
                Total
              </td>
              <td className="py-4 text-right font-semibold text-lg">
                {currencySymbol}
                {invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}
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
        {paymentDetails.method === 'crypto' &&
          paymentDetails.cryptoDetails &&
          paymentDetails.cryptoDetails.walletAddress && (
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
                    style={{ height: 'auto', maxWidth: '100%', width: '120px' }}
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
  const currencySymbol = getCurrencySymbol(invoiceData.currency);

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
            <p className="text-sm text-gray-600 whitespace-pre-line">{invoiceData.fromAddress}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="inline-block bg-[#635bff]/10 rounded-full px-3 py-1">
            <p className="text-xs font-bold text-[#635bff] uppercase tracking-wider">Bill To</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-gray-900 text-lg">{invoiceData.toCompany}</p>
            <p className="text-sm text-gray-600 whitespace-pre-line">{invoiceData.toAddress}</p>
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
                <td className="py-4 px-4 text-sm text-right">
                  {currencySymbol}
                  {item.price.toFixed(2)}
                </td>
                <td className="py-4 px-4 text-sm text-right font-semibold">
                  {currencySymbol}
                  {(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gradient-to-r from-[#635bff] to-[#5045e5] text-white">
              <td colSpan={3} className="py-4 px-4 text-right font-bold text-lg">
                Total
              </td>
              <td className="py-4 px-4 text-right font-bold text-2xl">
                {currencySymbol}
                {invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}
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
        {paymentDetails.method === 'crypto' &&
          paymentDetails.cryptoDetails &&
          paymentDetails.cryptoDetails.walletAddress && (
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
                    <p className="font-bold text-gray-900 font-mono text-xs break-all">
                      {paymentDetails.cryptoDetails.walletAddress}
                    </p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border-2 border-gray-200 relative flex-shrink-0">
                  <QRCode
                    value={paymentDetails.cryptoDetails.walletAddress}
                    size={120}
                    level="H"
                    style={{ height: 'auto', maxWidth: '100%', width: '120px' }}
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
  const currencySymbol = getCurrencySymbol(invoiceData.currency);

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
            <p className="text-gray-600">
              {invoiceData.date
                ? new Date(invoiceData.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Date'}
            </p>
            {invoiceData.dueDate && (
              <p className="text-gray-900 font-medium">
                Due:{' '}
                {new Date(invoiceData.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-16">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">From</p>
          <p className="font-semibold text-gray-900">{invoiceData.fromCompany}</p>
          <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{invoiceData.fromAddress}</p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">To</p>
          <p className="font-semibold text-gray-900">{invoiceData.toCompany}</p>
          <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{invoiceData.toAddress}</p>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-4">
        {invoiceData.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                {item.quantity} × {currencySymbol}
                {item.price.toFixed(2)}
              </p>
            </div>
            <p className="font-semibold text-gray-900 text-lg">
              {currencySymbol}
              {(item.quantity * item.price).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-end pt-6 border-t-2 border-gray-900">
        <div className="space-y-2">
          <div className="flex gap-12 items-baseline">
            <p className="text-lg font-light text-gray-600">Total</p>
            <p className="text-4xl font-light text-gray-900">
              {currencySymbol}
              {invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}
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

      {paymentDetails.method === 'crypto' &&
        paymentDetails.cryptoDetails &&
        paymentDetails.cryptoDetails.walletAddress && (
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
                  style={{ height: 'auto', maxWidth: '100%', width: '100px' }}
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
  const currencySymbol = getCurrencySymbol(invoiceData.currency);

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
              {invoiceData.date
                ? new Date(invoiceData.date).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : '4th October, 2025'}
            </span>
          </div>
          {invoiceData.dueDate && (
            <div className="flex justify-between">
              <span className="text-gray-600">Due Date</span>
              <span className="font-medium">
                {new Date(invoiceData.dueDate).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Amount Due</span>
            <span className="font-medium">
              {currencySymbol}
              {invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(0)}
            </span>
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
            <span className="font-medium">
              {currencySymbol}
              {item.quantity * item.price}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-between text-base">
        <span className="font-semibold">Total</span>
        <span className="font-semibold">
          {currencySymbol}
          {invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}
        </span>
      </div>

      {/* Floral Design - Bottom Left */}
      <div className="absolute bottom-[20mm] left-0 w-48 h-48 opacity-90">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Autumn Flowers Illustration */}
          <circle cx="60" cy="140" r="15" fill="#E8956C" opacity="0.8" />
          <circle cx="58" cy="138" r="8" fill="#F5C89B" opacity="0.9" />

          <ellipse cx="40" cy="155" rx="12" ry="18" fill="#D4887F" opacity="0.7" transform="rotate(-30 40 155)" />
          <ellipse cx="42" cy="153" rx="6" ry="10" fill="#F5C89B" opacity="0.8" transform="rotate(-30 42 153)" />

          <circle cx="85" cy="165" r="18" fill="#C97D6C" opacity="0.75" />
          <circle cx="85" cy="165" r="10" fill="#F5D4A0" opacity="0.85" />
          <circle cx="88" cy="162" r="4" fill="#8B5A3C" opacity="0.6" />

          <path
            d="M 70 170 Q 75 160 80 170 Q 85 180 90 170 Q 95 160 100 170"
            stroke="#6B9080"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
          <path d="M 75 175 L 75 185" stroke="#8B7355" strokeWidth="1.5" opacity="0.5" />
          <path d="M 85 175 L 85 190" stroke="#8B7355" strokeWidth="2" opacity="0.6" />

          <ellipse cx="30" cy="170" rx="10" ry="15" fill="#E8A87C" opacity="0.7" transform="rotate(20 30 170)" />
          <ellipse cx="32" cy="168" rx="5" ry="8" fill="#F5D4A0" opacity="0.8" transform="rotate(20 32 168)" />

          <path
            d="M 50 180 Q 55 175 60 180"
            stroke="#D4A574"
            strokeWidth="3"
            fill="none"
            opacity="0.5"
            strokeLinecap="round"
          />
          <path
            d="M 65 185 Q 70 180 75 185"
            stroke="#C97D6C"
            strokeWidth="2.5"
            fill="none"
            opacity="0.5"
            strokeLinecap="round"
          />
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

      {paymentDetails.method === 'crypto' &&
        paymentDetails.cryptoDetails &&
        paymentDetails.cryptoDetails.walletAddress && (
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
                  style={{ height: 'auto', maxWidth: '100%', width: '100px' }}
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

// Professional Template - Clean enterprise design
export function GradientTemplate({ logo, invoiceData, paymentDetails }: TemplateProps) {
  const currencySymbol = getCurrencySymbol(invoiceData.currency);
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const total = subtotal;

  return (
    <div className="bg-white p-[25mm] min-h-[297mm]">
      {/* Header */}
      <div className="flex justify-between items-start pb-8 mb-8 border-b-2 border-gray-300">
        <div className="space-y-4">
          {logo && (
            <div className="w-40 h-20">
              <img src={logo} alt="Company Logo" className="w-full h-full object-contain" />
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold text-gray-900">INVOICE</h1>
            <p className="text-gray-600 mt-1">#{invoiceData.invoiceNumber}</p>
          </div>
        </div>
        <div className="text-right space-y-2 bg-gray-50 p-5 border border-gray-200">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Date</p>
            <p className="text-gray-900 font-semibold">
              {invoiceData.date
                ? new Date(invoiceData.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'N/A'}
            </p>
          </div>
          {invoiceData.dueDate && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500 uppercase font-semibold">Due Date</p>
              <p className="text-gray-900 font-semibold">
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

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-8 mb-10">
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold mb-3">From</p>
          <p className="text-gray-900 font-bold text-lg">{invoiceData.fromCompany}</p>
          <p className="text-gray-600 text-sm mt-2 whitespace-pre-line leading-relaxed">{invoiceData.fromAddress}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold mb-3">Bill To</p>
          <p className="text-gray-900 font-bold text-lg">{invoiceData.toCompany}</p>
          <p className="text-gray-600 text-sm mt-2 whitespace-pre-line leading-relaxed">{invoiceData.toAddress}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-900">
              <th className="py-3 px-4 text-left text-xs font-semibold text-white uppercase">Description</th>
              <th className="py-3 px-4 text-center text-xs font-semibold text-white uppercase">Qty</th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-white uppercase">Unit Price</th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-white uppercase">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <td className="py-3 px-4 text-gray-900">{item.description}</td>
                <td className="py-3 px-4 text-center text-gray-700">{item.quantity}</td>
                <td className="py-3 px-4 text-right text-gray-700">
                  {currencySymbol}
                  {item.price.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right text-gray-900 font-semibold">
                  {currencySymbol}
                  {(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="flex justify-end mb-10">
        <div className="w-80">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900 font-semibold">
              {currencySymbol}
              {subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-3 bg-gray-900 px-4 mt-2">
            <span className="text-white font-bold">Total Due</span>
            <span className="text-white font-bold text-xl">
              {currencySymbol}
              {total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      {(paymentDetails.method || invoiceData.notes) && (
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-200">
          {paymentDetails.method && (
            <div>
              <h3 className="text-gray-900 font-bold mb-3 text-sm uppercase">Payment Information</h3>
              {paymentDetails.method === 'bank' && paymentDetails.bankDetails && (
                <div className="space-y-1 text-sm">
                  {paymentDetails.bankDetails.bankName && (
                    <p>
                      <span className="text-gray-500">Bank:</span>{' '}
                      <span className="text-gray-900 ml-2">{paymentDetails.bankDetails.bankName}</span>
                    </p>
                  )}
                  {paymentDetails.bankDetails.accountName && (
                    <p>
                      <span className="text-gray-500">Account Name:</span>{' '}
                      <span className="text-gray-900 ml-2">{paymentDetails.bankDetails.accountName}</span>
                    </p>
                  )}
                  {paymentDetails.bankDetails.accountNumber && (
                    <p>
                      <span className="text-gray-500">Account Number:</span>{' '}
                      <span className="text-gray-900 font-mono ml-2">{paymentDetails.bankDetails.accountNumber}</span>
                    </p>
                  )}
                  {paymentDetails.bankDetails.swiftCode && (
                    <p>
                      <span className="text-gray-500">SWIFT:</span>{' '}
                      <span className="text-gray-900 font-mono ml-2">{paymentDetails.bankDetails.swiftCode}</span>
                    </p>
                  )}
                </div>
              )}
              {paymentDetails.method === 'crypto' && paymentDetails.cryptoDetails?.walletAddress && (
                <div className="mt-3 p-3 bg-gray-50 border border-gray-200">
                  <div className="flex justify-center mb-2">
                    <QRCode value={paymentDetails.cryptoDetails.walletAddress} size={100} />
                  </div>
                  <p className="text-gray-600 text-xs text-center break-all font-mono">
                    {paymentDetails.cryptoDetails.walletAddress}
                  </p>
                </div>
              )}
            </div>
          )}
          {invoiceData.notes && (
            <div>
              <h3 className="text-gray-900 font-bold mb-3 text-sm uppercase">Notes</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{invoiceData.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Executive Template - Corporate blue theme
export function GlassTemplate({ logo, invoiceData, paymentDetails }: TemplateProps) {
  const currencySymbol = getCurrencySymbol(invoiceData.currency);
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const total = subtotal;

  return (
    <div className="bg-white p-[25mm] min-h-[297mm]">
      {/* Header with Blue Bar */}
      <div className="mb-8">
        <div className="bg-blue-600 h-3 w-full mb-6"></div>
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            {logo && (
              <div className="w-40 h-20 border-2 border-gray-200 p-2">
                <img src={logo} alt="Company Logo" className="w-full h-full object-contain" />
              </div>
            )}
            <div>
              <h1 className="text-5xl font-bold text-gray-900">INVOICE</h1>
              <p className="text-blue-600 font-semibold text-lg mt-1">#{invoiceData.invoiceNumber}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="mb-4">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Invoice Date</p>
              <p className="text-gray-900 font-semibold">
                {invoiceData.date
                  ? new Date(invoiceData.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>
            {invoiceData.dueDate && (
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Payment Due</p>
                <p className="text-gray-900 font-semibold">
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
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-12 mb-10 pb-8 border-b border-gray-200">
        <div>
          <p className="text-xs text-blue-600 uppercase font-bold mb-3 tracking-wide">Billed From</p>
          <p className="text-gray-900 font-bold text-base mb-1">{invoiceData.fromCompany}</p>
          <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">{invoiceData.fromAddress}</p>
        </div>
        <div>
          <p className="text-xs text-blue-600 uppercase font-bold mb-3 tracking-wide">Billed To</p>
          <p className="text-gray-900 font-bold text-base mb-1">{invoiceData.toCompany}</p>
          <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">{invoiceData.toAddress}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-blue-600">
              <th className="py-3 px-0 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                Item Description
              </th>
              <th className="py-3 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wide">
                Quantity
              </th>
              <th className="py-3 px-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wide">Rate</th>
              <th className="py-3 px-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wide">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-4 px-0 text-gray-900 font-medium">{item.description}</td>
                <td className="py-4 px-4 text-center text-gray-700">{item.quantity}</td>
                <td className="py-4 px-4 text-right text-gray-700">
                  {currencySymbol}
                  {item.price.toFixed(2)}
                </td>
                <td className="py-4 px-4 text-right text-gray-900 font-semibold">
                  {currencySymbol}
                  {(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="flex justify-end mb-12">
        <div className="w-96">
          <div className="flex justify-between py-3 border-b border-gray-300">
            <span className="text-gray-600 font-semibold">Subtotal</span>
            <span className="text-gray-900 font-semibold">
              {currencySymbol}
              {subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-4 bg-blue-600 px-6 mt-3">
            <span className="text-white font-bold text-lg">Amount Due</span>
            <span className="text-white font-bold text-2xl">
              {currencySymbol}
              {total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      {(paymentDetails.method || invoiceData.notes) && (
        <div className="grid grid-cols-2 gap-10 pt-8 border-t border-gray-200">
          {paymentDetails.method && (
            <div>
              <h3 className="text-gray-900 font-bold mb-4 text-sm uppercase tracking-wide">Payment Instructions</h3>
              {paymentDetails.method === 'bank' && paymentDetails.bankDetails && (
                <div className="space-y-2 text-sm">
                  {paymentDetails.bankDetails.bankName && (
                    <div className="flex">
                      <span className="text-gray-500 w-32">Bank Name:</span>
                      <span className="text-gray-900 font-medium">{paymentDetails.bankDetails.bankName}</span>
                    </div>
                  )}
                  {paymentDetails.bankDetails.accountName && (
                    <div className="flex">
                      <span className="text-gray-500 w-32">Account Name:</span>
                      <span className="text-gray-900 font-medium">{paymentDetails.bankDetails.accountName}</span>
                    </div>
                  )}
                  {paymentDetails.bankDetails.accountNumber && (
                    <div className="flex">
                      <span className="text-gray-500 w-32">Account No:</span>
                      <span className="text-gray-900 font-mono font-medium">
                        {paymentDetails.bankDetails.accountNumber}
                      </span>
                    </div>
                  )}
                  {paymentDetails.bankDetails.swiftCode && (
                    <div className="flex">
                      <span className="text-gray-500 w-32">SWIFT Code:</span>
                      <span className="text-gray-900 font-mono font-medium">
                        {paymentDetails.bankDetails.swiftCode}
                      </span>
                    </div>
                  )}
                </div>
              )}
              {paymentDetails.method === 'crypto' && paymentDetails.cryptoDetails?.walletAddress && (
                <div className="mt-3 p-4 bg-gray-50 border border-gray-200">
                  <div className="flex justify-center mb-2">
                    <QRCode value={paymentDetails.cryptoDetails.walletAddress} size={100} />
                  </div>
                  <p className="text-gray-600 text-xs text-center break-all font-mono mt-2">
                    {paymentDetails.cryptoDetails.walletAddress}
                  </p>
                </div>
              )}
            </div>
          )}
          {invoiceData.notes && (
            <div>
              <h3 className="text-gray-900 font-bold mb-4 text-sm uppercase tracking-wide">Terms & Notes</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{invoiceData.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer Bar */}
      <div className="mt-16 pt-6 border-t border-gray-200">
        <p className="text-center text-xs text-gray-500">Thank you for your business</p>
      </div>
    </div>
  );
}

// Classic Template - Traditional business format
export function ElegantTemplate({ logo, invoiceData, paymentDetails }: TemplateProps) {
  const currencySymbol = getCurrencySymbol(invoiceData.currency);
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const total = subtotal;

  return (
    <div className="bg-white p-[25mm] min-h-[297mm]">
      {/* Letterhead Header */}
      <div className="mb-10">
        <div className="flex justify-between items-start pb-6 mb-6 border-b-4 border-double border-gray-400">
          <div className="space-y-3">
            {logo && (
              <div className="w-40 h-20 mb-4">
                <img src={logo} alt="Company Logo" className="w-full h-full object-contain" />
              </div>
            )}
            <div>
              <h1 className="text-5xl font-bold text-gray-900 tracking-wide">INVOICE</h1>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="bg-gray-100 px-4 py-2 border-l-4 border-gray-700">
              <p className="text-gray-900 font-bold">#{invoiceData.invoiceNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="flex gap-3">
          <span className="text-gray-600 font-semibold min-w-[100px]">Date:</span>
          <span className="text-gray-900">
            {invoiceData.date
              ? new Date(invoiceData.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'N/A'}
          </span>
        </div>
        {invoiceData.dueDate && (
          <div className="flex gap-3">
            <span className="text-gray-600 font-semibold min-w-[100px]">Due Date:</span>
            <span className="text-gray-900">
              {new Date(invoiceData.dueDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        )}
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <p className="text-gray-600 font-semibold uppercase text-xs mb-3 tracking-wide">From</p>
          <div className="border-l-2 border-gray-300 pl-4">
            <p className="text-gray-900 font-bold text-base">{invoiceData.fromCompany}</p>
            <p className="text-gray-600 text-sm mt-1 whitespace-pre-line leading-relaxed">{invoiceData.fromAddress}</p>
          </div>
        </div>
        <div>
          <p className="text-gray-600 font-semibold uppercase text-xs mb-3 tracking-wide">Bill To</p>
          <div className="border-l-2 border-gray-300 pl-4">
            <p className="text-gray-900 font-bold text-base">{invoiceData.toCompany}</p>
            <p className="text-gray-600 text-sm mt-1 whitespace-pre-line leading-relaxed">{invoiceData.toAddress}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-10">
        <table className="w-full border-collapse border-2 border-gray-300">
          <thead>
            <tr className="bg-gray-800">
              <th className="py-3 px-4 text-left text-xs font-semibold text-white uppercase border-r border-gray-600">
                Description
              </th>
              <th className="py-3 px-4 text-center text-xs font-semibold text-white uppercase border-r border-gray-600 w-24">
                Qty
              </th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-white uppercase border-r border-gray-600 w-32">
                Unit Price
              </th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-white uppercase w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index} className={`border-b border-gray-300 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="py-3 px-4 text-gray-900 border-r border-gray-300">{item.description}</td>
                <td className="py-3 px-4 text-center text-gray-700 border-r border-gray-300">{item.quantity}</td>
                <td className="py-3 px-4 text-right text-gray-700 border-r border-gray-300">
                  {currencySymbol}
                  {item.price.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right text-gray-900 font-semibold">
                  {currencySymbol}
                  {(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="flex justify-end mb-12">
        <div className="w-80 border-2 border-gray-300">
          <div className="flex justify-between py-2 px-4 bg-gray-50 border-b border-gray-300">
            <span className="text-gray-700 font-semibold">Subtotal:</span>
            <span className="text-gray-900 font-semibold">
              {currencySymbol}
              {subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-3 px-4 bg-gray-800">
            <span className="text-white font-bold text-lg">Total Due:</span>
            <span className="text-white font-bold text-xl">
              {currencySymbol}
              {total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      {(paymentDetails.method || invoiceData.notes) && (
        <div className="border-t-2 border-gray-300 pt-8 mt-8">
          <div className="grid grid-cols-2 gap-10">
            {paymentDetails.method && (
              <div>
                <h3 className="text-gray-900 font-bold mb-4 text-sm uppercase">Remittance Information</h3>
                {paymentDetails.method === 'bank' && paymentDetails.bankDetails && (
                  <div className="space-y-2 text-sm bg-gray-50 p-4 border-l-4 border-gray-700">
                    {paymentDetails.bankDetails.bankName && (
                      <div className="flex gap-2">
                        <span className="text-gray-600 font-semibold min-w-[120px]">Bank Name:</span>
                        <span className="text-gray-900">{paymentDetails.bankDetails.bankName}</span>
                      </div>
                    )}
                    {paymentDetails.bankDetails.accountName && (
                      <div className="flex gap-2">
                        <span className="text-gray-600 font-semibold min-w-[120px]">Account Name:</span>
                        <span className="text-gray-900">{paymentDetails.bankDetails.accountName}</span>
                      </div>
                    )}
                    {paymentDetails.bankDetails.accountNumber && (
                      <div className="flex gap-2">
                        <span className="text-gray-600 font-semibold min-w-[120px]">Account Number:</span>
                        <span className="text-gray-900 font-mono">{paymentDetails.bankDetails.accountNumber}</span>
                      </div>
                    )}
                    {paymentDetails.bankDetails.swiftCode && (
                      <div className="flex gap-2">
                        <span className="text-gray-600 font-semibold min-w-[120px]">SWIFT/BIC:</span>
                        <span className="text-gray-900 font-mono">{paymentDetails.bankDetails.swiftCode}</span>
                      </div>
                    )}
                  </div>
                )}
                {paymentDetails.method === 'crypto' && paymentDetails.cryptoDetails?.walletAddress && (
                  <div className="p-4 bg-gray-50 border-l-4 border-gray-700">
                    <div className="flex justify-center mb-2">
                      <QRCode value={paymentDetails.cryptoDetails.walletAddress} size={100} />
                    </div>
                    <p className="text-gray-600 text-xs text-center break-all font-mono mt-2">
                      {paymentDetails.cryptoDetails.walletAddress}
                    </p>
                  </div>
                )}
              </div>
            )}
            {invoiceData.notes && (
              <div>
                <h3 className="text-gray-900 font-bold mb-4 text-sm uppercase">Payment Terms & Notes</h3>
                <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-4 border-l-4 border-gray-700">
                  {invoiceData.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-16 pt-4 border-t border-gray-300">
        <p className="text-center text-xs text-gray-500">
          Payment is due within the specified terms. Late payments may incur additional fees.
        </p>
      </div>
    </div>
  );
}

export function CattyTemplate({ logo, invoiceData, paymentDetails }: TemplateProps) {
  const currencySymbol = getCurrencySymbol(invoiceData.currency);
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="relative bg-[#f5f0e8] min-h-[297mm] p-[20mm]" style={{ fontFamily: 'monospace' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-16">
        <div className="text-sm leading-relaxed">
          <p className="mb-1">From,</p>
          <p className="font-medium">{invoiceData.fromCompany?.split('\n')[0] || 'Company Name'}</p>
          {invoiceData.fromCompany
            ?.split('\n')
            .slice(1)
            .map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          {invoiceData.fromAddress?.split('\n').map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>

        <div className="text-right">
          <h1 className="text-5xl font-light tracking-wider mb-2">Invoice</h1>
          <p className="text-3xl font-light tracking-wide">#{invoiceData.invoiceNumber}</p>
        </div>
      </div>

      {/* Billing Info */}
      <div className="grid grid-cols-2 gap-8 mb-16 pb-8 border-b border-gray-300">
        <div className="text-sm leading-relaxed">
          <p className="mb-2">Billed to:</p>
          <p className="font-medium">{invoiceData.toCompany}</p>
        </div>

        <div className="text-sm leading-relaxed text-right space-y-3">
          <div>
            <p className="text-gray-600 mb-1">Issue Date</p>
            <p className="font-medium">
              {invoiceData.date
                ? new Date(invoiceData.date).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : ''}
            </p>
          </div>

          {invoiceData.dueDate && (
            <div>
              <p className="text-gray-600 mb-1">Due Date</p>
              <p className="font-medium">
                {new Date(invoiceData.dueDate).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          )}

          <div>
            <p className="text-gray-600 mb-1">Amount Due</p>
            <p className="font-medium text-lg">
              {currencySymbol}
              {subtotal.toFixed(0)}
            </p>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-16">
        <div className="grid grid-cols-2 gap-8 text-sm font-medium mb-6 pb-3 border-b border-gray-300">
          <p>Item</p>
          <p className="text-right">Cost</p>
        </div>

        <div className="space-y-6">
          {invoiceData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-2 gap-8 text-sm">
              <p>{item.description}</p>
              <p className="text-right font-medium">
                {currencySymbol}
                {(item.quantity * item.price).toFixed(0)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center mb-20 pb-8 border-b border-gray-300">
        <p className="text-sm">Total</p>
        <p className="text-lg font-medium">
          {subtotal.toFixed(0)} {invoiceData.currency || 'USD'}
        </p>
      </div>

      {/* Bank Details and Notes - Side by Side */}
      <div className="grid grid-cols-2 gap-16 mb-16">
        {/* Left Side - Empty space for cat image */}
        <div></div>

        {/* Right Side - Bank Details */}
        {paymentDetails.method === 'bank' && paymentDetails.bankDetails && (
          <div className="text-sm leading-relaxed space-y-3">
            <p className="font-medium mb-4">Bank Details</p>

            {paymentDetails.bankDetails.accountName && (
              <div className="flex">
                <span className="inline-block w-40 text-gray-600">Name</span>
                <span>: {paymentDetails.bankDetails.accountName}</span>
              </div>
            )}

            {paymentDetails.bankDetails.accountNumber && (
              <div className="flex">
                <span className="inline-block w-40 text-gray-600">Account Number</span>
                <span>: {paymentDetails.bankDetails.accountNumber}</span>
              </div>
            )}

            {paymentDetails.bankDetails.swiftCode && (
              <div className="flex">
                <span className="inline-block w-40 text-gray-600">SWIFT</span>
                <span>: {paymentDetails.bankDetails.swiftCode}</span>
              </div>
            )}

            {paymentDetails.bankDetails.bankName && (
              <div className="flex">
                <span className="inline-block w-40 text-gray-600">IFSC</span>
                <span>: {paymentDetails.bankDetails.bankName}</span>
              </div>
            )}

            {/* Notes below bank details */}
            {invoiceData.notes && (
              <div className="mt-8 pt-8 border-t border-gray-300">
                <p className="whitespace-pre-wrap">{invoiceData.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cat Image - Bottom Left */}
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px]">
        <img src="/src/assets/invoice/catpeek.png" alt="Cat peeking" className="w-full h-full object-contain" />
      </div>

      {/* Signature */}
      <div className="absolute bottom-8 right-20 text-sm">
        <p className="italic text-gray-600" style={{ fontFamily: 'cursive' }}>
          -{invoiceData.fromCompany?.split('\n')[0]?.split(' ')[0] || 'Signature'}
        </p>
      </div>
    </div>
  );
}

export function FloralTemplate({ logo, invoiceData, paymentDetails }: TemplateProps) {
  const currencySymbol = getCurrencySymbol(invoiceData.currency);
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="relative bg-[#1a1a1a] text-white min-h-[297mm] p-[20mm]" style={{ fontFamily: 'monospace' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-16">
        <div className="text-sm leading-relaxed">
          <p className="mb-1 text-gray-400">From,</p>
          <p className="font-medium">{invoiceData.fromCompany?.split('\n')[0] || 'Company Name'}</p>
          {invoiceData.fromCompany
            ?.split('\n')
            .slice(1)
            .map((line, idx) => (
              <p key={idx} className="text-gray-300">
                {line}
              </p>
            ))}
          {invoiceData.fromAddress?.split('\n').map((line, idx) => (
            <p key={idx} className="text-gray-300">
              {line}
            </p>
          ))}
        </div>

        <div className="text-right">
          <h1 className="text-5xl font-light tracking-wider mb-2">Invoice</h1>
          <p className="text-3xl font-light tracking-wide">#{invoiceData.invoiceNumber}</p>
        </div>
      </div>

      {/* Billing Info */}
      <div className="grid grid-cols-2 gap-8 mb-16 pb-8 border-b border-gray-700">
        <div className="text-sm leading-relaxed">
          <p className="mb-2 text-gray-400">Billed to:</p>
          <p className="font-medium">{invoiceData.toCompany}</p>
        </div>

        <div className="text-sm leading-relaxed text-right space-y-3">
          <div>
            <p className="text-gray-400 mb-1">Issue Date</p>
            <p className="font-medium">
              {invoiceData.date
                ? new Date(invoiceData.date).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : ''}
            </p>
          </div>

          {invoiceData.dueDate && (
            <div>
              <p className="text-gray-400 mb-1">Due Date</p>
              <p className="font-medium">
                {new Date(invoiceData.dueDate).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          )}

          <div>
            <p className="text-gray-400 mb-1">Amount Due</p>
            <p className="font-medium text-lg">
              {currencySymbol}
              {subtotal.toFixed(0)}
            </p>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-16">
        <div className="grid grid-cols-2 gap-8 text-sm font-medium mb-6 pb-3 border-b border-gray-700">
          <p>Item</p>
          <p className="text-right">Cost</p>
        </div>

        <div className="space-y-6">
          {invoiceData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-2 gap-8 text-sm">
              <p>{item.description}</p>
              <p className="text-right font-medium">
                {currencySymbol}
                {(item.quantity * item.price).toFixed(0)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center mb-20 pb-8 border-b border-gray-700">
        <p className="text-sm">Total</p>
        <p className="text-lg font-medium">
          {subtotal.toFixed(0)} {invoiceData.currency || 'USD'}
        </p>
      </div>

      {/* Bank Details and Notes - Side by Side */}
      <div className="grid grid-cols-2 gap-16 mb-16">
        {/* Left Side - Empty space for floral image */}
        <div></div>

        {/* Right Side - Bank Details */}
        {paymentDetails.method === 'bank' && paymentDetails.bankDetails && (
          <div className="text-sm leading-relaxed space-y-3">
            <p className="font-medium mb-4">Bank Details</p>

            {paymentDetails.bankDetails.accountName && (
              <div className="flex">
                <span className="inline-block w-40 text-gray-400">Name</span>
                <span>: {paymentDetails.bankDetails.accountName}</span>
              </div>
            )}

            {paymentDetails.bankDetails.accountNumber && (
              <div className="flex">
                <span className="inline-block w-40 text-gray-400">Account Number</span>
                <span>: {paymentDetails.bankDetails.accountNumber}</span>
              </div>
            )}

            {paymentDetails.bankDetails.swiftCode && (
              <div className="flex">
                <span className="inline-block w-40 text-gray-400">SWIFT</span>
                <span>: {paymentDetails.bankDetails.swiftCode}</span>
              </div>
            )}

            {paymentDetails.bankDetails.bankName && (
              <div className="flex">
                <span className="inline-block w-40 text-gray-400">IFSC</span>
                <span>: {paymentDetails.bankDetails.bankName}</span>
              </div>
            )}

            {/* Notes below bank details */}
            {invoiceData.notes && (
              <div className="mt-8 pt-8 border-t border-gray-700">
                <p className="whitespace-pre-wrap text-gray-300">{invoiceData.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floral Image - Bottom Left */}
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px]">
        <img src="/src/assets/invoice/flower.png" alt="Floral decoration" className="w-full h-full object-contain" />
      </div>

      {/* Signature */}
      <div className="absolute bottom-8 right-20 text-sm">
        <p className="italic text-gray-400" style={{ fontFamily: 'cursive' }}>
          -{invoiceData.fromCompany?.split('\n')[0]?.split(' ')[0] || 'Signature'}
        </p>
      </div>
    </div>
  );
}

export function PandaTemplate({ invoiceData, paymentDetails }: TemplateProps) {
  const currencySymbol = getCurrencySymbol(invoiceData.currency);
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  // Extract email and phone from address
  const fromAddressLines = invoiceData.fromAddress?.split('\n') || [];
  const fromEmail = fromAddressLines.find(line => line.includes('@')) || 'hello@email.com';
  const fromPhone = fromAddressLines.find(line => line.match(/\+?\d/)) || '+91 00000 00000';

  return (
    <div className="bg-[#f5f5f5] min-h-[297mm] p-[20mm]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-16">
        {/* Left Side - Panda Logo & Company Info */}
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full border-2 border-black flex items-center justify-center bg-white">
            <div className="text-4xl">🐼</div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-1">{invoiceData.fromCompany?.split('\n')[0] || 'Panda, Inc'}</h2>
            <p className="text-sm text-gray-600">{fromEmail}</p>
            <p className="text-sm text-gray-600">{fromPhone}</p>
          </div>
        </div>

        {/* Right Side - Invoice Title & Number */}
        <div className="text-right">
          <h1 className="text-6xl font-light text-gray-300 tracking-wide">Invoice</h1>
          <p className="text-lg text-gray-700 mt-1">#{invoiceData.invoiceNumber}</p>
        </div>
      </div>

      {/* Billing Info Section */}
      <div className="grid grid-cols-3 gap-8 mb-12">
        {/* Billed To */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Billed to</p>
          <p className="font-semibold text-gray-900 mb-1">{invoiceData.toCompany || 'Company Name'}</p>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{invoiceData.toAddress || 'Company address\nCity, Country 00000'}</p>
        </div>

        {/* Invoice Date */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Invoice date</p>
          <p className="text-gray-900">{invoiceData.date}</p>
        </div>

        {/* Due Date */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Due date</p>
          <p className="text-gray-900">{invoiceData.dueDate || 'N/A'}</p>
        </div>
      </div>

      {/* Amount Due - Highlighted Box */}
      <div className="flex justify-end mb-12">
        <div className="bg-[#d4f542] px-6 py-4 rounded">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Amount due</p>
          <p className="text-3xl font-bold text-gray-900">{invoiceData.currency || 'US$'} {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Service Description */}
      <h3 className="text-xl font-semibold text-gray-900 mb-8">Digital product design</h3>

      {/* Line Items Table */}
      <div className="mb-12">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 pb-3 border-b border-gray-300 mb-4">
          <div className="col-span-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">#</p>
          </div>
          <div className="col-span-9">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Title / Description</p>
          </div>
          <div className="col-span-2 text-right">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subtotal</p>
          </div>
        </div>

        {/* Table Items */}
        <div className="space-y-8">
          {invoiceData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4">
              <div className="col-span-1">
                <p className="text-gray-900 font-medium">{index + 1}</p>
              </div>
              <div className="col-span-9">
                <p className="font-medium text-gray-900 mb-1">{item.description}</p>
                <p className="text-sm text-gray-500">01 Jul - 20 Jul • Hours log ↗</p>
              </div>
              <div className="col-span-2 text-right">
                <p className="text-gray-900 font-medium">{currencySymbol}{(item.quantity * item.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Section */}
      <div className="flex justify-end mb-4 pb-4 border-b border-gray-300">
        <div className="w-64">
          <div className="flex justify-between">
            <p className="font-semibold text-gray-900">Total</p>
            <p className="font-semibold text-gray-900">{currencySymbol}{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* Payment Notice */}
      <div className="flex items-start gap-2 text-sm text-gray-600 mb-20">
        <span className="text-gray-400">ℹ️</span>
        <p>Please pay within 15 days of receiving this invoice.</p>
      </div>

      {/* Thank You Message */}
      <p className="text-lg font-medium text-gray-700 mb-8">Thank you for the business!</p>

      {/* Payment Info */}
      {paymentDetails.method === 'bank' && paymentDetails.bankDetails && (
        <div className="border-t border-gray-300 pt-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Payment info</p>
          <div className="grid grid-cols-4 gap-6 text-sm">
            {paymentDetails.bankDetails.accountName && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Account name</p>
                <p className="text-gray-900">{paymentDetails.bankDetails.accountName}</p>
                <p className="text-xs text-gray-500 mt-1">Business address, City, State, IN - 000 000</p>
              </div>
            )}
            {paymentDetails.bankDetails.bankName && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Bank name</p>
                <p className="text-gray-900">{paymentDetails.bankDetails.bankName}</p>
              </div>
            )}
            {paymentDetails.bankDetails.swiftCode && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Swift code</p>
                <p className="text-gray-900">{paymentDetails.bankDetails.swiftCode}</p>
              </div>
            )}
            {paymentDetails.bankDetails.accountNumber && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Account #</p>
                <p className="text-gray-900">{paymentDetails.bankDetails.accountNumber}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function PinkMinimalTemplate({ invoiceData, paymentDetails }: TemplateProps) {
  const currencySymbol = getCurrencySymbol(invoiceData.currency);
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const taxRate = 10; // 10% tax rate as shown in reference
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  // Extract email and phone from address
  const fromAddressLines = invoiceData.fromAddress?.split('\n') || [];
  const fromEmail = fromAddressLines.find(line => line.includes('@')) || 'hello@email.com';
  const fromPhone = fromAddressLines.find(line => line.match(/\+?\d/)) || '+91 00000 00000';

  return (
    <div className="bg-white min-h-[297mm] p-[20mm]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <h1 className="text-5xl font-bold text-gray-900">Invoice</h1>
        <p className="text-xl text-gray-700">N° {invoiceData.invoiceNumber}</p>
      </div>

      {/* Summary and Billing Info */}
      <div className="grid grid-cols-3 gap-8 mb-16">
        {/* Left - Payment Summary */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Payable <span className="font-semibold text-gray-900">{currencySymbol}{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
          <p className="text-sm text-gray-500 mb-1">Dues {invoiceData.dueDate || 'N/A'}</p>
          <p className="text-sm text-gray-500 mb-1">Issued {invoiceData.date}</p>
          <p className="text-sm text-gray-500">Ref. #{invoiceData.invoiceNumber}</p>
        </div>

        {/* Middle - Billed To */}
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-2">Billed to</p>
          <p className="text-sm text-gray-900 font-medium mb-1">{invoiceData.toCompany || 'Company Name'}</p>
          <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{invoiceData.toAddress || 'Company address\nCity, Country - 00000'}</p>
        </div>

        {/* Right - From */}
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-2">From</p>
          <p className="text-sm text-gray-900 font-medium mb-1">{invoiceData.fromCompany?.split('\n')[0] || 'Panda, Inc'}</p>
          <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{invoiceData.fromAddress || 'Business address\nCity, State, IN - 000 000'}</p>
        </div>
      </div>

      {/* Line Items with Pink Border */}
      <div className="relative mb-16">
        {/* Pink Left Border */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#e91e63]"></div>

        <div className="pl-8">
          {/* Service Title */}
          <h3 className="text-xl font-semibold text-gray-900 mb-8">{invoiceData.notes || 'Responsive web design'}</h3>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 pb-3 border-b border-gray-200 mb-4">
            <div className="col-span-6">
              <p className="text-xs font-medium text-gray-500 uppercase">Item Description</p>
            </div>
            <div className="col-span-2 text-center">
              <p className="text-xs font-medium text-gray-500 uppercase">Qty</p>
            </div>
            <div className="col-span-2 text-right">
              <p className="text-xs font-medium text-gray-500 uppercase">Rate</p>
            </div>
            <div className="col-span-2 text-right">
              <p className="text-xs font-medium text-gray-500 uppercase">Amount</p>
            </div>
          </div>

          {/* Table Items */}
          <div className="space-y-4 mb-6">
            {invoiceData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <p className="text-sm text-gray-900">{item.description}</p>
                </div>
                <div className="col-span-2 text-center">
                  <p className="text-sm text-gray-900">{item.quantity}</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-sm text-gray-900">{currencySymbol}{item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-sm text-gray-900">{currencySymbol}{(item.quantity * item.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-6">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-sm">
                <p className="text-gray-600">Subtotal</p>
                <p className="text-gray-900">{currencySymbol}{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-gray-600">Tax ({taxRate}%)</p>
                <p className="text-gray-900">{currencySymbol}{taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <p className="font-semibold text-gray-900">Total (USD)</p>
                <p className="font-bold text-2xl text-[#e91e63]">{currencySymbol}{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-16 pt-8 border-t border-gray-200">
        {/* Left - Payment Details */}
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-4">Payment details</p>
          <p className="text-xs text-gray-500 mb-6">Please pay within 15 days of receiving this invoice.</p>

          {paymentDetails.method === 'bank' && paymentDetails.bankDetails && (
            <div className="space-y-2 text-sm">
              {paymentDetails.bankDetails.bankName && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank name</span>
                  <span className="text-gray-900">{paymentDetails.bankDetails.bankName}</span>
                </div>
              )}
              {paymentDetails.bankDetails.swiftCode && (
                <div className="flex justify-between">
                  <span className="text-gray-600">IFS code</span>
                  <span className="text-gray-900">{paymentDetails.bankDetails.swiftCode?.split('XXX')[0] || paymentDetails.bankDetails.swiftCode}</span>
                </div>
              )}
              {paymentDetails.bankDetails.swiftCode && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Swift code</span>
                  <span className="text-gray-900">{paymentDetails.bankDetails.swiftCode}</span>
                </div>
              )}
              {paymentDetails.bankDetails.accountNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Account #</span>
                  <span className="text-gray-900">{paymentDetails.bankDetails.accountNumber}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right - Thank You */}
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900 mb-4">Thanks for the business.</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>{fromEmail}</p>
            <p>{fromPhone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CompactPandaTemplate({ invoiceData, paymentDetails }: TemplateProps) {
  const currencySymbol = getCurrencySymbol(invoiceData.currency);
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const taxRate = 0; // 0% tax as shown in reference
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  return (
    <div className="bg-white min-h-[297mm] p-[20mm]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        {/* Left - Invoice Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">INVOICE</h1>
          <p className="text-sm text-gray-600">#{invoiceData.invoiceNumber}</p>
        </div>

        {/* Right - Panda Icon */}
        <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center bg-white">
          <div className="text-3xl">🐼</div>
        </div>
      </div>

      {/* Dates and Billing Info */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Issued */}
        <div>
          <p className="text-xs text-gray-500 uppercase mb-1">Issued</p>
          <p className="text-sm text-gray-900">{invoiceData.date}</p>
        </div>

        {/* Due */}
        <div>
          <p className="text-xs text-gray-500 uppercase mb-1">Due</p>
          <p className="text-sm text-gray-900">{invoiceData.dueDate || 'N/A'}</p>
        </div>

        <div></div>
      </div>

      {/* Billed To and From */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        {/* Billed To */}
        <div>
          <p className="text-xs font-semibold text-gray-900 uppercase mb-2">Billed to</p>
          <p className="text-sm font-medium text-gray-900 mb-1">{invoiceData.toCompany || 'Company Name'}</p>
          <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{invoiceData.toAddress || 'Company address\nCity, Country - 00000'}</p>
        </div>

        {/* From */}
        <div className="col-span-2">
          <p className="text-xs font-semibold text-gray-900 uppercase mb-2">From</p>
          <p className="text-sm font-medium text-gray-900 mb-1">{invoiceData.fromCompany?.split('\n')[0] || 'Panda, Inc'}</p>
          <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{invoiceData.fromAddress || 'Business address\nCity, State, IN - 000 000'}</p>
        </div>
      </div>

      {/* Service Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-8">{invoiceData.notes || 'Digital product design'}</h3>

      {/* Line Items Table */}
      <div className="mb-12">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 pb-3 border-b border-gray-300 mb-4">
          <div className="col-span-6">
            <p className="text-xs font-medium text-gray-500 uppercase">Service</p>
          </div>
          <div className="col-span-2 text-center">
            <p className="text-xs font-medium text-gray-500 uppercase">Qty</p>
          </div>
          <div className="col-span-2 text-right">
            <p className="text-xs font-medium text-gray-500 uppercase">Rate</p>
          </div>
          <div className="col-span-2 text-right">
            <p className="text-xs font-medium text-gray-500 uppercase">Line Total</p>
          </div>
        </div>

        {/* Table Items */}
        <div className="space-y-6">
          {invoiceData.items.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-12 gap-4 mb-1">
                <div className="col-span-6">
                  <p className="text-sm font-medium text-gray-900">{item.description}</p>
                </div>
                <div className="col-span-2 text-center">
                  <p className="text-sm text-gray-900">{item.quantity}</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-sm text-gray-900">{currencySymbol}{item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-sm font-medium text-gray-900">{currencySymbol}{(item.quantity * item.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>
              <div className="col-span-6">
                <p className="text-xs text-gray-500">Description • Hours log ↗</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80 space-y-3">
          <div className="flex justify-between text-sm pb-3 border-b border-gray-300">
            <p className="text-gray-600">Subtotal</p>
            <p className="text-gray-900">{currencySymbol}{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="flex justify-between text-sm pb-3 border-b border-gray-300">
            <p className="text-gray-600">Tax ({taxRate}%)</p>
            <p className="text-gray-900">{currencySymbol}{taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="flex justify-between text-sm pb-3 border-b border-gray-300">
            <p className="font-medium text-gray-900">Total</p>
            <p className="font-medium text-gray-900">{currencySymbol}{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* Amount Due - Purple Borders */}
      <div className="flex justify-end mb-16">
        <div className="border-t-2 border-b-2 py-4 px-6 w-80" style={{ backgroundColor: '#ffffff', borderColor: '#7c3aed' }}>
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-900">Amount due</p>
            <p className="text-2xl font-bold" style={{ color: '#7c3aed' }}>{invoiceData.currency || 'US$'} {total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* Thank You Message */}
      <div className="mb-8">
        <p className="text-sm text-gray-900 font-medium">Thank you for the business!</p>
        <div className="flex items-start gap-2 text-xs text-gray-500 mt-2">
          <span>ℹ️</span>
          <p>Please pay within 15 days of receiving this invoice.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-8 border-t border-gray-300">
        <div className="flex justify-between text-xs text-gray-600">
          <p>{invoiceData.fromCompany?.split('\n')[0] || 'Digital Product Designer, IN'}</p>
          <p>+91 00000 00000</p>
          <p>hello@email.com</p>
        </div>
      </div>
    </div>
  );
}
