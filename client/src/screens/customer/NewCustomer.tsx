import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCreateCustomerMutation } from '@/services/api.service';
import { toast } from 'sonner';

export const NewCustomerScreen = () => {
  const navigate = useNavigate();
  const [createCustomer, { isLoading }] = useCreateCustomerMutation();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    company: '',
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handleInvoiceSettingsChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      invoiceSettings: { ...prev.invoiceSettings, [field]: value },
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.company || !formData.email) {
      toast.error('Company name and email are required');
      return;
    }

    try {
      const customerData = {
        name: formData.name || formData.company, // Use company name if contact name not provided
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

      await createCustomer(customerData).unwrap();
      toast.success('Customer created successfully');
      navigate('/customers');
    } catch (error: any) {
      console.error('Create customer error:', error);
      toast.error(error?.data?.message || 'Failed to create customer');
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFFFE]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/customers')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Customers</span>
          </button>
        </div>

        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-[28px] font-semibold text-gray-900">Add new customer</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-sm text-gray-600">Create a customer profile to start sending invoices</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-gray-900">Basic information</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Primary contact details for this customer.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Company name <span className="text-red-600">*</span>
                </label>
                <Input
                  placeholder="Acme Corporation"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="h-8 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Contact name</label>
                  <Input
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Email address <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="contact@acme.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="h-8 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Phone number</label>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Tax ID / VAT number</label>
                  <Input
                    placeholder="XX-XXXXXXX"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Billing Address Section */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-gray-900">Billing address</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              The address where invoices will be sent.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Street address</label>
                <Input
                  placeholder="123 Main Street"
                  value={formData.address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">City</label>
                  <Input
                    placeholder="San Francisco"
                    value={formData.address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">State / Province</label>
                  <Input
                    placeholder="California"
                    value={formData.address.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">ZIP / Postal code</label>
                  <Input
                    placeholder="94103"
                    value={formData.address.zipCode}
                    onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Country</label>
                  <Select value={formData.address.country} onValueChange={(value) => handleAddressChange('country', value)}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                      <SelectItem value="IN">India</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Preferences Section */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-gray-900">Payment preferences</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Set the customer's preferred payment method.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Preferred payment method</label>
                <Select
                  value={formData.preferredPaymentMethod}
                  onValueChange={(value) => handleInputChange('preferredPaymentMethod', value)}
                >
                  <SelectTrigger className="h-8 text-sm">
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
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Payment address</label>
                  <Input
                    placeholder="Enter payment address"
                    value={formData.walletAddress}
                    onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                    className="h-8 text-sm font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">For digital currency payments</p>
                </div>
              )}
            </div>
          </div>

          {/* Invoice Settings Section */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-gray-900">Invoice settings</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Customize invoice numbering for this customer.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Invoice prefix</label>
                <Input
                  placeholder="ACME"
                  value={formData.invoiceSettings.prefix}
                  onChange={(e) => handleInvoiceSettingsChange('prefix', e.target.value.toUpperCase())}
                  className="h-8 text-sm uppercase"
                  maxLength={10}
                />
                <p className="text-xs text-gray-500 mt-1.5">Custom prefix for invoices (e.g., ACME-001)</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Starting invoice number</label>
                <Input
                  type="number"
                  placeholder="1"
                  min="1"
                  value={formData.invoiceSettings.nextNumber}
                  onChange={(e) => handleInvoiceSettingsChange('nextNumber', e.target.value)}
                  className="h-8 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1.5">The next invoice number for this customer</p>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-gray-900">Additional information</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Private notes about this customer.
            </p>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Internal notes</label>
              <Textarea
                placeholder="Add any notes about this customer..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="min-h-[100px] resize-none text-sm"
              />
              <p className="text-xs text-gray-500 mt-1.5">These notes are private and won't be visible to the customer</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/customers')}
              disabled={isLoading}
              className="h-8 px-4 text-sm border-gray-300 rounded-md"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-8 px-4 text-sm bg-[#635BFF] hover:bg-[#5045e5]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create customer'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
