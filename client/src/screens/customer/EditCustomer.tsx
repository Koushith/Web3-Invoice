import { useState, FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCustomerQuery, useUpdateCustomerMutation } from '@/services/api.service';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';

export const EditCustomerScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();

  // Wait for Firebase auth to be ready
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthReady(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch customer data
  const { data: customer, isLoading, error } = useGetCustomerQuery(id!, {
    skip: !isAuthReady || !id,
  });

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

  // Populate form with customer data when loaded
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        company: customer.company || '',
        email: customer.email || '',
        phone: customer.phone || '',
        taxId: customer.taxId || '',
        address: {
          street: customer.address?.street || '',
          city: customer.address?.city || '',
          state: customer.address?.state || '',
          zipCode: customer.address?.zipCode || customer.address?.postalCode || '',
          country: customer.address?.country || '',
        },
        preferredPaymentMethod: customer.preferredPaymentMethod || '',
        walletAddress: customer.walletAddress || '',
        notes: customer.notes || '',
      });
    }
  }, [customer]);

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
        name: formData.name || formData.company,
        company: formData.company,
        email: formData.email.toLowerCase(),
        phone: formData.phone || undefined,
        taxId: formData.taxId || undefined,
        address: formData.address.street ? formData.address : undefined,
        preferredPaymentMethod: formData.preferredPaymentMethod || undefined,
        walletAddress: formData.walletAddress || undefined,
        notes: formData.notes || undefined,
      };

      await updateCustomer({ id: id!, data: customerData }).unwrap();
      toast.success('Customer updated successfully');
      navigate(`/customers/${id}`);
    } catch (error: any) {
      console.error('Update customer error:', error);
      toast.error(error?.data?.message || 'Failed to update customer');
    }
  };

  if (!isAuthReady || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load customer details</p>
          <Button onClick={() => navigate('/customers')}>Back to Customers</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFFFE]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => navigate(`/customers/${id}`)}
            className="flex items-center gap-1 text-sm text-[#635BFF] hover:text-[#5045e5] mb-4 md:mb-6 font-medium active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Customer
          </button>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Edit Customer</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Update customer profile information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <div className="border border-gray-200 rounded-lg p-4 md:p-6">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-gray-900">Basic Information</h2>
              <p className="text-sm text-gray-600 mt-1">Company details and contact information</p>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <Label htmlFor="company-name" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Company Name *
                </Label>
                <Input
                  id="company-name"
                  placeholder="Acme Corporation"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="h-11 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all"
                  required
                />
              </div>

              <div>
                <Label htmlFor="contact-name" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Contact Name
                </Label>
                <Input
                  id="contact-name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="h-11 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@acme.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="h-11 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="h-11 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all"
                />
              </div>

              <div>
                <Label htmlFor="tax-id" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Tax ID / VAT Number
                </Label>
                <Input
                  id="tax-id"
                  placeholder="XX-XXXXXXX"
                  value={formData.taxId}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
                  className="h-11 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Billing Address Card */}
          <div className="border border-gray-200 rounded-lg p-4 md:p-6">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-gray-900">Billing Address</h2>
              <p className="text-sm text-gray-600 mt-1">Where invoices should be sent</p>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <Label htmlFor="street" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Street Address
                </Label>
                <Input
                  id="street"
                  placeholder="123 Main Street"
                  value={formData.address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  className="h-11 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all"
                />
              </div>

              <div>
                <Label htmlFor="city" className="text-sm font-semibold text-gray-700 mb-2 block">
                  City
                </Label>
                <Input
                  id="city"
                  placeholder="San Francisco"
                  value={formData.address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  className="h-11 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all"
                />
              </div>

              <div>
                <Label htmlFor="state" className="text-sm font-semibold text-gray-700 mb-2 block">
                  State / Province
                </Label>
                <Input
                  id="state"
                  placeholder="California"
                  value={formData.address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  className="h-11 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all"
                />
              </div>

              <div>
                <Label htmlFor="zip" className="text-sm font-semibold text-gray-700 mb-2 block">
                  ZIP / Postal Code
                </Label>
                <Input
                  id="zip"
                  placeholder="94103"
                  value={formData.address.zipCode}
                  onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                  className="h-11 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all"
                />
              </div>

              <div>
                <Label htmlFor="country" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Country
                </Label>
                <Select value={formData.address.country} onValueChange={(value) => handleAddressChange('country', value)}>
                  <SelectTrigger className="h-11 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#635bff]/20">
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
          <div className="border border-gray-200 rounded-lg p-4 md:p-6">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-gray-900">Payment Preferences</h2>
              <p className="text-sm text-gray-600 mt-1">Configure payment settings for this customer</p>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <Label htmlFor="payment-method" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Preferred Payment Method (Optional)
                </Label>
                <Select
                  value={formData.preferredPaymentMethod}
                  onValueChange={(value) => handleInputChange('preferredPaymentMethod', value)}
                >
                  <SelectTrigger className="h-11 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#635bff]/20">
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
                  <Label htmlFor="wallet" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Payment Address (Optional)
                  </Label>
                  <Input
                    id="wallet"
                    placeholder="Enter payment address"
                    value={formData.walletAddress}
                    onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                    className="h-11 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">For digital currency payments</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information Card */}
          <div className="border border-gray-200 rounded-lg p-4 md:p-6">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-gray-900">Additional Information</h2>
              <p className="text-sm text-gray-600 mt-1">Notes and custom settings</p>
            </div>

            <div className="space-y-5">
              <div>
                <Label htmlFor="notes" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Internal Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this customer..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="min-h-[100px] border-gray-300 rounded-lg focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all resize-none"
                />
                <p className="text-xs text-gray-500 mt-1.5">These notes are private and won't be visible to the customer</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/customers/${id}`)}
              disabled={isUpdating}
              className="h-9 px-4 text-sm font-medium border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="h-9 px-4 text-sm font-medium bg-[#635BFF] hover:bg-[#5045e5] text-white"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Customer'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
