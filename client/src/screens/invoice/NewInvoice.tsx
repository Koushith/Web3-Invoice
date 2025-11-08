import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ImagePlus, Trash2, Plus, Download, Printer, Eye, ArrowLeft, FileText, Building2, DollarSign, CreditCard, MessageSquare, Type } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QRCode } from 'react-qr-code';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useReactToPrint } from 'react-to-print';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';
import { StandardTemplate, ModernTemplate, MinimalTemplate, ArtisticTemplate } from '@/components/invoice/InvoiceTemplates';

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

type PaymentMethod = 'bank' | 'crypto' | 'other';

interface BankDetails {
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  swiftCode?: string;
}

interface CryptoDetails {
  currency?: string;
  network?: string;
  walletAddress?: string;
}

interface PaymentDetails {
  method: PaymentMethod;
  bankDetails?: BankDetails;
  cryptoDetails?: CryptoDetails;
  otherDetails?: string;
}

export type InvoiceStyle = 'standard' | 'modern' | 'minimal' | 'artistic';

export interface InvoiceStyleProps {
  logo: string | null;
  invoiceData: InvoiceData;
  paymentDetails: PaymentDetails;
}

export const NewInvoice = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const [invoiceFont, setInvoiceFont] = useState<string>('default');
  const [invoiceStyle, setInvoiceStyle] = useState<InvoiceStyle>('standard');
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

  const getFontFamily = () => {
    switch (invoiceFont) {
      case 'apercu':
        return "'Apercu Mono Pro', monospace";
      case 'default':
      default:
        return 'inherit';
    }
  };

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

  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/invoices')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Invoices
          </button>
          <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Create New Invoice</h1>
          <p className="text-sm text-gray-500 mt-2">Fill in the details to generate a professional invoice</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Form */}
          <div className="space-y-6">
            {/* Logo Upload Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                  <ImagePlus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Company Logo</h2>
                  <p className="text-sm text-gray-500">Add your brand identity</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <input accept="image/*" className="hidden" id="logo-upload" type="file" onChange={handleLogoUpload} />
                <Label
                  htmlFor="logo-upload"
                  className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  <ImagePlus className="h-4 w-4" />
                  {logo ? 'Change Logo' : 'Add Logo'}
                </Label>
                {logo && (
                  <Button variant="outline" size="sm" onClick={() => setLogo(null)} className="text-red-600 hover:bg-red-50 border-red-200">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
              {logo && (
                <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <img src={logo} alt="Company Logo" className="max-h-20 object-contain" />
                </div>
              )}
            </div>

            {/* Invoice Details Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Invoice Details</h2>
                  <p className="text-sm text-gray-500">Basic invoice information</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="invoice-number" className="text-sm font-semibold text-gray-700 mb-2 block">Invoice Number</Label>
                  <Input
                    id="invoice-number"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                    className="h-11 border-gray-300 rounded-lg"
                    placeholder="INV-0001"
                  />
                </div>
                <div>
                  <Label htmlFor="date" className="text-sm font-semibold text-gray-700 mb-2 block">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={invoiceData.date}
                    onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
                    className="h-11 border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Company Details Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-50 to-violet-50 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Company Details</h2>
                  <p className="text-sm text-gray-500">From and Bill To information</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* From Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">From (Your Company)</h3>
                  <div className="space-y-3">
                    <Input
                      id="from-company"
                      value={invoiceData.fromCompany}
                      onChange={(e) => setInvoiceData({ ...invoiceData, fromCompany: e.target.value })}
                      placeholder="Your Company Name"
                      className="h-11 border-gray-300 rounded-lg"
                    />
                    <Textarea
                      id="from-address"
                      value={invoiceData.fromAddress}
                      onChange={(e) => setInvoiceData({ ...invoiceData, fromAddress: e.target.value })}
                      placeholder="Your Company Address"
                      className="min-h-[80px] border-gray-300 rounded-lg resize-none"
                    />
                  </div>
                </div>

                <Separator />

                {/* To Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Bill To (Client)</h3>
                  <div className="space-y-3">
                    <Input
                      id="to-company"
                      value={invoiceData.toCompany}
                      onChange={(e) => setInvoiceData({ ...invoiceData, toCompany: e.target.value })}
                      placeholder="Client Company Name"
                      className="h-11 border-gray-300 rounded-lg"
                    />
                    <Textarea
                      id="to-address"
                      value={invoiceData.toAddress}
                      onChange={(e) => setInvoiceData({ ...invoiceData, toAddress: e.target.value })}
                      placeholder="Client Address"
                      className="min-h-[80px] border-gray-300 rounded-lg resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Line Items</h2>
                    <p className="text-sm text-gray-500">Add products or services</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={addItem}
                  className="h-9 px-4 border-gray-300 rounded-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-3">
                {invoiceData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="col-span-5">
                      <Input
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => {
                          const newItems = [...invoiceData.items];
                          newItems[index].description = e.target.value;
                          setInvoiceData({ ...invoiceData, items: newItems });
                        }}
                        className="h-10 border-gray-300 rounded-lg"
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
                        className="h-10 border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Price"
                        value={item.price}
                        onChange={(e) => {
                          const newItems = [...invoiceData.items];
                          newItems[index].price = Number(e.target.value);
                          setInvoiceData({ ...invoiceData, items: newItems });
                        }}
                        className="h-10 border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-sm font-semibold text-gray-900">
                        ${(item.quantity * item.price).toFixed(2)}
                      </span>
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newItems = invoiceData.items.filter((_, i) => i !== index);
                          setInvoiceData({ ...invoiceData, items: newItems });
                        }}
                        className="h-10 w-10 p-0 border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      ${invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-base font-bold pt-2 border-t border-gray-200">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">
                      ${invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Payment Details</h2>
                  <p className="text-sm text-gray-500">How customer should pay</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-3 block">Payment Method</Label>
                  <RadioGroup
                    defaultValue={paymentDetails.method}
                    onValueChange={(value: PaymentMethod) => setPaymentDetails({ method: value })}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank" className="cursor-pointer">Bank Transfer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="crypto" id="crypto" />
                      <Label htmlFor="crypto" className="cursor-pointer">Cryptocurrency</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other" className="cursor-pointer">Other</Label>
                    </div>
                  </RadioGroup>
                </div>

                {paymentDetails.method === 'bank' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-2 block">Account Name</Label>
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
                        className="h-11 border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-2 block">Account Number</Label>
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
                        className="h-11 border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-2 block">Bank Name</Label>
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
                        className="h-11 border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-2 block">SWIFT/BIC (Optional)</Label>
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
                        className="h-11 border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {paymentDetails.method === 'crypto' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Cryptocurrency</Label>
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
                          <SelectTrigger className="h-11 border-gray-300 rounded-lg">
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
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Network (Optional)</Label>
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
                          className="h-11 border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-2 block">Wallet Address</Label>
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
                        className="h-11 border-gray-300 rounded-lg font-mono text-sm"
                      />
                    </div>
                  </div>
                )}

                {paymentDetails.method === 'other' && (
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Payment Instructions</Label>
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
                      className="border-gray-300 rounded-lg resize-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Notes & Terms Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Notes & Terms</h2>
                  <p className="text-sm text-gray-500">Additional information</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="notes" className="text-sm font-semibold text-gray-700 mb-2 block">Notes</Label>
                  <Textarea
                    id="notes"
                    value={invoiceData.notes}
                    onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                    placeholder="Add any additional notes..."
                    className="min-h-[100px] border-gray-300 rounded-lg resize-none"
                  />
                </div>
                <div>
                  <Label htmlFor="terms" className="text-sm font-semibold text-gray-700 mb-2 block">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    value={invoiceData.terms}
                    onChange={(e) => setInvoiceData({ ...invoiceData, terms: e.target.value })}
                    placeholder="Add terms and conditions..."
                    className="min-h-[100px] border-gray-300 rounded-lg resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => navigate('/invoices')}
                className="h-11 px-6 border-gray-300 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" className="h-11 px-6 border-gray-300 hover:bg-gray-50 rounded-lg">
                  Save Draft
                </Button>
                <Button className="h-11 px-8 bg-gradient-to-r from-[#635bff] to-[#5045e5] hover:from-[#5045e5] hover:to-[#3d38d1] text-white rounded-lg font-semibold shadow-lg shadow-[#635bff]/20">
                  Create Invoice
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side - Preview */}
          <div className="space-y-6">
            {/* Preview Actions */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Invoice Preview</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Live preview of your invoice</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-3 border-gray-300 rounded-lg"
                    onClick={handlePrint}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-3 border-gray-300 rounded-lg"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>

              {/* Template Selector */}
              <div className="pt-4 border-t border-gray-200">
                <Label className="text-sm font-semibold text-gray-700 mb-3 block">Template Style</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setInvoiceStyle('standard')}
                    className={cn(
                      'p-3 rounded-lg border-2 transition-all text-left',
                      invoiceStyle === 'standard'
                        ? 'border-[#635bff] bg-[#635bff]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className="font-semibold text-sm text-gray-900">Standard</div>
                    <div className="text-xs text-gray-500 mt-0.5">Classic & professional</div>
                  </button>
                  <button
                    onClick={() => setInvoiceStyle('modern')}
                    className={cn(
                      'p-3 rounded-lg border-2 transition-all text-left',
                      invoiceStyle === 'modern'
                        ? 'border-[#635bff] bg-[#635bff]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className="font-semibold text-sm text-gray-900">Modern</div>
                    <div className="text-xs text-gray-500 mt-0.5">Bold & colorful</div>
                  </button>
                  <button
                    onClick={() => setInvoiceStyle('minimal')}
                    className={cn(
                      'p-3 rounded-lg border-2 transition-all text-left',
                      invoiceStyle === 'minimal'
                        ? 'border-[#635bff] bg-[#635bff]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className="font-semibold text-sm text-gray-900">Minimal</div>
                    <div className="text-xs text-gray-500 mt-0.5">Clean & simple</div>
                  </button>
                  <button
                    onClick={() => setInvoiceStyle('artistic')}
                    className={cn(
                      'p-3 rounded-lg border-2 transition-all text-left',
                      invoiceStyle === 'artistic'
                        ? 'border-[#635bff] bg-[#635bff]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className="font-semibold text-sm text-gray-900">Artistic</div>
                    <div className="text-xs text-gray-500 mt-0.5">Creative & unique</div>
                  </button>
                </div>
              </div>

              {/* Font Selector */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200 mt-4">
                <Type className="h-4 w-4 text-gray-500" />
                <Label className="text-sm font-medium text-gray-700">Font</Label>
                <Select value={invoiceFont} onValueChange={setInvoiceFont}>
                  <SelectTrigger className="h-9 w-[180px] border-gray-300 rounded-lg">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">System Default</SelectItem>
                    <SelectItem value="apercu">Apercu Mono Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Preview Content */}
            <div className="bg-white border border-gray-200/60 rounded-xl shadow-sm overflow-hidden print:shadow-none">
              <div ref={printRef} className="aspect-[1/1.4142] bg-white mx-auto w-full max-w-[210mm]" style={{ fontFamily: getFontFamily() }}>
                {invoiceStyle === 'standard' && (
                  <StandardTemplate logo={logo} invoiceData={invoiceData} paymentDetails={paymentDetails} />
                )}
                {invoiceStyle === 'modern' && (
                  <ModernTemplate logo={logo} invoiceData={invoiceData} paymentDetails={paymentDetails} />
                )}
                {invoiceStyle === 'minimal' && (
                  <MinimalTemplate logo={logo} invoiceData={invoiceData} paymentDetails={paymentDetails} />
                )}
                {invoiceStyle === 'artistic' && (
                  <ArtisticTemplate logo={logo} invoiceData={invoiceData} paymentDetails={paymentDetails} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
