import { useState, FormEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useCreateCustomerMutation } from '@/services/api.service';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CreateCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomerCreated?: (customerId: string) => void;
}

export const CreateCustomerDialog = ({ open, onOpenChange, onCustomerCreated }: CreateCustomerDialogProps) => {
  const [createCustomer, { isLoading }] = useCreateCustomerMutation();

  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    taxId: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    preferredPaymentMethod: '',
    walletAddress: '',
    invoiceSettings: {
      prefix: '',
      nextNumber: '',
    },
    notes: '',
  });

  const [errors, setErrors] = useState({
    company: '',
    email: '',
  });

  const [expandedSections, setExpandedSections] = useState({
    address: false,
    payment: false,
    invoiceSettings: false,
    notes: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const validateField = (field: string, value: string) => {
    let error = '';

    if (field === 'company') {
      if (!value.trim()) {
        error = 'Company name is required';
      }
    } else if (field === 'email') {
      if (!value.trim()) {
        error = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Invalid email format';
      }
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handleInvoiceSettingsChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      invoiceSettings: { ...prev.invoiceSettings, [field]: value },
    }));
  };

  const handleBlur = (field: string) => {
    const value = formData[field as keyof typeof formData];
    if (typeof value === 'string') {
      validateField(field, value);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    const isCompanyValid = validateField('company', formData.company);
    const isEmailValid = validateField('email', formData.email);

    if (!isCompanyValid || !isEmailValid) {
      return;
    }

    try {
      const customerData = {
        name: formData.name || formData.company,
        company: formData.company,
        email: formData.email.toLowerCase(),
        phone: formData.phone || undefined,
        taxId: formData.taxId || undefined,
        address: formData.address.street ? formData.address : undefined,
        preferredPaymentMethod: formData.preferredPaymentMethod || undefined,
        walletAddress: formData.walletAddress || undefined,
        invoiceSettings: (formData.invoiceSettings.prefix || formData.invoiceSettings.nextNumber) ? {
          prefix: formData.invoiceSettings.prefix || undefined,
          nextNumber: formData.invoiceSettings.nextNumber ? parseInt(formData.invoiceSettings.nextNumber) : undefined,
        } : undefined,
        notes: formData.notes || undefined,
      };

      const response = await createCustomer(customerData).unwrap();
      toast.success('Customer created successfully');

      // Reset form
      setFormData({
        company: '',
        name: '',
        email: '',
        phone: '',
        taxId: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
        },
        preferredPaymentMethod: '',
        walletAddress: '',
        invoiceSettings: {
          prefix: '',
          nextNumber: '',
        },
        notes: '',
      });
      setErrors({ company: '', email: '' });
      setExpandedSections({ address: false, payment: false, invoiceSettings: false, notes: false });

      // Call callback with new customer ID (handle both _id and id)
      const customerId = (response as any)?._id || (response as any)?.id;
      if (onCustomerCreated && customerId) {
        onCustomerCreated(customerId);
      }

      onOpenChange(false);
    } catch (error: any) {
      console.error('Create customer error:', error);
      toast.error(error?.data?.message || 'Failed to create customer');
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          // Reset sections when closing
          setExpandedSections({ address: false, payment: false, invoiceSettings: false, notes: false });
        }
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[550px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create new customer</DialogTitle>
          <DialogDescription>
            Add a customer to your organization to start sending invoices
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-140px)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Basic information</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                    Company name <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="company"
                    placeholder="Acme Corporation"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    onBlur={() => handleBlur('company')}
                    className={`mt-1.5 h-9 ${errors.company ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    autoFocus
                  />
                  {errors.company && (
                    <p className="text-xs text-red-600 mt-1">{errors.company}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Contact name
                    </Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="mt-1.5 h-9"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="contact@acme.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      className={`mt-1.5 h-9 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="mt-1.5 h-9"
                    />
                  </div>

                  <div>
                    <Label htmlFor="taxId" className="text-sm font-medium text-gray-700">
                      Tax ID / VAT
                    </Label>
                    <Input
                      id="taxId"
                      placeholder="XX-XXXXXXX"
                      value={formData.taxId}
                      onChange={(e) => handleInputChange('taxId', e.target.value)}
                      className="mt-1.5 h-9"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Address - Collapsible */}
            <div className="border border-gray-200 rounded-lg">
              <button
                type="button"
                onClick={() => toggleSection('address')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">Billing address</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Optional</span>
                </div>
                {expandedSections.address ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {expandedSections.address && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="space-y-3 pt-3">
                <div>
                  <Label htmlFor="street" className="text-sm font-medium text-gray-700">
                    Street address
                  </Label>
                  <Input
                    id="street"
                    placeholder="123 Main Street"
                    value={formData.address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    className="mt-1.5 h-9"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                      City
                    </Label>
                    <Input
                      id="city"
                      placeholder="San Francisco"
                      value={formData.address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="mt-1.5 h-9"
                    />
                  </div>

                  <div>
                    <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                      State / Province
                    </Label>
                    <Input
                      id="state"
                      placeholder="California"
                      value={formData.address.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      className="mt-1.5 h-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">
                      ZIP / Postal code
                    </Label>
                    <Input
                      id="zipCode"
                      placeholder="94103"
                      value={formData.address.zipCode}
                      onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                      className="mt-1.5 h-9"
                    />
                  </div>

                  <div>
                    <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                      Country
                    </Label>
                    <Select value={formData.address.country} onValueChange={(value) => handleAddressChange('country', value)}>
                      <SelectTrigger className="mt-1.5 h-9">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                        <SelectItem value="IN">India</SelectItem>
                        <SelectItem value="DE">Germany</SelectItem>
                        <SelectItem value="FR">France</SelectItem>
                        <SelectItem value="SG">Singapore</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
                </div>
              )}
            </div>

            {/* Payment Preferences - Collapsible */}
            <div className="border border-gray-200 rounded-lg">
              <button
                type="button"
                onClick={() => toggleSection('payment')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">Payment preferences</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Optional</span>
                </div>
                {expandedSections.payment ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {expandedSections.payment && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="space-y-3 pt-3">
                <div>
                  <Label htmlFor="paymentMethod" className="text-sm font-medium text-gray-700">
                    Preferred payment method
                  </Label>
                  <Select
                    value={formData.preferredPaymentMethod}
                    onValueChange={(value) => handleInputChange('preferredPaymentMethod', value)}
                  >
                    <SelectTrigger className="mt-1.5 h-9">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Preference</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="digital_currency">Digital Currency</SelectItem>
                      <SelectItem value="wire_transfer">Wire Transfer</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="ach">ACH</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.preferredPaymentMethod === 'digital_currency' && (
                  <div>
                    <Label htmlFor="walletAddress" className="text-sm font-medium text-gray-700">
                      Wallet address
                    </Label>
                    <Input
                      id="walletAddress"
                      placeholder="0x..."
                      value={formData.walletAddress}
                      onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                      className="mt-1.5 h-9 font-mono text-xs"
                    />
                    <p className="text-xs text-gray-500 mt-1">For digital currency payments</p>
                  </div>
                )}
              </div>
                </div>
              )}
            </div>

            {/* Invoice Settings - Collapsible */}
            <div className="border border-gray-200 rounded-lg">
              <button
                type="button"
                onClick={() => toggleSection('invoiceSettings')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">Invoice settings</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Optional</span>
                </div>
                {expandedSections.invoiceSettings ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {expandedSections.invoiceSettings && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="space-y-3 pt-3">
                    <div>
                      <Label htmlFor="invoicePrefix" className="text-sm font-medium text-gray-700">
                        Invoice prefix
                      </Label>
                      <Input
                        id="invoicePrefix"
                        placeholder="ACME"
                        value={formData.invoiceSettings.prefix}
                        onChange={(e) => handleInvoiceSettingsChange('prefix', e.target.value.toUpperCase())}
                        className="mt-1.5 h-9 uppercase"
                        maxLength={10}
                      />
                      <p className="text-xs text-gray-500 mt-1">Custom prefix for invoices (e.g., ACME-001)</p>
                    </div>

                    <div>
                      <Label htmlFor="invoiceNextNumber" className="text-sm font-medium text-gray-700">
                        Starting invoice number
                      </Label>
                      <Input
                        id="invoiceNextNumber"
                        type="number"
                        placeholder="1"
                        min="1"
                        value={formData.invoiceSettings.nextNumber}
                        onChange={(e) => handleInvoiceSettingsChange('nextNumber', e.target.value)}
                        className="mt-1.5 h-9"
                      />
                      <p className="text-xs text-gray-500 mt-1">The next invoice number for this customer</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Information - Collapsible */}
            <div className="border border-gray-200 rounded-lg">
              <button
                type="button"
                onClick={() => toggleSection('notes')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">Additional information</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Optional</span>
                </div>
                {expandedSections.notes ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {expandedSections.notes && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                <div>
                <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                  Internal notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this customer..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="mt-1.5 min-h-[80px] resize-none text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Private notes (not visible to customer)</p>
              </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-9 bg-[#635BFF] hover:bg-[#5045e5]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create customer'
                )}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
