import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ImagePlus, Trash2, Plus, Download, Printer, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QRCode } from 'react-qr-code';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

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

// Update the styles
const cardStyles = 'border-border/40 shadow-sm'; // Subtle border
const previewCardStyles = 'bg-white shadow-sm border-border/40 print:shadow-none'; // Cleaner preview background

export const NewInvoice = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    date: '',
    dueDate: '',
    fromCompany: '',
    fromAddress: '',
    toCompany: '',
    toAddress: '',
    items: [] as InvoiceItem[],
    notes: '',
    terms: '',
  });
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    method: 'bank',
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      swiftCode: '',
    },
  });

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        html, body {
          height: 100%;
          margin: 0 !important;
          padding: 0 !important;
        }
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
    onBeforeGetContent: () => {
      return Promise.resolve();
    },
    onPrintError: (error) => {
      console.error('Print failed:', error);
    },
  });

  const handleDownload = async () => {
    if (!printRef.current) return;

    try {
      // Convert the preview div to a PNG image
      const imgData = await toPng(printRef.current, {
        quality: 1.0,
        pixelRatio: 2,
      });

      // Create PDF with A4 dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Calculate dimensions to fit A4
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (printRef.current.offsetHeight * imgWidth) / printRef.current.offsetWidth;

      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Download the PDF
      pdf.save(`invoice-${invoiceData.invoiceNumber || 'draft'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to print dialog if PDF generation fails
      handlePrint();
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', quantity: 1, price: 0 }],
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Form */}
        <Card className={cn('p-6 space-y-6', cardStyles)}>
          <h2 className="text-2xl font-semibold">Create New Invoice</h2>

          {/* Logo Upload */}
          <div className="flex items-center gap-4">
            <input accept="image/*" className="hidden" id="logo-upload" type="file" onChange={handleLogoUpload} />
            <Label
              htmlFor="logo-upload"
              className={cn('flex items-center gap-2 cursor-pointer', 'border rounded-md px-4 py-2 hover:bg-accent')}
            >
              <ImagePlus className="h-4 w-4" />
              {logo ? 'Change Logo' : 'Add Logo'}
            </Label>
            {logo && (
              <Button variant="ghost" size="icon" onClick={() => setLogo(null)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoice-number">Invoice Number</Label>
              <Input
                id="invoice-number"
                value={invoiceData.invoiceNumber}
                onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={invoiceData.date}
                onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
              />
            </div>
          </div>

          <Separator />

          {/* From Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">From</h3>
            <div className="space-y-2">
              <Label htmlFor="from-company">Your Company</Label>
              <Input
                id="from-company"
                value={invoiceData.fromCompany}
                onChange={(e) => setInvoiceData({ ...invoiceData, fromCompany: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="from-address">Your Address</Label>
              <Textarea
                id="from-address"
                value={invoiceData.fromAddress}
                onChange={(e) => setInvoiceData({ ...invoiceData, fromAddress: e.target.value })}
              />
            </div>
          </div>

          <Separator />

          {/* To Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Bill To</h3>
            <div className="space-y-2">
              <Label htmlFor="to-company">Client Company</Label>
              <Input
                id="to-company"
                value={invoiceData.toCompany}
                onChange={(e) => setInvoiceData({ ...invoiceData, toCompany: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to-address">Client Address</Label>
              <Textarea
                id="to-address"
                value={invoiceData.toAddress}
                onChange={(e) => setInvoiceData({ ...invoiceData, toAddress: e.target.value })}
              />
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Items</h3>
            {invoiceData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-start">
                <div className="col-span-6">
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => {
                      const newItems = [...invoiceData.items];
                      newItems[index].description = e.target.value;
                      setInvoiceData({ ...invoiceData, items: newItems });
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...invoiceData.items];
                      newItems[index].quantity = Number(e.target.value);
                      setInvoiceData({ ...invoiceData, items: newItems });
                    }}
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => {
                      const newItems = [...invoiceData.items];
                      newItems[index].price = Number(e.target.value);
                      setInvoiceData({ ...invoiceData, items: newItems });
                    }}
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newItems = invoiceData.items.filter((_, i) => i !== index);
                      setInvoiceData({ ...invoiceData, items: newItems });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addItem} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Item
            </Button>
          </div>

          <Separator />

          {/* Payment Details Section - Add this before Notes & Terms */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment Details</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <RadioGroup
                  defaultValue={paymentDetails.method}
                  onValueChange={(value: PaymentMethod) => setPaymentDetails({ method: value })}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank">Bank Transfer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="crypto" id="crypto" />
                    <Label htmlFor="crypto">Cryptocurrency</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>

              {paymentDetails.method === 'bank' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Account Name</Label>
                    <Input
                      value={paymentDetails.bankDetails?.accountName}
                      onChange={(e) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          bankDetails: {
                            ...paymentDetails.bankDetails,
                            accountName: e.target.value,
                          },
                        })
                      }
                      placeholder="Enter account name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Number</Label>
                    <Input
                      value={paymentDetails.bankDetails?.accountNumber}
                      onChange={(e) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          bankDetails: {
                            ...paymentDetails.bankDetails,
                            accountNumber: e.target.value,
                          },
                        })
                      }
                      placeholder="Enter account number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bank Name</Label>
                    <Input
                      value={paymentDetails.bankDetails?.bankName}
                      onChange={(e) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          bankDetails: {
                            ...paymentDetails.bankDetails,
                            bankName: e.target.value,
                          },
                        })
                      }
                      placeholder="Enter bank name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SWIFT/BIC (Optional)</Label>
                    <Input
                      value={paymentDetails.bankDetails?.swiftCode}
                      onChange={(e) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          bankDetails: {
                            ...paymentDetails.bankDetails,
                            swiftCode: e.target.value,
                          },
                        })
                      }
                      placeholder="Enter SWIFT/BIC code"
                    />
                  </div>
                </div>
              )}

              {paymentDetails.method === 'crypto' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Cryptocurrency</Label>
                      <Select
                        value={paymentDetails.cryptoDetails?.currency}
                        onValueChange={(value) =>
                          setPaymentDetails({
                            ...paymentDetails,
                            cryptoDetails: {
                              ...paymentDetails.cryptoDetails,
                              currency: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select cryptocurrency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                          <SelectItem value="USDT">Tether (USDT)</SelectItem>
                          <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Network (Optional)</Label>
                      <Input
                        value={paymentDetails.cryptoDetails?.network}
                        onChange={(e) =>
                          setPaymentDetails({
                            ...paymentDetails,
                            cryptoDetails: {
                              ...paymentDetails.cryptoDetails,
                              network: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g., ERC20, TRC20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Wallet Address</Label>
                    <Input
                      value={paymentDetails.cryptoDetails?.walletAddress}
                      onChange={(e) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          cryptoDetails: {
                            ...paymentDetails.cryptoDetails,
                            walletAddress: e.target.value,
                          },
                        })
                      }
                      placeholder="Enter wallet address"
                    />
                  </div>
                </div>
              )}

              {paymentDetails.method === 'other' && (
                <div className="space-y-2">
                  <Label>Payment Instructions</Label>
                  <Textarea
                    value={paymentDetails.otherDetails}
                    onChange={(e) =>
                      setPaymentDetails({
                        ...paymentDetails,
                        otherDetails: e.target.value,
                      })
                    }
                    placeholder="Enter payment instructions..."
                    rows={4}
                  />
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Notes & Terms */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="terms">Terms & Conditions</Label>
              <Textarea
                id="terms"
                value={invoiceData.terms}
                onChange={(e) => setInvoiceData({ ...invoiceData, terms: e.target.value })}
              />
            </div>
          </div>

          <Button className="w-full">Create Invoice</Button>
        </Card>

        {/* Right Side - Preview */}
        <div className="space-y-4">
          {/* Preview Actions */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Preview</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handlePrint}>
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </Card>

          {/* Preview Content */}
          <Card className={cn('p-0 bg-white print:shadow-none', previewCardStyles)}>
            <div ref={printRef} className="aspect-[1/1.4142] bg-white mx-auto w-full max-w-[210mm]">
              {/* Existing preview content */}
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
                      <p className="text-sm text-muted-foreground mt-1">#{invoiceData.invoiceNumber || '000000'}</p>
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
                      <p className="font-semibold text-gray-900">{invoiceData.fromCompany || 'Your Company Name'}</p>
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {invoiceData.fromAddress || 'Your Address'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">Bill To</p>
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">{invoiceData.toCompany || 'Client Company Name'}</p>
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {invoiceData.toAddress || 'Client Address'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Memo if present */}
                {invoiceData.memo && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Memo</p>
                    <p className="text-sm text-gray-600">{invoiceData.memo}</p>
                  </div>
                )}

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
                          <td className="py-4 text-sm">{item.description || 'Item description'}</td>
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

                {/* Add this before Notes & Terms in the preview */}
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

                  {paymentDetails.method === 'crypto' && paymentDetails.cryptoDetails && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Cryptocurrency</p>
                          <p className="font-medium">{paymentDetails.cryptoDetails.currency}</p>
                        </div>
                        {paymentDetails.cryptoDetails.network && (
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Network</p>
                            <p className="font-medium">{paymentDetails.cryptoDetails.network}</p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Wallet Address</p>
                        <p className="font-medium font-mono text-sm break-all">
                          {paymentDetails.cryptoDetails.walletAddress}
                        </p>
                        {paymentDetails.cryptoDetails.walletAddress && (
                          <div className="mt-2 bg-white p-2 inline-block rounded-lg">
                            <QRCode
                              value={paymentDetails.cryptoDetails.walletAddress}
                              size={120}
                              level="M"
                              className="h-32 w-32"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {paymentDetails.method === 'other' && paymentDetails.otherDetails && (
                    <p className="text-sm whitespace-pre-line">{paymentDetails.otherDetails}</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
