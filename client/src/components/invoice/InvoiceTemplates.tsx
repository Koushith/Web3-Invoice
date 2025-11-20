import QRCode from 'react-qr-code';
import flowerImage from '@/assets/invoice/flower.png';
import catPeekImage from '@/assets/invoice/catpeek.png';

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
  taxRate?: number;
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
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const taxRate = invoiceData.taxRate || 0;
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  return (
    <div className="p-[25mm] bg-white">
      {/* Clean Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          {logo && (
            <div className="w-32 h-16 mb-4">
              <img src={logo} alt="Company Logo" className="w-full h-full object-contain" />
            </div>
          )}
          <h1 className="text-4xl font-bold text-[#1a1a1a]">INVOICE</h1>
          <p className="text-sm text-[#333333] mt-2">#{invoiceData.invoiceNumber}</p>
        </div>

        <div className="text-right">
          <div className="mb-3">
            <p className="text-xs text-[#666666] font-semibold mb-1">Issue Date</p>
            <p className="text-sm text-[#1a1a1a]">
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
            <div>
              <p className="text-xs text-[#666666] font-semibold mb-1">Due Date</p>
              <p className="text-sm text-[#1a1a1a]">
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
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <p className="text-xs text-[#666666] font-semibold mb-2">FROM</p>
          <p className="font-semibold text-[#1a1a1a] mb-1">{invoiceData.fromCompany}</p>
          <p className="text-sm text-[#4a4a4a] whitespace-pre-line">{invoiceData.fromAddress}</p>
        </div>

        <div>
          <p className="text-xs text-[#666666] font-semibold mb-2">BILL TO</p>
          <p className="font-semibold text-[#1a1a1a] mb-1">{invoiceData.toCompany}</p>
          <p className="text-sm text-[#4a4a4a] whitespace-pre-line">{invoiceData.toAddress}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-900">
              <th className="py-3 text-left text-xs font-bold text-[#1a1a1a] uppercase">Description</th>
              <th className="py-3 text-center text-xs font-bold text-[#1a1a1a] uppercase w-20">Qty</th>
              <th className="py-3 text-right text-xs font-bold text-[#1a1a1a] uppercase w-28">Rate</th>
              <th className="py-3 text-right text-xs font-bold text-[#1a1a1a] uppercase w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index} className="border-b border-[#d0d0d0]">
                <td className="py-4 text-sm text-[#1a1a1a]">{item.description}</td>
                <td className="py-4 text-sm text-center text-[#333333]">{item.quantity}</td>
                <td className="py-4 text-sm text-right text-[#333333]">
                  {currencySymbol}
                  {item.price.toFixed(2)}
                </td>
                <td className="py-4 text-sm text-right text-[#1a1a1a]">
                  {currencySymbol}
                  {(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div className="flex justify-end mt-4">
          <div className="w-64">
            <div className="space-y-2 pb-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#333333]">Subtotal</span>
                <span className="text-[#1a1a1a]">
                  {currencySymbol}
                  {subtotal.toFixed(2)}
                </span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#333333]">Tax ({taxRate}%)</span>
                  <span className="text-[#1a1a1a]">
                    {currencySymbol}
                    {taxAmount.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
            <div className="border-t-2 border-gray-900 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-[#1a1a1a]">TOTAL</span>
                <span className="text-xl font-bold text-[#1a1a1a]">
                  {currencySymbol}
                  {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      {paymentDetails.method === 'bank' && paymentDetails.bankDetails && (
        <div className="mb-8 mt-12">
          <p className="text-xs text-[#666666] font-semibold mb-3">PAYMENT INFORMATION</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            <div>
              <p className="text-xs text-[#666666] mb-1">Bank Name</p>
              <p className="text-sm text-[#1a1a1a]">{paymentDetails.bankDetails.bankName}</p>
            </div>
            <div>
              <p className="text-xs text-[#666666] mb-1">Account Name</p>
              <p className="text-sm text-[#1a1a1a]">{paymentDetails.bankDetails.accountName}</p>
            </div>
            <div>
              <p className="text-xs text-[#666666] mb-1">Account Number</p>
              <p className="text-sm text-[#1a1a1a]">{paymentDetails.bankDetails.accountNumber}</p>
            </div>
            {paymentDetails.bankDetails.swiftCode && (
              <div>
                <p className="text-xs text-[#666666] mb-1">SWIFT/BIC</p>
                <p className="text-sm text-[#1a1a1a]">{paymentDetails.bankDetails.swiftCode}</p>
              </div>
            )}
          </div>
        </div>
      )}
      {paymentDetails.method === 'crypto' &&
        paymentDetails.cryptoDetails &&
        paymentDetails.cryptoDetails.walletAddress && (
          <div className="mb-8 mt-12">
            <p className="text-xs text-[#666666] font-semibold mb-3">PAYMENT INFORMATION</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {paymentDetails.cryptoDetails.currency && (
                  <div>
                    <p className="text-xs text-[#666666] mb-1">Currency</p>
                    <p className="text-sm text-[#1a1a1a]">{paymentDetails.cryptoDetails.currency}</p>
                  </div>
                )}
                {paymentDetails.cryptoDetails.network && (
                  <div>
                    <p className="text-xs text-[#666666] mb-1">Chain</p>
                    <p className="text-sm text-[#1a1a1a]">{paymentDetails.cryptoDetails.network}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-6 items-start">
                <div className="flex-1">
                  <p className="text-xs text-[#666666] mb-2">Payment Address</p>
                  <p className="font-mono text-xs break-all text-[#1a1a1a]">
                    {paymentDetails.cryptoDetails.walletAddress}
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-[#b0b0b0] relative">
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
          </div>
        )}
      {paymentDetails.method === 'other' && paymentDetails.otherDetails && (
        <div className="mb-8 mt-12">
          <p className="text-xs text-[#666666] font-semibold mb-3">PAYMENT INFORMATION</p>
          <p className="text-sm text-[#333333] whitespace-pre-line">{paymentDetails.otherDetails}</p>
        </div>
      )}

      {/* Notes & Terms */}
      {(invoiceData.notes || invoiceData.terms) && (
        <div className="grid grid-cols-2 gap-12 mt-12 pt-8 border-t border-[#b0b0b0]">
          {invoiceData.notes && (
            <div>
              <p className="text-xs text-[#666666] font-semibold mb-2">NOTES</p>
              <p className="text-sm text-[#333333] whitespace-pre-line">{invoiceData.notes}</p>
            </div>
          )}
          {invoiceData.terms && (
            <div>
              <p className="text-xs text-[#666666] font-semibold mb-2">TERMS & CONDITIONS</p>
              <p className="text-sm text-[#333333] whitespace-pre-line">{invoiceData.terms}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ModernTemplate({ logo, invoiceData, paymentDetails }: TemplateProps) {
  const currencySymbol = getCurrencySymbol(invoiceData.currency);
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const taxRate = invoiceData.taxRate || 0;
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  return (
    <div className="p-[25mm]">
      {/* Clean Header */}
      <div className="flex justify-between items-start mb-12">
        <div className="space-y-4">
          {logo && (
            <div className="w-32 h-16">
              <img src={logo} alt="Company Logo" className="w-full h-full object-contain" />
            </div>
          )}
          <div>
            <h1 className="text-5xl font-light tracking-tight text-[#1a1a1a]">INVOICE</h1>
            <p className="text-lg text-[#666666] mt-1">#{invoiceData.invoiceNumber}</p>
          </div>
        </div>

        <div className="text-right space-y-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider">Issue Date</p>
            <p className="text-sm font-medium text-[#1a1a1a]">
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
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider">Due Date</p>
              <p className="text-sm font-medium text-[#1a1a1a]">
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
      <div className="grid grid-cols-2 gap-16 mb-12 pb-12 border-b border-[#d0d0d0]">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider">From</p>
          <div className="space-y-1">
            <p className="font-semibold text-[#1a1a1a]">{invoiceData.fromCompany}</p>
            <p className="text-sm text-[#4a4a4a] whitespace-pre-line leading-relaxed">{invoiceData.fromAddress}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider">Bill To</p>
          <div className="space-y-1">
            <p className="font-semibold text-[#1a1a1a]">{invoiceData.toCompany}</p>
            <p className="text-sm text-[#4a4a4a] whitespace-pre-line leading-relaxed">{invoiceData.toAddress}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-12">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-900">
              <th className="py-3 px-0 text-left text-xs font-semibold text-[#1a1a1a] uppercase tracking-wider">Description</th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-[#1a1a1a] uppercase tracking-wider w-20">Qty</th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-[#1a1a1a] uppercase tracking-wider w-28">Price</th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-[#1a1a1a] uppercase tracking-wider w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index} className="border-b border-[#d0d0d0]">
                <td className="py-4 px-0 text-sm text-[#1a1a1a]">{item.description}</td>
                <td className="py-4 px-4 text-sm text-right text-[#4a4a4a]">{item.quantity}</td>
                <td className="py-4 px-4 text-sm text-right text-[#4a4a4a]">
                  {currencySymbol}{item.price.toFixed(2)}
                </td>
                <td className="py-4 px-4 text-sm text-right font-medium text-[#1a1a1a]">
                  {currencySymbol}{(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div className="flex justify-end mt-8">
          <div className="w-80">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#4a4a4a]">Subtotal</span>
                <span className="text-[#1a1a1a]">
                  {currencySymbol}{subtotal.toFixed(2)}
                </span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#4a4a4a]">Tax ({taxRate}%)</span>
                  <span className="text-[#1a1a1a]">
                    {currencySymbol}{taxAmount.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center py-4 px-6 bg-gray-900 text-white rounded-lg">
              <span className="text-base font-semibold">Total</span>
              <span className="text-2xl font-bold">
                {currencySymbol}{total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider">Payment Details</p>
        {paymentDetails.method === 'bank' && paymentDetails.bankDetails && (
          <div className="grid grid-cols-2 gap-6">
            {paymentDetails.bankDetails.bankName && (
              <div className="space-y-1">
                <p className="text-xs text-[#666666]">Bank Name</p>
                <p className="text-sm font-medium text-[#1a1a1a]">{paymentDetails.bankDetails.bankName}</p>
              </div>
            )}
            {paymentDetails.bankDetails.accountName && (
              <div className="space-y-1">
                <p className="text-xs text-[#666666]">Account Name</p>
                <p className="text-sm font-medium text-[#1a1a1a]">{paymentDetails.bankDetails.accountName}</p>
              </div>
            )}
            {paymentDetails.bankDetails.accountNumber && (
              <div className="space-y-1">
                <p className="text-xs text-[#666666]">Account Number</p>
                <p className="text-sm font-medium text-[#1a1a1a]">{paymentDetails.bankDetails.accountNumber}</p>
              </div>
            )}
            {paymentDetails.bankDetails.swiftCode && (
              <div className="space-y-1">
                <p className="text-xs text-[#666666]">SWIFT/BIC</p>
                <p className="text-sm font-medium text-[#1a1a1a]">{paymentDetails.bankDetails.swiftCode}</p>
              </div>
            )}
          </div>
        )}
        {paymentDetails.method === 'crypto' &&
          paymentDetails.cryptoDetails &&
          paymentDetails.cryptoDetails.walletAddress && (
            <div className="bg-[#f8f8f8] rounded-xl p-6">
              <div className="flex gap-6 items-start">
                <div className="flex-1 space-y-4">
                  {paymentDetails.cryptoDetails.currency && (
                    <div className="space-y-1">
                      <p className="text-xs text-[#666666] font-semibold uppercase">Currency</p>
                      <p className="font-bold text-[#1a1a1a]">{paymentDetails.cryptoDetails.currency}</p>
                    </div>
                  )}
                  {paymentDetails.cryptoDetails.network && (
                    <div className="space-y-1">
                      <p className="text-xs text-[#666666] font-semibold uppercase">Chain</p>
                      <p className="font-bold text-[#1a1a1a]">{paymentDetails.cryptoDetails.network}</p>
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-xs text-[#666666] font-semibold uppercase">Address</p>
                    <p className="font-bold text-[#1a1a1a] font-mono text-xs break-all">
                      {paymentDetails.cryptoDetails.walletAddress}
                    </p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border-2 border-[#d0d0d0] relative flex-shrink-0">
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
          <div className="bg-[#f8f8f8] rounded-xl p-6">
            <p className="text-sm whitespace-pre-line text-[#333333]">{paymentDetails.otherDetails}</p>
          </div>
        )}
      </div>

      {/* Notes */}
      {(invoiceData.notes || invoiceData.terms) && (
        <div className="grid grid-cols-2 gap-12 pt-6 border-t border-[#d0d0d0]">
          {invoiceData.notes && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-[#666666] uppercase tracking-wider">Notes</p>
              <p className="text-sm text-[#4a4a4a] whitespace-pre-line">{invoiceData.notes}</p>
            </div>
          )}
          {invoiceData.terms && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-[#666666] uppercase tracking-wider">Terms</p>
              <p className="text-sm text-[#4a4a4a] whitespace-pre-line">{invoiceData.terms}</p>
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
          <h1 className="text-5xl font-light text-[#1a1a1a] tracking-tight">Invoice</h1>
        </div>

        <div className="text-right">
          <p className="text-3xl font-light text-[#1a1a1a]">#{invoiceData.invoiceNumber}</p>
          <div className="mt-4 space-y-1 text-sm">
            <p className="text-[#4a4a4a]">
              {invoiceData.date
                ? new Date(invoiceData.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Date'}
            </p>
            {invoiceData.dueDate && (
              <p className="text-[#1a1a1a] font-medium">
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
          <p className="text-xs font-semibold text-[#666666] uppercase tracking-widest mb-3">From</p>
          <p className="font-semibold text-[#1a1a1a]">{invoiceData.fromCompany}</p>
          <p className="text-sm text-[#4a4a4a] whitespace-pre-line leading-relaxed">{invoiceData.fromAddress}</p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-[#666666] uppercase tracking-widest mb-3">To</p>
          <p className="font-semibold text-[#1a1a1a]">{invoiceData.toCompany}</p>
          <p className="text-sm text-[#4a4a4a] whitespace-pre-line leading-relaxed">{invoiceData.toAddress}</p>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-4">
        {invoiceData.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-3 border-b border-[#d0d0d0]">
            <div className="flex-1">
              <p className="font-medium text-[#1a1a1a]">{item.description}</p>
              <p className="text-sm text-[#666666] mt-1">
                {item.quantity} × {currencySymbol}
                {item.price.toFixed(2)}
              </p>
            </div>
            <p className="font-semibold text-[#1a1a1a] text-lg">
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
            <p className="text-lg font-light text-[#4a4a4a]">Total</p>
            <p className="text-4xl font-light text-[#1a1a1a]">
              {currencySymbol}
              {invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      {paymentDetails.method === 'bank' && paymentDetails.bankDetails && (
        <div className="space-y-3 pt-8 border-t border-[#d0d0d0]">
          <p className="text-xs font-semibold text-[#666666] uppercase tracking-widest">Payment Information</p>
          <div className="space-y-2 text-sm">
            <p className="text-[#4a4a4a]">{paymentDetails.bankDetails.bankName}</p>
            <p className="text-[#4a4a4a]">{paymentDetails.bankDetails.accountName}</p>
            <p className="font-mono text-[#1a1a1a]">{paymentDetails.bankDetails.accountNumber}</p>
            {paymentDetails.bankDetails.swiftCode && (
              <p className="font-mono text-[#1a1a1a]">{paymentDetails.bankDetails.swiftCode}</p>
            )}
          </div>
        </div>
      )}

      {paymentDetails.method === 'crypto' &&
        paymentDetails.cryptoDetails &&
        paymentDetails.cryptoDetails.walletAddress && (
          <div className="space-y-3 pt-8 border-t border-[#d0d0d0]">
            <p className="text-xs font-semibold text-[#666666] uppercase tracking-widest">Payment Information</p>
            <div className="flex gap-6 items-start">
              <div className="flex-1 space-y-3">
                {paymentDetails.cryptoDetails.currency && (
                  <div>
                    <p className="text-xs text-[#666666] mb-1">Currency</p>
                    <p className="font-medium">{paymentDetails.cryptoDetails.currency}</p>
                  </div>
                )}
                {paymentDetails.cryptoDetails.network && (
                  <div>
                    <p className="text-xs text-[#666666] mb-1">Chain</p>
                    <p className="font-medium">{paymentDetails.cryptoDetails.network}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-[#666666] mb-1">Address</p>
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
        <div className="space-y-3 pt-8 border-t border-[#d0d0d0]">
          <p className="text-xs font-semibold text-[#666666] uppercase tracking-widest">Payment Information</p>
          <p className="text-sm whitespace-pre-line">{paymentDetails.otherDetails}</p>
        </div>
      )}

      {/* Notes and Terms */}
      {(invoiceData.notes || invoiceData.terms) && (
        <div className="space-y-6 pt-8 border-t border-[#d0d0d0]">
          {invoiceData.notes && (
            <div>
              <p className="text-xs font-semibold text-[#666666] uppercase tracking-widest mb-2">Notes</p>
              <p className="text-sm text-[#4a4a4a] whitespace-pre-line">{invoiceData.notes}</p>
            </div>
          )}
          {invoiceData.terms && (
            <div>
              <p className="text-xs font-semibold text-[#666666] uppercase tracking-widest mb-2">Terms & Conditions</p>
              <p className="text-sm text-[#4a4a4a] whitespace-pre-line">{invoiceData.terms}</p>
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
    <div className="p-[25mm] space-y-10 relative bg-gradient-to-br from-amber-50/30 via-white to-rose-50/30" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
      {/* Decorative corner elements - Top Left */}
      <div className="absolute top-[15mm] left-[15mm] w-24 h-24 opacity-20">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0 L40 0 Q0 0 0 40 Z" fill="#D4887F" />
          <circle cx="8" cy="8" r="3" fill="#E8956C" />
          <circle cx="18" cy="8" r="2" fill="#C97D6C" />
          <circle cx="8" cy="18" r="2" fill="#C97D6C" />
        </svg>
      </div>

      {/* Decorative corner elements - Top Right */}
      <div className="absolute top-[15mm] right-[15mm] w-24 h-24 opacity-20 transform rotate-90">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0 L40 0 Q0 0 0 40 Z" fill="#D4887F" />
          <circle cx="8" cy="8" r="3" fill="#E8956C" />
          <circle cx="18" cy="8" r="2" fill="#C97D6C" />
          <circle cx="8" cy="18" r="2" fill="#C97D6C" />
        </svg>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-4">
          {logo && (
            <div className="w-32 h-16 mb-4 opacity-90">
              <img src={logo} alt="Company Logo" className="w-full h-full object-contain" />
            </div>
          )}
          <div className="border-l-4 border-amber-600/60 pl-4">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-800/70 font-light">From</p>
            <div className="text-sm leading-relaxed mt-2">
              <p className="font-bold text-lg text-amber-900" style={{ fontFamily: "'Playfair Display', serif" }}>{invoiceData.fromCompany}</p>
              <p className="text-[#333333] mt-1 whitespace-pre-line" style={{ fontFamily: "'Lora', 'Georgia', serif" }}>{invoiceData.fromAddress}</p>
            </div>
          </div>
        </div>

        <div className="text-right">
          <h1 className="text-5xl font-bold tracking-tight text-amber-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Invoice</h1>
          <div className="inline-block bg-amber-100/60 px-4 py-2 border-l-2 border-amber-600/60">
            <p className="text-sm text-amber-800/70 tracking-widest">No.</p>
            <p className="text-2xl font-semibold text-amber-900 mt-1">#{invoiceData.invoiceNumber}</p>
          </div>
        </div>
      </div>

      {/* Decorative divider */}
      <div className="relative h-1 my-8">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-600/30 to-transparent"></div>
        <div className="absolute inset-0 flex justify-center items-center">
          <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="15" cy="10" r="4" fill="#D4887F" opacity="0.6" />
            <circle cx="7" cy="10" r="2.5" fill="#E8956C" opacity="0.5" />
            <circle cx="23" cy="10" r="2.5" fill="#E8956C" opacity="0.5" />
          </svg>
        </div>
      </div>

      {/* Bill To & Dates */}
      <div className="grid grid-cols-2 gap-12">
        <div className="space-y-3">
          <div className="border-l-4 border-rose-400/50 pl-4">
            <p className="text-xs uppercase tracking-[0.2em] text-rose-800/70 font-light mb-3">Billed To</p>
            <p className="text-base font-bold text-[#1a1a1a]" style={{ fontFamily: "'Playfair Display', serif" }}>{invoiceData.toCompany}</p>
          </div>
        </div>

        <div className="space-y-3 text-sm bg-gradient-to-br from-amber-50/50 to-rose-50/50 p-5 border border-amber-200/50 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-amber-800/80 font-medium tracking-wide">Issue Date</span>
            <span className="font-semibold text-[#1a1a1a]">
              {invoiceData.date
                ? new Date(invoiceData.date).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : '4th Oct, 2025'}
            </span>
          </div>
          {invoiceData.dueDate && (
            <div className="flex justify-between items-center pt-2 border-t border-amber-200/40">
              <span className="text-amber-800/80 font-medium tracking-wide">Due Date</span>
              <span className="font-semibold text-[#1a1a1a]">
                {new Date(invoiceData.dueDate).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-amber-200/40">
            <span className="text-amber-800/80 font-medium tracking-wide">Amount Due</span>
            <span className="font-bold text-amber-900 text-base">
              {currencySymbol}
              {invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-5 py-8 relative">
        {/* Decorative header with border */}
        <div className="flex justify-between text-xs uppercase tracking-[0.25em] text-amber-900/70 font-semibold pb-4 border-b-2 border-amber-600/40">
          <span>Description</span>
          <span>Amount</span>
        </div>
        {invoiceData.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm py-3 border-b border-amber-200/30 hover:bg-amber-50/30 transition-colors px-2">
            <div className="flex-1">
              <span className="text-[#262626] font-medium">{item.description}</span>
              <span className="text-[#666666] text-xs ml-3">× {item.quantity}</span>
            </div>
            <span className="font-semibold text-amber-900 ml-4">
              {currencySymbol}
              {(item.quantity * item.price).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Total Section with decorative background */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 via-rose-600/10 to-amber-600/10 transform -skew-y-1"></div>
        <div className="relative flex justify-between items-center text-lg py-6 px-4">
          <span className="font-bold text-amber-900 tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>Total Amount</span>
          <span className="font-bold text-2xl text-amber-900">
            {currencySymbol}
            {invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Enhanced Floral Design - Bottom Left */}
      <div className="absolute bottom-[20mm] left-[10mm] w-64 h-64 opacity-25">
        <svg viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Enhanced Artistic Flowers Illustration */}
          {/* Main large flower */}
          <circle cx="80" cy="160" r="22" fill="#E8956C" opacity="0.7" />
          <circle cx="78" cy="158" r="12" fill="#F5C89B" opacity="0.8" />
          <circle cx="80" cy="160" r="6" fill="#8B5A3C" opacity="0.5" />

          {/* Petals around main flower */}
          <ellipse cx="60" cy="150" rx="10" ry="16" fill="#D4887F" opacity="0.6" transform="rotate(-45 60 150)" />
          <ellipse cx="100" cy="150" rx="10" ry="16" fill="#D4887F" opacity="0.6" transform="rotate(45 100 150)" />
          <ellipse cx="90" cy="180" rx="10" ry="16" fill="#E8A87C" opacity="0.6" transform="rotate(25 90 180)" />
          <ellipse cx="70" cy="180" rx="10" ry="16" fill="#E8A87C" opacity="0.6" transform="rotate(-25 70 180)" />

          {/* Side flower cluster */}
          <ellipse cx="45" cy="180" rx="14" ry="20" fill="#D4887F" opacity="0.65" transform="rotate(-30 45 180)" />
          <ellipse cx="48" cy="178" rx="8" ry="12" fill="#F5C89B" opacity="0.75" transform="rotate(-30 48 178)" />
          <circle cx="48" cy="180" r="4" fill="#C97D6C" opacity="0.6" />

          {/* Another decorative flower */}
          <circle cx="125" cy="190" r="20" fill="#C97D6C" opacity="0.7" />
          <circle cx="125" cy="190" r="11" fill="#F5D4A0" opacity="0.8" />
          <circle cx="128" cy="187" r="5" fill="#8B5A3C" opacity="0.5" />

          {/* Small accent flowers */}
          <circle cx="40" cy="210" r="8" fill="#E8956C" opacity="0.5" />
          <circle cx="110" cy="215" r="7" fill="#D4887F" opacity="0.5" />
          <circle cx="150" cy="205" r="9" fill="#E8A87C" opacity="0.5" />

          {/* Stems and leaves */}
          <path d="M 80 182 Q 75 200 70 220" stroke="#6B9080" strokeWidth="3" fill="none" opacity="0.5" />
          <path d="M 45 200 Q 40 215 35 230" stroke="#7A9982" strokeWidth="2.5" fill="none" opacity="0.5" />
          <path d="M 125 210 Q 120 225 115 240" stroke="#6B9080" strokeWidth="3" fill="none" opacity="0.5" />

          {/* Decorative leaves */}
          <ellipse cx="55" cy="205" rx="6" ry="12" fill="#6B9080" opacity="0.4" transform="rotate(60 55 205)" />
          <ellipse cx="95" cy="210" rx="7" ry="14" fill="#7A9982" opacity="0.4" transform="rotate(-45 95 210)" />
          <ellipse cx="135" cy="215" rx="6" ry="11" fill="#6B9080" opacity="0.4" transform="rotate(30 135 215)" />

          {/* Decorative dots and accents */}
          <circle cx="30" cy="195" r="3" fill="#E8956C" opacity="0.4" />
          <circle cx="160" cy="200" r="3" fill="#D4887F" opacity="0.4" />
          <circle cx="50" cy="225" r="2.5" fill="#C97D6C" opacity="0.4" />
          <circle cx="140" cy="225" r="2.5" fill="#E8A87C" opacity="0.4" />

          {/* Abstract artistic swooshes */}
          <path
            d="M 60 225 Q 70 220 80 225 Q 90 230 100 225"
            stroke="#D4A574"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
            strokeLinecap="round"
          />
          <path
            d="M 100 235 Q 110 230 120 235"
            stroke="#C97D6C"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Decorative right side accent */}
      <div className="absolute bottom-[40mm] right-[15mm] w-32 h-32 opacity-15 transform rotate-45">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="15" fill="#E8956C" />
          <circle cx="48" cy="48" r="8" fill="#F5C89B" />
          <path d="M 30 50 Q 40 45 50 50 Q 60 55 70 50" stroke="#D4A574" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Payment Details */}
      {paymentDetails.method === 'bank' && paymentDetails.bankDetails && (
        <div className="space-y-4 pt-8 relative z-10 bg-amber-50/30 p-6 border-l-4 border-amber-600/60">
          <p className="text-sm font-bold tracking-wide text-amber-900 uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>Payment Details</p>
          <div className="text-sm space-y-3 leading-relaxed">
            <div className="flex items-center">
              <span className="text-amber-800/70 w-36 font-medium">Account Name</span>
              <span className="text-amber-800/70">:</span>
              <span className="ml-3 font-semibold text-[#1a1a1a]">{paymentDetails.bankDetails.accountName}</span>
            </div>
            <div className="flex items-center">
              <span className="text-amber-800/70 w-36 font-medium">Bank Name</span>
              <span className="text-amber-800/70">:</span>
              <span className="ml-3 font-semibold text-[#1a1a1a]">{paymentDetails.bankDetails.bankName}</span>
            </div>
            <div className="flex items-center">
              <span className="text-amber-800/70 w-36 font-medium">Account Number</span>
              <span className="text-amber-800/70">:</span>
              <span className="ml-3 font-semibold font-mono text-[#1a1a1a]">{paymentDetails.bankDetails.accountNumber}</span>
            </div>
            {paymentDetails.bankDetails.swiftCode && (
              <div className="flex items-center">
                <span className="text-amber-800/70 w-36 font-medium">SWIFT Code</span>
                <span className="text-amber-800/70">:</span>
                <span className="ml-3 font-semibold font-mono text-[#1a1a1a]">{paymentDetails.bankDetails.swiftCode}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {paymentDetails.method === 'crypto' &&
        paymentDetails.cryptoDetails &&
        paymentDetails.cryptoDetails.walletAddress && (
          <div className="space-y-4 pt-8 relative z-10 bg-amber-50/30 p-6 border-l-4 border-amber-600/60">
            <p className="text-sm font-bold tracking-wide text-amber-900 uppercase mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Payment Details</p>
            <div className="flex gap-6 items-start">
              <div className="flex-1 text-sm space-y-3">
                {paymentDetails.cryptoDetails.currency && (
                  <div className="flex items-center">
                    <span className="text-amber-800/70 w-32 font-medium">Currency</span>
                    <span className="text-amber-800/70">:</span>
                    <span className="ml-3 font-semibold text-[#1a1a1a]">{paymentDetails.cryptoDetails.currency}</span>
                  </div>
                )}
                {paymentDetails.cryptoDetails.network && (
                  <div className="flex items-center">
                    <span className="text-amber-800/70 w-32 font-medium">Network</span>
                    <span className="text-amber-800/70">:</span>
                    <span className="ml-3 font-semibold text-[#1a1a1a]">{paymentDetails.cryptoDetails.network}</span>
                  </div>
                )}
                <div>
                  <div className="flex mb-2">
                    <span className="text-amber-800/70 w-32 font-medium">Wallet Address</span>
                    <span className="text-amber-800/70">:</span>
                  </div>
                  <p className="font-mono text-xs break-all ml-3 bg-white p-3 border border-amber-200/50 text-[#1a1a1a]">{paymentDetails.cryptoDetails.walletAddress}</p>
                </div>
              </div>
              <div className="bg-white p-3 border-2 border-amber-200/50 relative shrink-0 shadow-sm">
                <QRCode
                  value={paymentDetails.cryptoDetails.walletAddress}
                  size={100}
                  level="H"
                  className="w-full h-full"
                  style={{ height: 'auto', maxWidth: '100%', width: '100px' }}
                />
                {logo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white p-1 rounded-sm shadow-sm">
                      <img src={logo} alt="Logo" className="w-6 h-6 object-contain" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      {paymentDetails.method === 'other' && paymentDetails.otherDetails && (
        <div className="space-y-4 pt-8 relative z-10 bg-amber-50/30 p-6 border-l-4 border-amber-600/60">
          <p className="text-sm font-bold tracking-wide text-amber-900 uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>Payment Details</p>
          <p className="text-sm whitespace-pre-line leading-relaxed text-[#262626]">{paymentDetails.otherDetails}</p>
        </div>
      )}

      {/* Notes and Terms */}
      {(invoiceData.notes || invoiceData.terms) && (
        <div className="space-y-6 pt-8 relative z-10">
          {invoiceData.notes && (
            <div className="bg-rose-50/30 p-6 border-l-4 border-rose-400/50">
              <p className="text-sm font-bold tracking-wide text-rose-900 uppercase mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Notes</p>
              <p className="text-sm text-[#262626] whitespace-pre-line leading-relaxed">{invoiceData.notes}</p>
            </div>
          )}
          {invoiceData.terms && (
            <div className="bg-rose-50/30 p-6 border-l-4 border-rose-400/50">
              <p className="text-sm font-bold tracking-wide text-rose-900 uppercase mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Terms & Conditions</p>
              <p className="text-sm text-[#262626] whitespace-pre-line leading-relaxed">{invoiceData.terms}</p>
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
  const taxRate = invoiceData.taxRate || 0;
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  return (
    <div className="bg-white p-[25mm] min-h-[297mm]">
      {/* Header */}
      <div className="flex justify-between items-start pb-8 mb-8 border-b-2 border-[#b0b0b0]">
        <div className="space-y-4">
          {logo && (
            <div className="w-40 h-20">
              <img src={logo} alt="Company Logo" className="w-full h-full object-contain" />
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold text-[#1a1a1a]">INVOICE</h1>
            <p className="text-[#4a4a4a] mt-1">#{invoiceData.invoiceNumber}</p>
          </div>
        </div>
        <div className="text-right space-y-2 bg-[#f8f8f8] p-5 border border-[#d0d0d0]">
          <div>
            <p className="text-xs text-[#666666] uppercase font-semibold">Date</p>
            <p className="text-[#1a1a1a] font-semibold">
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
            <div className="pt-2 border-t border-[#d0d0d0]">
              <p className="text-xs text-[#666666] uppercase font-semibold">Due Date</p>
              <p className="text-[#1a1a1a] font-semibold">
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
          <p className="text-xs text-[#666666] uppercase font-semibold mb-3">From</p>
          <p className="text-[#1a1a1a] font-bold text-lg">{invoiceData.fromCompany}</p>
          <p className="text-[#4a4a4a] text-sm mt-2 whitespace-pre-line leading-relaxed">{invoiceData.fromAddress}</p>
        </div>
        <div>
          <p className="text-xs text-[#666666] uppercase font-semibold mb-3">Bill To</p>
          <p className="text-[#1a1a1a] font-bold text-lg">{invoiceData.toCompany}</p>
          <p className="text-[#4a4a4a] text-sm mt-2 whitespace-pre-line leading-relaxed">{invoiceData.toAddress}</p>
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
              <tr key={index} className={`border-b border-[#d0d0d0] ${index % 2 === 0 ? 'bg-[#f8f8f8]' : 'bg-white'}`}>
                <td className="py-3 px-4 text-[#1a1a1a]">{item.description}</td>
                <td className="py-3 px-4 text-center text-[#333333]">{item.quantity}</td>
                <td className="py-3 px-4 text-right text-[#333333]">
                  {currencySymbol}
                  {item.price.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right text-[#1a1a1a] font-semibold">
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
          <div className="flex justify-between py-2 border-b border-[#d0d0d0]">
            <span className="text-[#4a4a4a]">Subtotal</span>
            <span className="text-[#1a1a1a] font-semibold">
              {currencySymbol}
              {subtotal.toFixed(2)}
            </span>
          </div>
          {taxRate > 0 && (
            <div className="flex justify-between py-2 border-b border-[#d0d0d0]">
              <span className="text-[#4a4a4a]">Tax ({taxRate}%)</span>
              <span className="text-[#1a1a1a] font-semibold">
                {currencySymbol}
                {taxAmount.toFixed(2)}
              </span>
            </div>
          )}
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
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-[#d0d0d0]">
          {paymentDetails.method && (
            <div>
              <h3 className="text-[#1a1a1a] font-bold mb-3 text-sm uppercase">Payment Information</h3>
              {paymentDetails.method === 'bank' && paymentDetails.bankDetails && (
                <div className="space-y-1 text-sm">
                  {paymentDetails.bankDetails.bankName && (
                    <p>
                      <span className="text-[#666666]">Bank:</span>{' '}
                      <span className="text-[#1a1a1a] ml-2">{paymentDetails.bankDetails.bankName}</span>
                    </p>
                  )}
                  {paymentDetails.bankDetails.accountName && (
                    <p>
                      <span className="text-[#666666]">Account Name:</span>{' '}
                      <span className="text-[#1a1a1a] ml-2">{paymentDetails.bankDetails.accountName}</span>
                    </p>
                  )}
                  {paymentDetails.bankDetails.accountNumber && (
                    <p>
                      <span className="text-[#666666]">Account Number:</span>{' '}
                      <span className="text-[#1a1a1a] font-mono ml-2">{paymentDetails.bankDetails.accountNumber}</span>
                    </p>
                  )}
                  {paymentDetails.bankDetails.swiftCode && (
                    <p>
                      <span className="text-[#666666]">SWIFT:</span>{' '}
                      <span className="text-[#1a1a1a] font-mono ml-2">{paymentDetails.bankDetails.swiftCode}</span>
                    </p>
                  )}
                </div>
              )}
              {paymentDetails.method === 'crypto' && paymentDetails.cryptoDetails?.walletAddress && (
                <div className="mt-3 p-3 bg-[#f8f8f8] border border-[#d0d0d0]">
                  <div className="flex justify-center mb-2">
                    <QRCode value={paymentDetails.cryptoDetails.walletAddress} size={100} />
                  </div>
                  <p className="text-[#4a4a4a] text-xs text-center break-all font-mono">
                    {paymentDetails.cryptoDetails.walletAddress}
                  </p>
                </div>
              )}
            </div>
          )}
          {invoiceData.notes && (
            <div>
              <h3 className="text-[#1a1a1a] font-bold mb-3 text-sm uppercase">Notes</h3>
              <p className="text-[#4a4a4a] text-sm leading-relaxed">{invoiceData.notes}</p>
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
              <div className="w-40 h-20 border-2 border-[#d0d0d0] p-2">
                <img src={logo} alt="Company Logo" className="w-full h-full object-contain" />
              </div>
            )}
            <div>
              <h1 className="text-5xl font-bold text-[#1a1a1a]">INVOICE</h1>
              <p className="text-blue-600 font-semibold text-lg mt-1">#{invoiceData.invoiceNumber}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="mb-4">
              <p className="text-xs text-[#666666] uppercase font-semibold mb-1">Invoice Date</p>
              <p className="text-[#1a1a1a] font-semibold">
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
                <p className="text-xs text-[#666666] uppercase font-semibold mb-1">Payment Due</p>
                <p className="text-[#1a1a1a] font-semibold">
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
      <div className="grid grid-cols-2 gap-12 mb-10 pb-8 border-b border-[#d0d0d0]">
        <div>
          <p className="text-xs text-blue-600 uppercase font-bold mb-3 tracking-wide">Billed From</p>
          <p className="text-[#1a1a1a] font-bold text-base mb-1">{invoiceData.fromCompany}</p>
          <p className="text-[#4a4a4a] text-sm whitespace-pre-line leading-relaxed">{invoiceData.fromAddress}</p>
        </div>
        <div>
          <p className="text-xs text-blue-600 uppercase font-bold mb-3 tracking-wide">Billed To</p>
          <p className="text-[#1a1a1a] font-bold text-base mb-1">{invoiceData.toCompany}</p>
          <p className="text-[#4a4a4a] text-sm whitespace-pre-line leading-relaxed">{invoiceData.toAddress}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-blue-600">
              <th className="py-3 px-0 text-left text-xs font-bold text-[#333333] uppercase tracking-wide">
                Item Description
              </th>
              <th className="py-3 px-4 text-center text-xs font-bold text-[#333333] uppercase tracking-wide">
                Quantity
              </th>
              <th className="py-3 px-4 text-right text-xs font-bold text-[#333333] uppercase tracking-wide">Rate</th>
              <th className="py-3 px-4 text-right text-xs font-bold text-[#333333] uppercase tracking-wide">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index} className="border-b border-[#d0d0d0]">
                <td className="py-4 px-0 text-[#1a1a1a] font-medium">{item.description}</td>
                <td className="py-4 px-4 text-center text-[#333333]">{item.quantity}</td>
                <td className="py-4 px-4 text-right text-[#333333]">
                  {currencySymbol}
                  {item.price.toFixed(2)}
                </td>
                <td className="py-4 px-4 text-right text-[#1a1a1a] font-semibold">
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
          <div className="flex justify-between py-3 border-b border-[#b0b0b0]">
            <span className="text-[#4a4a4a] font-semibold">Subtotal</span>
            <span className="text-[#1a1a1a] font-semibold">
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
        <div className="grid grid-cols-2 gap-10 pt-8 border-t border-[#d0d0d0]">
          {paymentDetails.method && (
            <div>
              <h3 className="text-[#1a1a1a] font-bold mb-4 text-sm uppercase tracking-wide">Payment Instructions</h3>
              {paymentDetails.method === 'bank' && paymentDetails.bankDetails && (
                <div className="space-y-2 text-sm">
                  {paymentDetails.bankDetails.bankName && (
                    <div className="flex">
                      <span className="text-[#666666] w-32">Bank Name:</span>
                      <span className="text-[#1a1a1a] font-medium">{paymentDetails.bankDetails.bankName}</span>
                    </div>
                  )}
                  {paymentDetails.bankDetails.accountName && (
                    <div className="flex">
                      <span className="text-[#666666] w-32">Account Name:</span>
                      <span className="text-[#1a1a1a] font-medium">{paymentDetails.bankDetails.accountName}</span>
                    </div>
                  )}
                  {paymentDetails.bankDetails.accountNumber && (
                    <div className="flex">
                      <span className="text-[#666666] w-32">Account No:</span>
                      <span className="text-[#1a1a1a] font-mono font-medium">
                        {paymentDetails.bankDetails.accountNumber}
                      </span>
                    </div>
                  )}
                  {paymentDetails.bankDetails.swiftCode && (
                    <div className="flex">
                      <span className="text-[#666666] w-32">SWIFT Code:</span>
                      <span className="text-[#1a1a1a] font-mono font-medium">
                        {paymentDetails.bankDetails.swiftCode}
                      </span>
                    </div>
                  )}
                </div>
              )}
              {paymentDetails.method === 'crypto' && paymentDetails.cryptoDetails?.walletAddress && (
                <div className="mt-3 p-4 bg-[#f8f8f8] border border-[#d0d0d0]">
                  <div className="flex justify-center mb-2">
                    <QRCode value={paymentDetails.cryptoDetails.walletAddress} size={100} />
                  </div>
                  <p className="text-[#4a4a4a] text-xs text-center break-all font-mono mt-2">
                    {paymentDetails.cryptoDetails.walletAddress}
                  </p>
                </div>
              )}
            </div>
          )}
          {invoiceData.notes && (
            <div>
              <h3 className="text-[#1a1a1a] font-bold mb-4 text-sm uppercase tracking-wide">Terms & Notes</h3>
              <p className="text-[#4a4a4a] text-sm leading-relaxed">{invoiceData.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer Bar */}
      <div className="mt-16 pt-6 border-t border-[#d0d0d0]">
        <p className="text-center text-xs text-[#666666]">Thank you for your business</p>
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
              <h1 className="text-5xl font-bold text-[#1a1a1a] tracking-wide">INVOICE</h1>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="bg-[#f0f0f0] px-4 py-2 border-l-4 border-gray-700">
              <p className="text-[#1a1a1a] font-bold">#{invoiceData.invoiceNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="flex gap-3">
          <span className="text-[#4a4a4a] font-semibold min-w-[100px]">Date:</span>
          <span className="text-[#1a1a1a]">
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
            <span className="text-[#4a4a4a] font-semibold min-w-[100px]">Due Date:</span>
            <span className="text-[#1a1a1a]">
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
          <p className="text-[#4a4a4a] font-semibold uppercase text-xs mb-3 tracking-wide">From</p>
          <div className="border-l-2 border-[#b0b0b0] pl-4">
            <p className="text-[#1a1a1a] font-bold text-base">{invoiceData.fromCompany}</p>
            <p className="text-[#4a4a4a] text-sm mt-1 whitespace-pre-line leading-relaxed">{invoiceData.fromAddress}</p>
          </div>
        </div>
        <div>
          <p className="text-[#4a4a4a] font-semibold uppercase text-xs mb-3 tracking-wide">Bill To</p>
          <div className="border-l-2 border-[#b0b0b0] pl-4">
            <p className="text-[#1a1a1a] font-bold text-base">{invoiceData.toCompany}</p>
            <p className="text-[#4a4a4a] text-sm mt-1 whitespace-pre-line leading-relaxed">{invoiceData.toAddress}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-10">
        <table className="w-full border-collapse border-2 border-[#b0b0b0]">
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
              <tr key={index} className={`border-b border-[#b0b0b0] ${index % 2 === 0 ? 'bg-white' : 'bg-[#f8f8f8]'}`}>
                <td className="py-3 px-4 text-[#1a1a1a] border-r border-[#b0b0b0]">{item.description}</td>
                <td className="py-3 px-4 text-center text-[#333333] border-r border-[#b0b0b0]">{item.quantity}</td>
                <td className="py-3 px-4 text-right text-[#333333] border-r border-[#b0b0b0]">
                  {currencySymbol}
                  {item.price.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right text-[#1a1a1a] font-semibold">
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
        <div className="w-80 border-2 border-[#b0b0b0]">
          <div className="flex justify-between py-2 px-4 bg-[#f8f8f8] border-b border-[#b0b0b0]">
            <span className="text-[#333333] font-semibold">Subtotal:</span>
            <span className="text-[#1a1a1a] font-semibold">
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
        <div className="border-t-2 border-[#b0b0b0] pt-8 mt-8">
          <div className="grid grid-cols-2 gap-10">
            {paymentDetails.method && (
              <div>
                <h3 className="text-[#1a1a1a] font-bold mb-4 text-sm uppercase">Remittance Information</h3>
                {paymentDetails.method === 'bank' && paymentDetails.bankDetails && (
                  <div className="space-y-2 text-sm bg-[#f8f8f8] p-4 border-l-4 border-gray-700">
                    {paymentDetails.bankDetails.bankName && (
                      <div className="flex gap-2">
                        <span className="text-[#4a4a4a] font-semibold min-w-[120px]">Bank Name:</span>
                        <span className="text-[#1a1a1a]">{paymentDetails.bankDetails.bankName}</span>
                      </div>
                    )}
                    {paymentDetails.bankDetails.accountName && (
                      <div className="flex gap-2">
                        <span className="text-[#4a4a4a] font-semibold min-w-[120px]">Account Name:</span>
                        <span className="text-[#1a1a1a]">{paymentDetails.bankDetails.accountName}</span>
                      </div>
                    )}
                    {paymentDetails.bankDetails.accountNumber && (
                      <div className="flex gap-2">
                        <span className="text-[#4a4a4a] font-semibold min-w-[120px]">Account Number:</span>
                        <span className="text-[#1a1a1a] font-mono">{paymentDetails.bankDetails.accountNumber}</span>
                      </div>
                    )}
                    {paymentDetails.bankDetails.swiftCode && (
                      <div className="flex gap-2">
                        <span className="text-[#4a4a4a] font-semibold min-w-[120px]">SWIFT/BIC:</span>
                        <span className="text-[#1a1a1a] font-mono">{paymentDetails.bankDetails.swiftCode}</span>
                      </div>
                    )}
                  </div>
                )}
                {paymentDetails.method === 'crypto' && paymentDetails.cryptoDetails?.walletAddress && (
                  <div className="p-4 bg-[#f8f8f8] border-l-4 border-gray-700">
                    <div className="flex justify-center mb-2">
                      <QRCode value={paymentDetails.cryptoDetails.walletAddress} size={100} />
                    </div>
                    <p className="text-[#4a4a4a] text-xs text-center break-all font-mono mt-2">
                      {paymentDetails.cryptoDetails.walletAddress}
                    </p>
                  </div>
                )}
              </div>
            )}
            {invoiceData.notes && (
              <div>
                <h3 className="text-[#1a1a1a] font-bold mb-4 text-sm uppercase">Payment Terms & Notes</h3>
                <p className="text-[#333333] text-sm leading-relaxed bg-[#f8f8f8] p-4 border-l-4 border-gray-700">
                  {invoiceData.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-16 pt-4 border-t border-[#b0b0b0]">
        <p className="text-center text-xs text-[#666666]">
          Payment is due within the specified terms. Late payments may incur additional fees.
        </p>
      </div>
    </div>
  );
}

export function CattyTemplate({ logo: _logo, invoiceData, paymentDetails }: TemplateProps) {
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
      <div className="grid grid-cols-2 gap-8 mb-16 pb-8 border-b border-[#b0b0b0]">
        <div className="text-sm leading-relaxed">
          <p className="mb-2">Billed to:</p>
          <p className="font-medium">{invoiceData.toCompany}</p>
        </div>

        <div className="text-sm leading-relaxed text-right space-y-3">
          <div>
            <p className="text-[#4a4a4a] mb-1">Issue Date</p>
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
              <p className="text-[#4a4a4a] mb-1">Due Date</p>
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
            <p className="text-[#4a4a4a] mb-1">Amount Due</p>
            <p className="font-medium text-lg">
              {currencySymbol}
              {subtotal.toFixed(0)}
            </p>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-16">
        <div className="grid grid-cols-2 gap-8 text-sm font-medium mb-6 pb-3 border-b border-[#b0b0b0]">
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
      <div className="flex justify-between items-center mb-20 pb-8 border-b border-[#b0b0b0]">
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
                <span className="inline-block w-40 text-[#4a4a4a]">Name</span>
                <span>: {paymentDetails.bankDetails.accountName}</span>
              </div>
            )}

            {paymentDetails.bankDetails.accountNumber && (
              <div className="flex">
                <span className="inline-block w-40 text-[#4a4a4a]">Account Number</span>
                <span>: {paymentDetails.bankDetails.accountNumber}</span>
              </div>
            )}

            {paymentDetails.bankDetails.swiftCode && (
              <div className="flex">
                <span className="inline-block w-40 text-[#4a4a4a]">SWIFT</span>
                <span>: {paymentDetails.bankDetails.swiftCode}</span>
              </div>
            )}

            {paymentDetails.bankDetails.bankName && (
              <div className="flex">
                <span className="inline-block w-40 text-[#4a4a4a]">IFSC</span>
                <span>: {paymentDetails.bankDetails.bankName}</span>
              </div>
            )}

            {/* Notes below bank details */}
            {invoiceData.notes && (
              <div className="mt-8 pt-8 border-t border-[#b0b0b0]">
                <p className="whitespace-pre-wrap">{invoiceData.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cat Image - Bottom Left */}
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px]">
        <img src={catPeekImage} alt="Cat peeking" className="w-full h-full object-contain" />
      </div>

      {/* Signature */}
      <div className="absolute bottom-8 right-20 text-sm">
        <p className="italic text-[#4a4a4a]" style={{ fontFamily: 'cursive' }}>
          -{invoiceData.fromCompany?.split('\n')[0]?.split(' ')[0] || 'Signature'}
        </p>
      </div>
    </div>
  );
}

// Light Floral Template - White background with same layout as dark
export function FloralTemplate({ logo: _logo, invoiceData, paymentDetails }: TemplateProps) {
  const currencySymbol = getCurrencySymbol(invoiceData.currency);
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="relative bg-white text-[#1a1a1a] min-h-[297mm] p-[20mm]" style={{ fontFamily: 'monospace' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-16">
        <div className="text-sm leading-relaxed">
          <p className="mb-1 text-[#666666]">From,</p>
          <p className="font-medium">{invoiceData.fromCompany?.split('\n')[0] || 'Company Name'}</p>
          {invoiceData.fromCompany
            ?.split('\n')
            .slice(1)
            .map((line, idx) => (
              <p key={idx} className="text-[#333333]">
                {line}
              </p>
            ))}
          {invoiceData.fromAddress?.split('\n').map((line, idx) => (
            <p key={idx} className="text-[#333333]">
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
      <div className="grid grid-cols-2 gap-8 mb-16 pb-8 border-b border-[#b0b0b0]">
        <div className="text-sm leading-relaxed">
          <p className="mb-2 text-[#666666]">Billed to:</p>
          <p className="font-medium">{invoiceData.toCompany}</p>
        </div>

        <div className="text-sm leading-relaxed text-right space-y-3">
          <div>
            <p className="text-[#666666] mb-1">Issue Date</p>
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
              <p className="text-[#666666] mb-1">Due Date</p>
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
            <p className="text-[#666666] mb-1">Amount Due</p>
            <p className="font-medium text-lg">
              {currencySymbol}
              {subtotal.toFixed(0)}
            </p>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-16">
        <div className="grid grid-cols-2 gap-8 text-sm font-medium mb-6 pb-3 border-b border-[#b0b0b0]">
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
      <div className="flex justify-between items-center mb-20 pb-8 border-b border-[#b0b0b0]">
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
                <span className="inline-block w-40 text-[#666666]">Name</span>
                <span>: {paymentDetails.bankDetails.accountName}</span>
              </div>
            )}

            {paymentDetails.bankDetails.accountNumber && (
              <div className="flex">
                <span className="inline-block w-40 text-[#666666]">Account Number</span>
                <span>: {paymentDetails.bankDetails.accountNumber}</span>
              </div>
            )}

            {paymentDetails.bankDetails.swiftCode && (
              <div className="flex">
                <span className="inline-block w-40 text-[#666666]">SWIFT</span>
                <span>: {paymentDetails.bankDetails.swiftCode}</span>
              </div>
            )}

            {paymentDetails.bankDetails.bankName && (
              <div className="flex">
                <span className="inline-block w-40 text-[#666666]">IFSC</span>
                <span>: {paymentDetails.bankDetails.bankName}</span>
              </div>
            )}

            {/* Notes below bank details */}
            {invoiceData.notes && (
              <div className="mt-8 pt-8 border-t border-[#b0b0b0]">
                <p className="whitespace-pre-wrap text-[#333333]">{invoiceData.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floral Image - Bottom Left */}
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px]">
        <img src={flowerImage} alt="Floral decoration" className="w-full h-full object-contain" />
      </div>

      {/* Signature */}
      <div className="absolute bottom-8 right-20 text-sm">
        <p className="italic text-[#666666]" style={{ fontFamily: 'cursive' }}>
          -{invoiceData.fromCompany?.split('\n')[0]?.split(' ')[0] || 'Signature'}
        </p>
      </div>
    </div>
  );
}

// Dark Floral Template - Dark background with floral image
export function FloralDarkTemplate({ logo: _logo, invoiceData, paymentDetails }: TemplateProps) {
  const currencySymbol = getCurrencySymbol(invoiceData.currency);
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="relative bg-[#1a1a1a] text-white min-h-[297mm] p-[20mm]" style={{ fontFamily: 'monospace' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-16">
        <div className="text-sm leading-relaxed">
          <p className="mb-1 text-[#888888]">From,</p>
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
          <p className="mb-2 text-[#888888]">Billed to:</p>
          <p className="font-medium">{invoiceData.toCompany}</p>
        </div>

        <div className="text-sm leading-relaxed text-right space-y-3">
          <div>
            <p className="text-[#888888] mb-1">Issue Date</p>
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
              <p className="text-[#888888] mb-1">Due Date</p>
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
            <p className="text-[#888888] mb-1">Amount Due</p>
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
                <span className="inline-block w-40 text-[#888888]">Name</span>
                <span>: {paymentDetails.bankDetails.accountName}</span>
              </div>
            )}

            {paymentDetails.bankDetails.accountNumber && (
              <div className="flex">
                <span className="inline-block w-40 text-[#888888]">Account Number</span>
                <span>: {paymentDetails.bankDetails.accountNumber}</span>
              </div>
            )}

            {paymentDetails.bankDetails.swiftCode && (
              <div className="flex">
                <span className="inline-block w-40 text-[#888888]">SWIFT</span>
                <span>: {paymentDetails.bankDetails.swiftCode}</span>
              </div>
            )}

            {paymentDetails.bankDetails.bankName && (
              <div className="flex">
                <span className="inline-block w-40 text-[#888888]">IFSC</span>
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
        <img src={flowerImage} alt="Floral decoration" className="w-full h-full object-contain" />
      </div>

      {/* Signature */}
      <div className="absolute bottom-8 right-20 text-sm">
        <p className="italic text-[#888888]" style={{ fontFamily: 'cursive' }}>
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
            <p className="text-sm text-[#4a4a4a]">{fromEmail}</p>
            <p className="text-sm text-[#4a4a4a]">{fromPhone}</p>
          </div>
        </div>

        {/* Right Side - Invoice Title & Number */}
        <div className="text-right">
          <h1 className="text-6xl font-light text-gray-300 tracking-wide">Invoice</h1>
          <p className="text-lg text-[#333333] mt-1">#{invoiceData.invoiceNumber}</p>
        </div>
      </div>

      {/* Billing Info Section */}
      <div className="grid grid-cols-3 gap-8 mb-12">
        {/* Billed To */}
        <div>
          <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-3">Billed to</p>
          <p className="font-semibold text-[#1a1a1a] mb-1">{invoiceData.toCompany || 'Company Name'}</p>
          <p className="text-sm text-[#4a4a4a] leading-relaxed whitespace-pre-line">{invoiceData.toAddress || 'Company address\nCity, Country 00000'}</p>
        </div>

        {/* Invoice Date */}
        <div>
          <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-3">Invoice date</p>
          <p className="text-[#1a1a1a]">{invoiceData.date}</p>
        </div>

        {/* Due Date */}
        <div>
          <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-3">Due date</p>
          <p className="text-[#1a1a1a]">{invoiceData.dueDate || 'N/A'}</p>
        </div>
      </div>

      {/* Amount Due - Highlighted Box */}
      <div className="flex justify-end mb-12">
        <div className="bg-[#d4f542] px-6 py-4 rounded">
          <p className="text-xs font-semibold text-[#333333] uppercase tracking-wider mb-1">Amount due</p>
          <p className="text-3xl font-bold text-[#1a1a1a]">{invoiceData.currency || 'US$'} {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Service Description */}
      <h3 className="text-xl font-semibold text-[#1a1a1a] mb-8">Digital product design</h3>

      {/* Line Items Table */}
      <div className="mb-12">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 pb-3 border-b border-[#b0b0b0] mb-4">
          <div className="col-span-1">
            <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider">#</p>
          </div>
          <div className="col-span-9">
            <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider">Title / Description</p>
          </div>
          <div className="col-span-2 text-right">
            <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider">Subtotal</p>
          </div>
        </div>

        {/* Table Items */}
        <div className="space-y-8">
          {invoiceData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4">
              <div className="col-span-1">
                <p className="text-[#1a1a1a] font-medium">{index + 1}</p>
              </div>
              <div className="col-span-9">
                <p className="font-medium text-[#1a1a1a] mb-1">{item.description}</p>
                <p className="text-sm text-[#666666]">01 Jul - 20 Jul • Hours log ↗</p>
              </div>
              <div className="col-span-2 text-right">
                <p className="text-[#1a1a1a] font-medium">{currencySymbol}{(item.quantity * item.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Section */}
      <div className="flex justify-end mb-4 pb-4 border-b border-[#b0b0b0]">
        <div className="w-64">
          <div className="flex justify-between">
            <p className="font-semibold text-[#1a1a1a]">Total</p>
            <p className="font-semibold text-[#1a1a1a]">{currencySymbol}{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* Payment Notice */}
      <div className="flex items-start gap-2 text-sm text-[#4a4a4a] mb-20">
        <span className="text-[#888888]">ℹ️</span>
        <p>Please pay within 15 days of receiving this invoice.</p>
      </div>

      {/* Thank You Message */}
      <p className="text-lg font-medium text-[#333333] mb-8">Thank you for the business!</p>

      {/* Payment Info */}
      {paymentDetails.method === 'bank' && paymentDetails.bankDetails && (
        <div className="border-t border-[#b0b0b0] pt-6">
          <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-4">Payment info</p>
          <div className="grid grid-cols-4 gap-6 text-sm">
            {paymentDetails.bankDetails.accountName && (
              <div>
                <p className="text-xs font-semibold text-[#666666] uppercase mb-1">Account name</p>
                <p className="text-[#1a1a1a]">{paymentDetails.bankDetails.accountName}</p>
                <p className="text-xs text-[#666666] mt-1">Business address, City, State, IN - 000 000</p>
              </div>
            )}
            {paymentDetails.bankDetails.bankName && (
              <div>
                <p className="text-xs font-semibold text-[#666666] uppercase mb-1">Bank name</p>
                <p className="text-[#1a1a1a]">{paymentDetails.bankDetails.bankName}</p>
              </div>
            )}
            {paymentDetails.bankDetails.swiftCode && (
              <div>
                <p className="text-xs font-semibold text-[#666666] uppercase mb-1">Swift code</p>
                <p className="text-[#1a1a1a]">{paymentDetails.bankDetails.swiftCode}</p>
              </div>
            )}
            {paymentDetails.bankDetails.accountNumber && (
              <div>
                <p className="text-xs font-semibold text-[#666666] uppercase mb-1">Account #</p>
                <p className="text-[#1a1a1a]">{paymentDetails.bankDetails.accountNumber}</p>
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
        <h1 className="text-5xl font-bold text-[#1a1a1a]">Invoice</h1>
        <p className="text-xl text-[#333333]">N° {invoiceData.invoiceNumber}</p>
      </div>

      {/* Summary and Billing Info */}
      <div className="grid grid-cols-3 gap-8 mb-16">
        {/* Left - Payment Summary */}
        <div>
          <p className="text-sm text-[#4a4a4a] mb-2">Payable <span className="font-semibold text-[#1a1a1a]">{currencySymbol}{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
          <p className="text-sm text-[#666666] mb-1">Dues {invoiceData.dueDate || 'N/A'}</p>
          <p className="text-sm text-[#666666] mb-1">Issued {invoiceData.date}</p>
          <p className="text-sm text-[#666666]">Ref. #{invoiceData.invoiceNumber}</p>
        </div>

        {/* Middle - Billed To */}
        <div>
          <p className="text-sm font-semibold text-[#1a1a1a] mb-2">Billed to</p>
          <p className="text-sm text-[#1a1a1a] font-medium mb-1">{invoiceData.toCompany || 'Company Name'}</p>
          <p className="text-sm text-[#666666] leading-relaxed whitespace-pre-line">{invoiceData.toAddress || 'Company address\nCity, Country - 00000'}</p>
        </div>

        {/* Right - From */}
        <div>
          <p className="text-sm font-semibold text-[#1a1a1a] mb-2">From</p>
          <p className="text-sm text-[#1a1a1a] font-medium mb-1">{invoiceData.fromCompany?.split('\n')[0] || 'Panda, Inc'}</p>
          <p className="text-sm text-[#666666] leading-relaxed whitespace-pre-line">{invoiceData.fromAddress || 'Business address\nCity, State, IN - 000 000'}</p>
        </div>
      </div>

      {/* Line Items with Pink Border */}
      <div className="relative mb-16">
        {/* Pink Left Border */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#e91e63]"></div>

        <div className="pl-8">
          {/* Service Title */}
          <h3 className="text-xl font-semibold text-[#1a1a1a] mb-8">{invoiceData.notes || 'Responsive web design'}</h3>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 pb-3 border-b border-[#d0d0d0] mb-4">
            <div className="col-span-6">
              <p className="text-xs font-medium text-[#666666] uppercase">Item Description</p>
            </div>
            <div className="col-span-2 text-center">
              <p className="text-xs font-medium text-[#666666] uppercase">Qty</p>
            </div>
            <div className="col-span-2 text-right">
              <p className="text-xs font-medium text-[#666666] uppercase">Rate</p>
            </div>
            <div className="col-span-2 text-right">
              <p className="text-xs font-medium text-[#666666] uppercase">Amount</p>
            </div>
          </div>

          {/* Table Items */}
          <div className="space-y-4 mb-6">
            {invoiceData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <p className="text-sm text-[#1a1a1a]">{item.description}</p>
                </div>
                <div className="col-span-2 text-center">
                  <p className="text-sm text-[#1a1a1a]">{item.quantity}</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-sm text-[#1a1a1a]">{currencySymbol}{item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-sm text-[#1a1a1a]">{currencySymbol}{(item.quantity * item.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-6">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-sm">
                <p className="text-[#4a4a4a]">Subtotal</p>
                <p className="text-[#1a1a1a]">{currencySymbol}{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#4a4a4a]">Tax ({taxRate}%)</p>
                <p className="text-[#1a1a1a]">{currencySymbol}{taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#d0d0d0]">
                <p className="font-semibold text-[#1a1a1a]">Total (USD)</p>
                <p className="font-bold text-2xl text-[#e91e63]">{currencySymbol}{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-16 pt-8 border-t border-[#d0d0d0]">
        {/* Left - Payment Details */}
        <div>
          <p className="text-sm font-semibold text-[#1a1a1a] mb-4">Payment details</p>
          <p className="text-xs text-[#666666] mb-6">Please pay within 15 days of receiving this invoice.</p>

          {paymentDetails.method === 'bank' && paymentDetails.bankDetails && (
            <div className="space-y-2 text-sm">
              {paymentDetails.bankDetails.bankName && (
                <div className="flex justify-between">
                  <span className="text-[#4a4a4a]">Bank name</span>
                  <span className="text-[#1a1a1a]">{paymentDetails.bankDetails.bankName}</span>
                </div>
              )}
              {paymentDetails.bankDetails.swiftCode && (
                <div className="flex justify-between">
                  <span className="text-[#4a4a4a]">IFS code</span>
                  <span className="text-[#1a1a1a]">{paymentDetails.bankDetails.swiftCode?.split('XXX')[0] || paymentDetails.bankDetails.swiftCode}</span>
                </div>
              )}
              {paymentDetails.bankDetails.swiftCode && (
                <div className="flex justify-between">
                  <span className="text-[#4a4a4a]">Swift code</span>
                  <span className="text-[#1a1a1a]">{paymentDetails.bankDetails.swiftCode}</span>
                </div>
              )}
              {paymentDetails.bankDetails.accountNumber && (
                <div className="flex justify-between">
                  <span className="text-[#4a4a4a]">Account #</span>
                  <span className="text-[#1a1a1a]">{paymentDetails.bankDetails.accountNumber}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right - Thank You */}
        <div className="text-right">
          <p className="text-sm font-semibold text-[#1a1a1a] mb-4">Thanks for the business.</p>
          <div className="text-xs text-[#666666] space-y-1">
            <p>{fromEmail}</p>
            <p>{fromPhone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CompactPandaTemplate({ invoiceData, paymentDetails: _paymentDetails }: TemplateProps) {
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
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-1">INVOICE</h1>
          <p className="text-sm text-[#4a4a4a]">#{invoiceData.invoiceNumber}</p>
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
          <p className="text-xs text-[#666666] uppercase mb-1">Issued</p>
          <p className="text-sm text-[#1a1a1a]">{invoiceData.date}</p>
        </div>

        {/* Due */}
        <div>
          <p className="text-xs text-[#666666] uppercase mb-1">Due</p>
          <p className="text-sm text-[#1a1a1a]">{invoiceData.dueDate || 'N/A'}</p>
        </div>

        <div></div>
      </div>

      {/* Billed To and From */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        {/* Billed To */}
        <div>
          <p className="text-xs font-semibold text-[#1a1a1a] uppercase mb-2">Billed to</p>
          <p className="text-sm font-medium text-[#1a1a1a] mb-1">{invoiceData.toCompany || 'Company Name'}</p>
          <p className="text-xs text-[#4a4a4a] leading-relaxed whitespace-pre-line">{invoiceData.toAddress || 'Company address\nCity, Country - 00000'}</p>
        </div>

        {/* From */}
        <div className="col-span-2">
          <p className="text-xs font-semibold text-[#1a1a1a] uppercase mb-2">From</p>
          <p className="text-sm font-medium text-[#1a1a1a] mb-1">{invoiceData.fromCompany?.split('\n')[0] || 'Panda, Inc'}</p>
          <p className="text-xs text-[#4a4a4a] leading-relaxed whitespace-pre-line">{invoiceData.fromAddress || 'Business address\nCity, State, IN - 000 000'}</p>
        </div>
      </div>

      {/* Service Title */}
      <h3 className="text-lg font-semibold text-[#1a1a1a] mb-8">{invoiceData.notes || 'Digital product design'}</h3>

      {/* Line Items Table */}
      <div className="mb-12">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 pb-3 border-b border-[#b0b0b0] mb-4">
          <div className="col-span-6">
            <p className="text-xs font-medium text-[#666666] uppercase">Service</p>
          </div>
          <div className="col-span-2 text-center">
            <p className="text-xs font-medium text-[#666666] uppercase">Qty</p>
          </div>
          <div className="col-span-2 text-right">
            <p className="text-xs font-medium text-[#666666] uppercase">Rate</p>
          </div>
          <div className="col-span-2 text-right">
            <p className="text-xs font-medium text-[#666666] uppercase">Line Total</p>
          </div>
        </div>

        {/* Table Items */}
        <div className="space-y-6">
          {invoiceData.items.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-12 gap-4 mb-1">
                <div className="col-span-6">
                  <p className="text-sm font-medium text-[#1a1a1a]">{item.description}</p>
                </div>
                <div className="col-span-2 text-center">
                  <p className="text-sm text-[#1a1a1a]">{item.quantity}</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-sm text-[#1a1a1a]">{currencySymbol}{item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-sm font-medium text-[#1a1a1a]">{currencySymbol}{(item.quantity * item.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>
              <div className="col-span-6">
                <p className="text-xs text-[#666666]">Description • Hours log ↗</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80 space-y-3">
          <div className="flex justify-between text-sm pb-3 border-b border-[#b0b0b0]">
            <p className="text-[#4a4a4a]">Subtotal</p>
            <p className="text-[#1a1a1a]">{currencySymbol}{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="flex justify-between text-sm pb-3 border-b border-[#b0b0b0]">
            <p className="text-[#4a4a4a]">Tax ({taxRate}%)</p>
            <p className="text-[#1a1a1a]">{currencySymbol}{taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="flex justify-between text-sm pb-3 border-b border-[#b0b0b0]">
            <p className="font-medium text-[#1a1a1a]">Total</p>
            <p className="font-medium text-[#1a1a1a]">{currencySymbol}{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* Amount Due - Purple Borders */}
      <div className="flex justify-end mb-16">
        <div className="border-t-2 border-b-2 py-4 px-6 w-80" style={{ backgroundColor: '#ffffff', borderColor: '#7c3aed' }}>
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-[#1a1a1a]">Amount due</p>
            <p className="text-2xl font-bold" style={{ color: '#7c3aed' }}>{invoiceData.currency || 'US$'} {total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* Thank You Message */}
      <div className="mb-8">
        <p className="text-sm text-[#1a1a1a] font-medium">Thank you for the business!</p>
        <div className="flex items-start gap-2 text-xs text-[#666666] mt-2">
          <span>ℹ️</span>
          <p>Please pay within 15 days of receiving this invoice.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-8 border-t border-[#b0b0b0]">
        <div className="flex justify-between text-xs text-[#4a4a4a]">
          <p>{invoiceData.fromCompany?.split('\n')[0] || 'Digital Product Designer, IN'}</p>
          <p>+91 00000 00000</p>
          <p>hello@email.com</p>
        </div>
      </div>
    </div>
  );
}
