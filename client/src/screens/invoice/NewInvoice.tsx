import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, ArrowLeft, Loader2, Printer, Download, ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { StandardTemplate, ModernTemplate, MinimalTemplate, ArtisticTemplate } from '@/components/invoice/InvoiceTemplates';
import { useGetCustomersQuery, useCreateInvoiceMutation, useGetOrganizationQuery } from '@/services/api.service';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';
import { useReactToPrint } from 'react-to-print';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Currency } from '@/types/models';

export type InvoiceStyle = 'standard' | 'modern' | 'minimal' | 'artistic';

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
  const [logo, setLogo] = useState<string | null>(null);
  const [invoiceStyle, setInvoiceStyle] = useState<InvoiceStyle>('standard');
  const [showFromSection, setShowFromSection] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
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
  const { data: customersData } = useGetCustomersQuery(
    { page: 1, limit: 100 },
    { skip: !isAuthReady }
  );
  const customers = customersData?.data || [];

  // Fetch organization data
  const { data: organization } = useGetOrganizationQuery(undefined, {
    skip: !isAuthReady,
  });

  // Pre-populate from fields with organization data
  useEffect(() => {
    if (organization) {
      setInvoiceData((prev) => ({
        ...prev,
        fromCompany: organization.name || '',
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

      // Set organization logo as default
      if (organization.logo && !logo) {
        setLogo(organization.logo);
      }
    }
  }, [organization]);

  // Function to restore organization details
  const restoreOrganizationDetails = () => {
    if (organization) {
      setInvoiceData((prev) => ({
        ...prev,
        fromCompany: organization.name || '',
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
      if (organization.logo) {
        setLogo(organization.logo);
      }
      toast.success('Organization details restored');
    }
  };

  // Create invoice mutation
  const [createInvoice, { isLoading: isCreating }] = useCreateInvoiceMutation();

  // Update customer details when customer is selected
  useEffect(() => {
    if (selectedCustomerId) {
      const customer = customers.find((c: any) => (c._id || c.id) === selectedCustomerId);
      if (customer) {
        setInvoiceData(prev => ({
          ...prev,
          toCompany: customer.company || customer.name,
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
    const validItems = invoiceData.items.filter(item => item.description?.trim());

    if (validItems.length === 0) {
      toast.error('Please add at least one line item');
      return;
    }

    // Validate the items that have descriptions
    const invalidQuantity = validItems.filter(item => item.quantity <= 0);
    if (invalidQuantity.length > 0) {
      toast.error('Item quantities must be greater than 0');
      return;
    }

    const invalidPrice = validItems.filter(item => item.price < 0);
    if (invalidPrice.length > 0) {
      toast.error('Item prices cannot be negative');
      return;
    }

    try {
      const invoicePayload = {
        customerId: selectedCustomerId,
        issueDate: invoiceData.date,
        dueDate: invoiceData.dueDate || undefined,
        currency: Currency.USD,
        items: validItems.map(item => ({
          description: item.description.trim(),
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        taxRate: 0,
        notes: invoiceData.notes || undefined,
        terms: invoiceData.terms || undefined,
      };

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
      <div className="border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="py-8">
            <button
              onClick={() => navigate('/invoices')}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Invoices
            </button>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-gray-900">Create invoice</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Create a new invoice for your customer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Form */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 h-fit">
            {/* Logo Upload */}
            <div>
              <Label className="text-sm font-medium text-gray-900 mb-2 block">Logo (optional)</Label>
              <div className="flex items-center gap-3">
                <input
                  accept="image/*"
                  className="hidden"
                  id="logo-upload"
                  type="file"
                  onChange={handleLogoUpload}
                />
                <Label
                  htmlFor="logo-upload"
                  className="cursor-pointer border border-gray-300 rounded-md px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <ImagePlus className="h-4 w-4" />
                  {logo ? 'Change' : 'Upload'}
                </Label>
                {logo && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLogo(null)}
                      className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <img src={logo} alt="Logo" className="h-10 object-contain" />
                  </>
                )}
              </div>
            </div>

            {/* Customer Section */}
            <div>
              <Label htmlFor="customer" className="text-sm font-medium text-gray-900 mb-2 block">
                Customer
              </Label>
              <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                <SelectTrigger className="h-9 border-gray-300 rounded-md">
                  <SelectValue placeholder="Find or add a customer..." />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer: any) => (
                    <SelectItem key={customer._id || customer.id} value={customer._id || customer.id}>
                      {customer.company || customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* From Details (Collapsible) */}
            <div className="border border-gray-200 rounded-lg">
              <button
                type="button"
                onClick={() => setShowFromSection(!showFromSection)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors rounded-t-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">From (Your Business)</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {showFromSection ? 'Click to hide' : 'Auto-filled from organization • Click to edit'}
                  </p>
                </div>
                <div className="text-gray-400">
                  {showFromSection ? '−' : '+'}
                </div>
              </button>

              {showFromSection && (
                <div className="px-4 pb-4 space-y-4 border-t border-gray-200">
                  <div className="flex justify-end pt-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={restoreOrganizationDetails}
                      className="h-7 px-3 text-xs"
                    >
                      Use Organization Details
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="fromCompany" className="text-sm font-medium text-gray-900 mb-2 block">
                      Company name
                    </Label>
                    <Input
                      id="fromCompany"
                      value={invoiceData.fromCompany}
                      onChange={(e) => setInvoiceData({ ...invoiceData, fromCompany: e.target.value })}
                      className="h-9 border-gray-300 rounded-md"
                      placeholder="Your company name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fromAddress" className="text-sm font-medium text-gray-900 mb-2 block">
                      Address
                    </Label>
                    <Textarea
                      id="fromAddress"
                      value={invoiceData.fromAddress}
                      onChange={(e) => setInvoiceData({ ...invoiceData, fromAddress: e.target.value })}
                      className="border-gray-300 rounded-md resize-none"
                      rows={3}
                      placeholder="Street address&#10;City, State ZIP&#10;Country"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Invoice Details */}
            <div>
              <Label htmlFor="invoiceNumber" className="text-sm font-medium text-gray-900 mb-2 block">
                Invoice number *
              </Label>
              <Input
                id="invoiceNumber"
                placeholder="INV-001"
                value={invoiceData.invoiceNumber}
                onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                className="h-9 border-gray-300 rounded-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="text-sm font-medium text-gray-900 mb-2 block">
                  Invoice date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={invoiceData.date}
                  onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
                  className="h-9 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <Label htmlFor="dueDate" className="text-sm font-medium text-gray-900 mb-2 block">
                  Due date
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                  className="h-9 border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Items Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium text-gray-900">Items</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  className="h-7 px-2 text-xs border-gray-300 rounded-md"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add item
                </Button>
              </div>

              <div className="space-y-2">
                {invoiceData.items.map((item, index) => {
                  const hasEmptyDescription = !item.description?.trim();
                  const hasInvalidQuantity = item.quantity <= 0;
                  const hasInvalidPrice = item.price < 0;

                  return (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-6">
                        <Input
                          placeholder="Description *"
                          value={item.description}
                          onChange={(e) => {
                            const newItems = [...invoiceData.items];
                            newItems[index].description = e.target.value;
                            setInvoiceData({ ...invoiceData, items: newItems });
                          }}
                          className={cn(
                            "h-9 rounded-md text-sm",
                            hasEmptyDescription && item.description !== ''
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300"
                          )}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="Qty"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...invoiceData.items];
                            newItems[index].quantity = Number(e.target.value);
                            setInvoiceData({ ...invoiceData, items: newItems });
                          }}
                          className={cn(
                            "h-9 rounded-md text-sm",
                            hasInvalidQuantity
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300"
                          )}
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
                          className={cn(
                            "h-9 rounded-md text-sm",
                            hasInvalidPrice
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300"
                          )}
                        />
                      </div>
                      <div className="col-span-1 text-right">
                        <span className="text-sm text-gray-900">
                          ${(item.quantity * item.price).toFixed(2)}
                        </span>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newItems = invoiceData.items.filter((_, i) => i !== index);
                            setInvoiceData({ ...invoiceData, items: newItems });
                          }}
                          className="h-7 w-7 p-0 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {invoiceData.items.length === 0 && (
                <div className="text-center py-8 border border-dashed border-gray-300 rounded-md">
                  <p className="text-sm text-gray-500">No items added yet</p>
                </div>
              )}

              {/* Total */}
              {invoiceData.items.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                  <div className="w-48 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-base font-semibold pt-2 border-t border-gray-200">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="payment-method" className="text-sm font-medium text-gray-900 mb-2 block">
                  Payment method
                </Label>
                <Select
                  value={paymentDetails.method}
                  onValueChange={(value: PaymentMethod) => setPaymentDetails({ ...paymentDetails, method: value })}
                >
                  <SelectTrigger className="h-9 border-gray-300 rounded-md">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank transfer</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bank Details */}
              {paymentDetails.method === 'bank' && (
                <div className="space-y-3 pt-2">
                  <Input
                    placeholder="Bank name"
                    value={paymentDetails.bankDetails?.bankName}
                    onChange={(e) => setPaymentDetails({
                      ...paymentDetails,
                      bankDetails: { ...paymentDetails.bankDetails, bankName: e.target.value }
                    })}
                    className="h-9 border-gray-300 rounded-md text-sm"
                  />
                  <Input
                    placeholder="Account name"
                    value={paymentDetails.bankDetails?.accountName}
                    onChange={(e) => setPaymentDetails({
                      ...paymentDetails,
                      bankDetails: { ...paymentDetails.bankDetails, accountName: e.target.value }
                    })}
                    className="h-9 border-gray-300 rounded-md text-sm"
                  />
                  <Input
                    placeholder="Account number"
                    value={paymentDetails.bankDetails?.accountNumber}
                    onChange={(e) => setPaymentDetails({
                      ...paymentDetails,
                      bankDetails: { ...paymentDetails.bankDetails, accountNumber: e.target.value }
                    })}
                    className="h-9 border-gray-300 rounded-md text-sm"
                  />
                  <Input
                    placeholder="SWIFT/BIC (optional)"
                    value={paymentDetails.bankDetails?.swiftCode}
                    onChange={(e) => setPaymentDetails({
                      ...paymentDetails,
                      bankDetails: { ...paymentDetails.bankDetails, swiftCode: e.target.value }
                    })}
                    className="h-9 border-gray-300 rounded-md text-sm"
                  />
                </div>
              )}

              {/* Crypto Details */}
              {paymentDetails.method === 'crypto' && (
                <div className="space-y-3 pt-2">
                  <Select
                    value={paymentDetails.cryptoDetails?.currency}
                    onValueChange={(value) => setPaymentDetails({
                      ...paymentDetails,
                      cryptoDetails: { ...paymentDetails.cryptoDetails, currency: value }
                    })}
                  >
                    <SelectTrigger className="h-9 border-gray-300 rounded-md">
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
                    onValueChange={(value) => setPaymentDetails({
                      ...paymentDetails,
                      cryptoDetails: { ...paymentDetails.cryptoDetails, network: value }
                    })}
                  >
                    <SelectTrigger className="h-9 border-gray-300 rounded-md">
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
                    onChange={(e) => setPaymentDetails({
                      ...paymentDetails,
                      cryptoDetails: { ...paymentDetails.cryptoDetails, walletAddress: e.target.value }
                    })}
                    className="h-9 border-gray-300 rounded-md text-sm font-mono"
                  />
                </div>
              )}

              {/* Other Payment Details */}
              {paymentDetails.method === 'other' && (
                <div className="pt-2">
                  <Textarea
                    placeholder="Enter payment instructions..."
                    value={paymentDetails.otherDetails}
                    onChange={(e) => setPaymentDetails({
                      ...paymentDetails,
                      otherDetails: e.target.value
                    })}
                    className="min-h-[80px] border-gray-300 rounded-md resize-none text-sm"
                  />
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes" className="text-sm font-medium text-gray-900 mb-2 block">
                Memo (optional)
              </Label>
              <Textarea
                id="notes"
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                placeholder="Add a note to the invoice..."
                className="min-h-[80px] border-gray-300 rounded-md resize-none text-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => navigate('/invoices')}
                disabled={isCreating}
                className="h-9 px-4 text-sm border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateInvoice}
                disabled={isCreating}
                className="bg-[#635bff] hover:bg-[#0a2540] text-white text-sm font-medium px-4 h-9 rounded-md transition-colors"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create invoice'
                )}
              </Button>
            </div>
          </div>

          {/* Right Side - Preview */}
          <div className="space-y-6">
            {/* Template Selector */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Template</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setInvoiceStyle('standard')}
                  className={cn(
                    'p-3 rounded-md border-2 transition-all text-left',
                    invoiceStyle === 'standard'
                      ? 'border-[#635bff] bg-[#635bff]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="font-medium text-sm text-gray-900">Standard</div>
                  <div className="text-xs text-gray-500 mt-0.5">Classic</div>
                </button>
                <button
                  onClick={() => setInvoiceStyle('modern')}
                  className={cn(
                    'p-3 rounded-md border-2 transition-all text-left',
                    invoiceStyle === 'modern'
                      ? 'border-[#635bff] bg-[#635bff]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="font-medium text-sm text-gray-900">Modern</div>
                  <div className="text-xs text-gray-500 mt-0.5">Bold</div>
                </button>
                <button
                  onClick={() => setInvoiceStyle('minimal')}
                  className={cn(
                    'p-3 rounded-md border-2 transition-all text-left',
                    invoiceStyle === 'minimal'
                      ? 'border-[#635bff] bg-[#635bff]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="font-medium text-sm text-gray-900">Minimal</div>
                  <div className="text-xs text-gray-500 mt-0.5">Clean</div>
                </button>
                <button
                  onClick={() => setInvoiceStyle('artistic')}
                  className={cn(
                    'p-3 rounded-md border-2 transition-all text-left',
                    invoiceStyle === 'artistic'
                      ? 'border-[#635bff] bg-[#635bff]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="font-medium text-sm text-gray-900">Artistic</div>
                  <div className="text-xs text-gray-500 mt-0.5">Creative</div>
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">Preview</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePrint()}
                    className="h-8 px-3 text-xs border-gray-300 rounded-md"
                  >
                    <Printer className="h-3 w-3 mr-1.5" />
                    Print
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="h-8 px-3 text-xs border-gray-300 rounded-md"
                  >
                    <Download className="h-3 w-3 mr-1.5" />
                    PDF
                  </Button>
                </div>
              </div>
              <div className="border border-gray-200 rounded-md overflow-auto bg-gray-100 p-4">
                <div
                  ref={printRef}
                  className="bg-white invoice-preview mx-auto"
                  style={{
                    width: '210mm',
                    minHeight: '297mm',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transform: 'scale(0.6)',
                    transformOrigin: 'top center'
                  }}
                >
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
    </div>
  );
};
