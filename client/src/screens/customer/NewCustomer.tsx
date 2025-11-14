import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Building2, MapPin, CreditCard, Settings2, Loader2 } from 'lucide-react';
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
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/customers')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Customers
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add New Customer</h1>
          <p className="text-sm text-gray-600 mt-1">Create a customer profile to start sending invoices</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-5">
              <Building2 className="w-5 h-5 text-gray-700" />
              <h2 className="text-base font-semibold text-gray-900">Basic Information</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="company-name" className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Company Name *
                </Label>
                <Input
                  id="company-name"
                  placeholder="Acme Corporation"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="h-10"
                  required
                />
              </div>

              <div>
                <Label htmlFor="contact-name" className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Contact Name
                </Label>
                <Input
                  id="contact-name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="h-10"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@acme.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="h-10"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="h-10"
                />
              </div>

              <div>
                <Label htmlFor="tax-id" className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Tax ID / VAT Number
                </Label>
                <Input
                  id="tax-id"
                  placeholder="XX-XXXXXXX"
                  value={formData.taxId}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
                  className="h-10"
                />
              </div>
            </div>
          </div>

          {/* Billing Address Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-5">
              <MapPin className="w-5 h-5 text-gray-700" />
              <h2 className="text-base font-semibold text-gray-900">Billing Address</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="street" className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Street Address
                </Label>
                <Input
                  id="street"
                  placeholder="123 Main Street"
                  value={formData.address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  className="h-10"
                />
              </div>

              <div>
                <Label htmlFor="city" className="text-sm font-medium text-gray-700 mb-1.5 block">
                  City
                </Label>
                <Input
                  id="city"
                  placeholder="San Francisco"
                  value={formData.address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  className="h-10"
                />
              </div>

              <div>
                <Label htmlFor="state" className="text-sm font-medium text-gray-700 mb-1.5 block">
                  State / Province
                </Label>
                <Input
                  id="state"
                  placeholder="California"
                  value={formData.address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  className="h-10"
                />
              </div>

              <div>
                <Label htmlFor="zip" className="text-sm font-medium text-gray-700 mb-1.5 block">
                  ZIP / Postal Code
                </Label>
                <Input
                  id="zip"
                  placeholder="94103"
                  value={formData.address.zipCode}
                  onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                  className="h-10"
                />
              </div>

              <div>
                <Label htmlFor="country" className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Country
                </Label>
                <Select value={formData.address.country} onValueChange={(value) => handleAddressChange('country', value)}>
                  <SelectTrigger className="h-10">
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

          {/* Payment Preferences Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-5">
              <CreditCard className="w-5 h-5 text-gray-700" />
              <h2 className="text-base font-semibold text-gray-900">Payment Preferences</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="payment-method" className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Preferred Payment Method
                </Label>
                <Select
                  value={formData.preferredPaymentMethod}
                  onValueChange={(value) => handleInputChange('preferredPaymentMethod', value)}
                >
                  <SelectTrigger className="h-10">
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
                <div className="col-span-2">
                  <Label htmlFor="wallet" className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Payment Address
                  </Label>
                  <Input
                    id="wallet"
                    placeholder="Enter payment address"
                    value={formData.walletAddress}
                    onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                    className="h-10 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">For digital currency payments</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-5">
              <Settings2 className="w-5 h-5 text-gray-700" />
              <h2 className="text-base font-semibold text-gray-900">Additional Information</h2>
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700 mb-1.5 block">
                Internal Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this customer..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <p className="text-xs text-gray-500 mt-1.5">These notes are private and won't be visible to the customer</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/customers')}
              disabled={isLoading}
              className="h-10 px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-10 px-6 bg-[#635BFF] hover:bg-[#5045e5]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Customer'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
