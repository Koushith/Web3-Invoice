import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, ArrowLeft, Loader2, Printer, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import {
  StandardTemplate,
  ModernTemplate,
  MinimalTemplate,
  ArtisticTemplate,
  GradientTemplate,
  GlassTemplate,
  ElegantTemplate,
} from '@/components/invoice/InvoiceTemplates';
import { useGetCustomersQuery, useCreateInvoiceMutation, useGetOrganizationQuery } from '@/services/api.service';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';
import { useReactToPrint } from 'react-to-print';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Currency } from '@/types/models';

export type InvoiceStyle = 'standard' | 'modern' | 'minimal' | 'artistic' | 'gradient' | 'glass' | 'elegant';

export interface InvoiceStyleProps {
  logo: string | null;
  invoiceData: InvoiceData;
  paymentDetails: PaymentDetails;
}

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

export const NewInvoice = () => {
  const navigate = useNavigate();
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [logo] = useState<string | null>(null);
  const [invoiceStyle, setInvoiceStyle] = useState<InvoiceStyle>('standard');
  const [previewZoom, setPreviewZoom] = useState(0.8);
  const [currency, setCurrency] = useState('USD');
  const [customCurrency, setCustomCurrency] = useState('');
  const [showCustomCurrency, setShowCustomCurrency] = useState(false);
  const [currencyType, setCurrencyType] = useState<'fiat' | 'crypto'>('fiat');
  const [showBillingDetails, setShowBillingDetails] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);
  const [invoicePrefix, setInvoicePrefix] = useState('INV');
  const [taxRate, setTaxRate] = useState(0);
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    fromCompany: '',
    fromAddress: '',
    fromEmail: '',
    fromPhone: '',
    fromTaxId: '',
    toCompany: '',
    toAddress: '',
    toEmail: '',
    toPhone: '',
    toTaxId: '',
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
    cryptoDetails: {
      currency: '',
      network: '',
      walletAddress: '',
    },
    otherDetails: '',
  });

  const printRef = useRef<HTMLDivElement>(null);

  // Wait for Firebase auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthReady(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch customers
  const { data: customersData } = useGetCustomersQuery({ page: 1, limit: 100 }, { skip: !isAuthReady });
  const customers = customersData?.data || [];

  // Fetch organization data
  const { data: organization } = useGetOrganizationQuery(undefined, {
    skip: !isAuthReady,
  });

  // Sync payment method with currency type
  useEffect(() => {
    if (currencyType === 'crypto') {
      setPaymentDetails((prev) => ({ ...prev, method: 'crypto' }));
    } else if (currencyType === 'fiat') {
      setPaymentDetails((prev) => ({ ...prev, method: 'bank' }));
    }
  }, [currencyType]);

  // Pre-populate from fields with organization data
  useEffect(() => {
    if (organization) {
      setInvoiceData((prev) => ({
        ...prev,
        fromCompany: organization.name || '',
        fromEmail: organization.email || '',
        fromPhone: organization.phone || '',
        fromTaxId: organization.taxId || '',
        fromAddress: organization.address
          ? [
              organization.address.street,
              [organization.address.city, organization.address.state, organization.address.postalCode]
                .filter(Boolean)
                .join(', '),
              organization.address.country,
            ]
              .filter(Boolean)
              .join('\n')
          : '',
      }));

      // Set invoice prefix from organization settings
      if (organization.settings?.invoicePrefix) {
        setInvoicePrefix(organization.settings.invoicePrefix);
      }

      // Set default currency from organization settings
      if (organization.settings?.defaultCurrency) {
        setCurrency(organization.settings.defaultCurrency);
      }
    }
  }, [organization]);

  // Create invoice mutation
  const [createInvoice, { isLoading: isCreating }] = useCreateInvoiceMutation();

  // Update customer details when customer is selected
  useEffect(() => {
    if (selectedCustomerId) {
      const customer = customers.find((c: any) => (c._id || c.id) === selectedCustomerId);
      if (customer) {
        setInvoiceData((prev) => ({
          ...prev,
          toCompany: customer.company || customer.name,
          toEmail: customer.email || '',
          toPhone: customer.phone || '',
          toTaxId: customer.taxId || '',
          toAddress: customer.address?.street
            ? `${customer.address.street}\n${customer.address.city}, ${customer.address.state} ${customer.address.postalCode}\n${customer.address.country}`
            : '',
        }));
      }
    }
  }, [selectedCustomerId, customers]);

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', quantity: 1, price: 0 }],
    });
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
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
  });

  const handleDownload = async () => {
    if (!printRef.current) return;

    try {
      const imgData = await toPng(printRef.current, {
        quality: 1.0,
        pixelRatio: 2,
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const imgHeight = (printRef.current.offsetHeight * imgWidth) / printRef.current.offsetWidth;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`invoice-${invoiceData.invoiceNumber || 'draft'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleCreateInvoice = async () => {
    // Validation
    if (!selectedCustomerId) {
      toast.error('Please select a customer');
      return;
    }

    if (!invoiceData.invoiceNumber?.trim()) {
      toast.error('Please enter an invoice number');
      return;
    }

    if (!invoiceData.date) {
      toast.error('Please select an invoice date');
      return;
    }

    // Filter out completely empty items (rows that were never filled)
    const validItems = invoiceData.items.filter((item) => item.description?.trim());

    if (validItems.length === 0) {
      toast.error('Please add at least one line item');
      return;
    }

    // Validate the items that have descriptions
    const invalidQuantity = validItems.filter((item) => item.quantity <= 0);
    if (invalidQuantity.length > 0) {
      toast.error('Item quantities must be greater than 0');
      return;
    }

    const invalidPrice = validItems.filter((item) => item.price < 0);
    if (invalidPrice.length > 0) {
      toast.error('Item prices cannot be negative');
      return;
    }

    try {
      // Build full invoice number with prefix
      const fullInvoiceNumber = `${invoicePrefix}-${invoiceData.invoiceNumber}`;

      // Get currency - use custom if entered, otherwise selected currency
      const finalCurrency = showCustomCurrency && customCurrency ? customCurrency : currency;

      const invoicePayload: any = {
        customerId: selectedCustomerId,
        invoiceNumber: fullInvoiceNumber,
        issueDate: invoiceData.date,
        currency: finalCurrency as Currency,
        lineItems: validItems.map((item) => ({
          description: item.description.trim(),
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        taxRate: taxRate,
      };

      // Only add optional fields if they have values
      if (invoiceData.dueDate?.trim()) {
        invoicePayload.dueDate = invoiceData.dueDate;
      }
      if (invoiceData.notes?.trim()) {
        invoicePayload.notes = invoiceData.notes;
      }
      if (invoiceData.terms?.trim()) {
        invoicePayload.terms = invoiceData.terms;
      }

      await createInvoice(invoicePayload).unwrap();
      toast.success('Invoice created successfully');
      navigate('/invoices');
    } catch (error: any) {
      console.error('Create invoice error:', error);
      toast.error(error?.data?.message || 'Failed to create invoice');
    }
  };

  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[1800px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => navigate('/invoices')}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 active:scale-95 transition-transform"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h1 className="text-sm md:text-base font-medium text-gray-900">Create invoice</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => navigate('/invoices')}
                className="h-9 px-3 md:px-4 text-xs md:text-sm hidden sm:flex"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateInvoice}
                disabled={isCreating || !selectedCustomerId}
                className="h-9 px-3 md:px-4 text-xs md:text-sm bg-[#635BFF] hover:bg-[#5046E5] active:scale-95 transition-transform"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span className="hidden sm:inline">Creating...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Create invoice</span>
                    <span className="sm:hidden">Create</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-4 md:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-[600px_1fr] gap-4 md:gap-10">
          {/* Left Side - Form */}
          <div className="space-y-3 md:space-y-4">
            {/* Customer Section */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 md:p-5 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900">Customer</h2>
              </div>
              <div className="p-4 md:p-5">
                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Find or add a customer..." />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer: any) => (
                      <SelectItem key={customer._id || customer.id} value={customer._id || customer.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{customer.company || customer.name}</span>
                          <span className="text-xs text-gray-500">{customer.email}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Invoice Details - Combined */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 md:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {/* Invoice Number */}
                  <div>
                    <Label className="text-xs text-gray-600 mb-1.5 block">Invoice #</Label>
                    <div className="flex gap-1.5">
                      <Input
                        placeholder="INV"
                        value={invoicePrefix}
                        onChange={(e) => setInvoicePrefix(e.target.value.toUpperCase())}
                        className="h-9 w-20 text-sm"
                      />
                      <span className="flex items-center text-gray-300">-</span>
                      <Input
                        placeholder="001"
                        value={invoiceData.invoiceNumber}
                        onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                        className="h-9 flex-1 text-sm"
                      />
                    </div>
                  </div>

                  {/* Issue Date */}
                  <div>
                    <Label className="text-xs text-gray-600 mb-1.5 block">Issue date</Label>
                    <Input
                      type="date"
                      value={invoiceData.date}
                      onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
                      className="h-9 text-sm"
                    />
                  </div>

                  {/* Currency Type */}
                  <div>
                    <Label className="text-xs text-gray-600 mb-1.5 block">Invoice currency</Label>
                    <div className="flex gap-1.5 mb-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrencyType('fiat');
                          setCurrency('USD');
                          setShowCustomCurrency(false);
                        }}
                        className={`flex-1 h-8 rounded text-xs font-medium transition-colors ${
                          currencyType === 'fiat'
                            ? 'bg-[#635BFF] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Fiat
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrencyType('crypto');
                          setCurrency('BTC');
                          setShowCustomCurrency(false);
                        }}
                        className={`flex-1 h-8 rounded text-xs font-medium transition-colors ${
                          currencyType === 'crypto'
                            ? 'bg-[#635BFF] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Crypto
                      </button>
                    </div>
                    {!showCustomCurrency ? (
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencyType === 'fiat' ? (
                            <>
                              <SelectItem value="USD">USD - US Dollar</SelectItem>
                              <SelectItem value="EUR">EUR - Euro</SelectItem>
                              <SelectItem value="GBP">GBP - Pound</SelectItem>
                              <SelectItem value="INR">INR - Rupee</SelectItem>
                              <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                              <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                              <SelectItem value="JPY">JPY - Yen</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="BTC">BTC - Bitcoin</SelectItem>
                              <SelectItem value="ETH">ETH - Ethereum</SelectItem>
                              <SelectItem value="USDT">USDT - Tether</SelectItem>
                              <SelectItem value="USDC">USDC - USD Coin</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        placeholder="Enter code"
                        value={customCurrency}
                        onChange={(e) => {
                          setCustomCurrency(e.target.value.toUpperCase());
                          setCurrency(e.target.value.toUpperCase());
                        }}
                        className="h-9 text-sm"
                      />
                    )}
                    <p className="text-[11px] text-gray-500 mt-1">Currency for invoice amounts</p>
                  </div>

                  {/* Due Date */}
                  <div>
                    <Label className="text-xs text-gray-600 mb-1.5 block">Due date <span className="text-gray-400 text-[10px]">(optional)</span></Label>
                    <Input
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                {/* Tax Rate - Full Width */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Label className="text-xs text-gray-600 mb-1.5 block">Tax rate (%)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    step="0.01"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="h-9 text-sm w-32"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Enter 18 for 18% GST/VAT</p>
                </div>
              </div>
            </div>

            {/* Billing Information - Collapsible */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <button
                type="button"
                onClick={() => setShowBillingDetails(!showBillingDetails)}
                className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-gray-900">Billing information</h2>
                    <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Auto-filled</span>
                  </div>
                  {!showBillingDetails && (
                    <p className="text-xs text-gray-600 mt-1">
                      {invoiceData.fromCompany || 'Your Organization'} → {invoiceData.toCompany || 'Customer'}
                    </p>
                  )}
                </div>
                {showBillingDetails ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {showBillingDetails && (
                <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
                    {/* From */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">From</h3>
                      <Input
                        placeholder="Company name"
                        value={invoiceData.fromCompany}
                        onChange={(e) => setInvoiceData({ ...invoiceData, fromCompany: e.target.value })}
                        className="h-9 text-sm"
                      />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={invoiceData.fromEmail}
                        onChange={(e) => setInvoiceData({ ...invoiceData, fromEmail: e.target.value })}
                        className="h-9 text-sm"
                      />
                      <Input
                        placeholder="Phone"
                        value={invoiceData.fromPhone}
                        onChange={(e) => setInvoiceData({ ...invoiceData, fromPhone: e.target.value })}
                        className="h-9 text-sm"
                      />
                      <Input
                        placeholder="Tax ID / GST"
                        value={invoiceData.fromTaxId}
                        onChange={(e) => setInvoiceData({ ...invoiceData, fromTaxId: e.target.value })}
                        className="h-9 text-sm"
                      />
                      <Textarea
                        placeholder="Address"
                        value={invoiceData.fromAddress}
                        onChange={(e) => setInvoiceData({ ...invoiceData, fromAddress: e.target.value })}
                        className="min-h-[60px] resize-none text-sm"
                      />
                    </div>

                    {/* Bill To */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Bill To</h3>
                      <Input
                        placeholder="Customer / Company name"
                        value={invoiceData.toCompany}
                        onChange={(e) => setInvoiceData({ ...invoiceData, toCompany: e.target.value })}
                        className="h-9 text-sm"
                      />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={invoiceData.toEmail}
                        onChange={(e) => setInvoiceData({ ...invoiceData, toEmail: e.target.value })}
                        className="h-9 text-sm"
                      />
                      <Input
                        placeholder="Phone"
                        value={invoiceData.toPhone}
                        onChange={(e) => setInvoiceData({ ...invoiceData, toPhone: e.target.value })}
                        className="h-9 text-sm"
                      />
                      <Input
                        placeholder="Tax ID / GST"
                        value={invoiceData.toTaxId}
                        onChange={(e) => setInvoiceData({ ...invoiceData, toTaxId: e.target.value })}
                        className="h-9 text-sm"
                      />
                      <Textarea
                        placeholder="Billing address"
                        value={invoiceData.toAddress}
                        onChange={(e) => setInvoiceData({ ...invoiceData, toAddress: e.target.value })}
                        className="min-h-[60px] resize-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Items Section */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 md:p-5 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900">Line items</h2>
              </div>
              <div className="p-4 md:p-5">
                <div className="space-y-3">
                  {invoiceData.items.map((item, index) => {
                    const hasEmptyDescription = !item.description?.trim();
                    const hasInvalidQuantity = item.quantity <= 0;
                    const hasInvalidPrice = item.price < 0;

                    return (
                      <div key={index} className="border border-gray-200 rounded-md p-3 md:p-4">
                        <div className="space-y-3">
                          <Input
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => {
                              const newItems = [...invoiceData.items];
                              newItems[index].description = e.target.value;
                              setInvoiceData({ ...invoiceData, items: newItems });
                            }}
                            className={cn(
                              'h-10',
                              hasEmptyDescription && item.description !== '' ? 'border-red-300' : ''
                            )}
                          />
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div>
                              <Label className="text-xs text-gray-600 mb-1 block">Qty</Label>
                              <Input
                                type="number"
                                placeholder="1"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => {
                                  const newItems = [...invoiceData.items];
                                  newItems[index].quantity = Number(e.target.value);
                                  setInvoiceData({ ...invoiceData, items: newItems });
                                }}
                                className={cn('h-10', hasInvalidQuantity ? 'border-red-300' : '')}
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-gray-600 mb-1 block">Unit price</Label>
                              <Input
                                type="number"
                                placeholder="0.00"
                                value={item.price}
                                onChange={(e) => {
                                  const newItems = [...invoiceData.items];
                                  newItems[index].price = Number(e.target.value);
                                  setInvoiceData({ ...invoiceData, items: newItems });
                                }}
                                className={cn('h-10', hasInvalidPrice ? 'border-red-300' : '')}
                              />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                              <Label className="text-xs text-gray-600 mb-1 block">Amount</Label>
                              <div className="h-10 flex items-center">
                                <span className="text-sm font-medium text-gray-900">
                                  ${(item.quantity * item.price).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newItems = invoiceData.items.filter((_, i) => i !== index);
                              setInvoiceData({ ...invoiceData, items: newItems });
                            }}
                            className="h-8 px-3 text-xs text-gray-600 hover:text-red-600"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Button variant="outline" size="sm" onClick={addItem} className="mt-3 h-9 w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add item
                </Button>

                {/* Total */}
                {invoiceData.items.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total</span>
                        <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Collection - Collapsible */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <button
                type="button"
                onClick={() => setShowPaymentDetails(!showPaymentDetails)}
                className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-gray-900">Payment details</h2>
                    <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Optional</span>
                  </div>
                  {!showPaymentDetails && (
                    <p className="text-xs text-gray-600 mt-1">
                      {paymentDetails.method === 'bank' ? 'Bank transfer' :
                       paymentDetails.method === 'crypto' ? 'Cryptocurrency' : 'Other'}
                    </p>
                  )}
                </div>
                {showPaymentDetails ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {showPaymentDetails && (
                <div className="px-5 pb-5 border-t border-gray-100">
                  <div className="space-y-4 mt-4">
                    {currencyType === 'fiat' ? (
                      <div>
                        <Label className="text-xs text-gray-600 mb-1.5 block">Payment method</Label>
                        <Select
                          value={paymentDetails.method}
                          onValueChange={(value: PaymentMethod) => setPaymentDetails({ ...paymentDetails, method: value })}
                        >
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bank">Bank transfer</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-[11px] text-gray-500 mt-1">How customers can pay this invoice</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs text-gray-600 mb-2">Payment method: <span className="font-medium">Cryptocurrency</span></p>
                        <p className="text-[11px] text-gray-500">Auto-selected based on invoice currency</p>
                      </div>
                    )}

                    {/* Bank Details */}
                    {paymentDetails.method === 'bank' && (
                      <div className="space-y-3">
                        <Input
                          placeholder="Bank name"
                          value={paymentDetails.bankDetails?.bankName}
                          onChange={(e) =>
                            setPaymentDetails({
                              ...paymentDetails,
                              bankDetails: { ...paymentDetails.bankDetails, bankName: e.target.value },
                            })
                          }
                          className="h-9 text-sm"
                        />
                        <Input
                          placeholder="Account name"
                          value={paymentDetails.bankDetails?.accountName}
                          onChange={(e) =>
                            setPaymentDetails({
                              ...paymentDetails,
                              bankDetails: { ...paymentDetails.bankDetails, accountName: e.target.value },
                            })
                          }
                          className="h-9 text-sm"
                        />
                        <Input
                          placeholder="Account number"
                          value={paymentDetails.bankDetails?.accountNumber}
                          onChange={(e) =>
                            setPaymentDetails({
                              ...paymentDetails,
                              bankDetails: { ...paymentDetails.bankDetails, accountNumber: e.target.value },
                            })
                          }
                          className="h-9 text-sm"
                        />
                        <Input
                          placeholder="SWIFT/BIC (optional)"
                          value={paymentDetails.bankDetails?.swiftCode}
                          onChange={(e) =>
                            setPaymentDetails({
                              ...paymentDetails,
                              bankDetails: { ...paymentDetails.bankDetails, swiftCode: e.target.value },
                            })
                          }
                          className="h-9 text-sm"
                        />
                      </div>
                    )}

                    {/* Crypto Details */}
                    {paymentDetails.method === 'crypto' && (
                      <div className="space-y-3">
                        <Select
                          value={paymentDetails.cryptoDetails?.currency}
                          onValueChange={(value) =>
                            setPaymentDetails({
                              ...paymentDetails,
                              cryptoDetails: { ...paymentDetails.cryptoDetails, currency: value },
                            })
                          }
                        >
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                            <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                            <SelectItem value="USDT">Tether (USDT)</SelectItem>
                            <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={paymentDetails.cryptoDetails?.network}
                          onValueChange={(value) =>
                            setPaymentDetails({
                              ...paymentDetails,
                              cryptoDetails: { ...paymentDetails.cryptoDetails, network: value },
                            })
                          }
                        >
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Select chain" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ethereum">Ethereum</SelectItem>
                            <SelectItem value="Polygon">Polygon</SelectItem>
                            <SelectItem value="BSC">Binance Smart Chain</SelectItem>
                            <SelectItem value="Arbitrum">Arbitrum</SelectItem>
                            <SelectItem value="Optimism">Optimism</SelectItem>
                            <SelectItem value="Base">Base</SelectItem>
                            <SelectItem value="Solana">Solana</SelectItem>
                            <SelectItem value="Bitcoin">Bitcoin</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Wallet address"
                          value={paymentDetails.cryptoDetails?.walletAddress}
                          onChange={(e) =>
                            setPaymentDetails({
                              ...paymentDetails,
                              cryptoDetails: { ...paymentDetails.cryptoDetails, walletAddress: e.target.value },
                            })
                          }
                          className="h-9 font-mono text-xs"
                        />
                      </div>
                    )}

                    {/* Other Payment Details */}
                    {paymentDetails.method === 'other' && (
                      <div>
                        <Textarea
                          placeholder="Enter payment instructions..."
                          value={paymentDetails.otherDetails}
                          onChange={(e) =>
                            setPaymentDetails({
                              ...paymentDetails,
                              otherDetails: e.target.value,
                            })
                          }
                          className="min-h-[80px] resize-none text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Options - Collapsible */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <button
                type="button"
                onClick={() => setShowAdditionalOptions(!showAdditionalOptions)}
                className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-gray-900">Additional options</h2>
                    <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Optional</span>
                  </div>
                  {!showAdditionalOptions && invoiceData.notes && (
                    <p className="text-xs text-gray-600 mt-1 truncate">
                      {invoiceData.notes}
                    </p>
                  )}
                </div>
                {showAdditionalOptions ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {showAdditionalOptions && (
                <div className="px-5 pb-5 border-t border-gray-100">
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="notes" className="text-xs text-gray-600 mb-1.5 block">
                        Memo
                      </Label>
                      <Textarea
                        id="notes"
                        value={invoiceData.notes}
                        onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                        placeholder="Add a note to the invoice..."
                        className="min-h-[80px] resize-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Preview */}
          <div
            className="bg-white border border-gray-200 rounded-lg sticky top-8"
            style={{ height: 'calc(100vh - 120px)' }}
          >
            <div className="flex flex-col h-full">
              {/* Preview Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Preview</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-gray-600">Template:</Label>
                      <Select value={invoiceStyle} onValueChange={(value) => setInvoiceStyle(value as InvoiceStyle)}>
                        <SelectTrigger className="h-8 w-[140px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="modern">Modern</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="artistic">Artistic</SelectItem>
                          <SelectItem value="gradient">Professional</SelectItem>
                          <SelectItem value="glass">Executive</SelectItem>
                          <SelectItem value="elegant">Classic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewZoom(Math.max(0.4, previewZoom - 0.1))}
                        className="h-8 w-8 p-0 text-xs"
                        disabled={previewZoom <= 0.4}
                      >
                        <span className="text-lg">−</span>
                      </Button>
                      <span className="text-xs text-gray-600 w-12 text-center">{Math.round(previewZoom * 100)}%</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewZoom(Math.min(1.0, previewZoom + 0.1))}
                        className="h-8 w-8 p-0 text-xs"
                        disabled={previewZoom >= 1.0}
                      >
                        <span className="text-lg">+</span>
                      </Button>
                    </div>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <Button variant="ghost" size="sm" onClick={() => handlePrint()} className="h-8 px-2 text-xs">
                      <Printer className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleDownload} className="h-8 px-2 text-xs">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-gray-200">
                  <button className="pb-2 px-1 text-xs font-medium text-[#635BFF] border-b-2 border-[#635BFF]">
                    Invoice PDF
                  </button>
                  <button className="pb-2 px-1 text-xs text-gray-500 hover:text-gray-900">Email</button>
                  <button className="pb-2 px-1 text-xs text-gray-500 hover:text-gray-900">Hosted Invoice Page</button>
                </div>
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-auto bg-gray-50 p-8">
                <div className="flex justify-center">
                  <div
                    ref={printRef}
                    className="bg-white invoice-preview shadow-sm"
                    style={{
                      width: '210mm',
                      minHeight: '297mm',
                      transform: `scale(${previewZoom})`,
                      transformOrigin: 'top center',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    {invoiceStyle === 'standard' && (
                      <StandardTemplate
                        logo={logo}
                        invoiceData={{
                          ...invoiceData,
                          invoiceNumber: `${invoicePrefix}-${invoiceData.invoiceNumber || '001'}`,
                          currency: showCustomCurrency && customCurrency ? customCurrency : currency,
                        }}
                        paymentDetails={paymentDetails}
                      />
                    )}
                    {invoiceStyle === 'modern' && (
                      <ModernTemplate
                        logo={logo}
                        invoiceData={{
                          ...invoiceData,
                          invoiceNumber: `${invoicePrefix}-${invoiceData.invoiceNumber || '001'}`,
                          currency: showCustomCurrency && customCurrency ? customCurrency : currency,
                        }}
                        paymentDetails={paymentDetails}
                      />
                    )}
                    {invoiceStyle === 'minimal' && (
                      <MinimalTemplate
                        logo={logo}
                        invoiceData={{
                          ...invoiceData,
                          invoiceNumber: `${invoicePrefix}-${invoiceData.invoiceNumber || '001'}`,
                          currency: showCustomCurrency && customCurrency ? customCurrency : currency,
                        }}
                        paymentDetails={paymentDetails}
                      />
                    )}
                    {invoiceStyle === 'artistic' && (
                      <ArtisticTemplate
                        logo={logo}
                        invoiceData={{
                          ...invoiceData,
                          invoiceNumber: `${invoicePrefix}-${invoiceData.invoiceNumber || '001'}`,
                          currency: showCustomCurrency && customCurrency ? customCurrency : currency,
                        }}
                        paymentDetails={paymentDetails}
                      />
                    )}
                    {invoiceStyle === 'gradient' && (
                      <GradientTemplate
                        logo={logo}
                        invoiceData={{
                          ...invoiceData,
                          invoiceNumber: `${invoicePrefix}-${invoiceData.invoiceNumber || '001'}`,
                          currency: showCustomCurrency && customCurrency ? customCurrency : currency,
                        }}
                        paymentDetails={paymentDetails}
                      />
                    )}
                    {invoiceStyle === 'glass' && (
                      <GlassTemplate
                        logo={logo}
                        invoiceData={{
                          ...invoiceData,
                          invoiceNumber: `${invoicePrefix}-${invoiceData.invoiceNumber || '001'}`,
                          currency: showCustomCurrency && customCurrency ? customCurrency : currency,
                        }}
                        paymentDetails={paymentDetails}
                      />
                    )}
                    {invoiceStyle === 'elegant' && (
                      <ElegantTemplate
                        logo={logo}
                        invoiceData={{
                          ...invoiceData,
                          invoiceNumber: `${invoicePrefix}-${invoiceData.invoiceNumber || '001'}`,
                          currency: showCustomCurrency && customCurrency ? customCurrency : currency,
                        }}
                        paymentDetails={paymentDetails}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button className="text-xs text-[#635BFF] hover:underline flex items-center gap-1">
                  <span>?</span>
                  <span>Change how this page looks in branding.</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
