import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Building2, Mail, MapPin, CreditCard, Settings2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NewCustomerScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <div className="max-w-[900px] mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/customers')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Customers
          </button>
          <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Add New Customer</h1>
          <p className="text-sm text-gray-500 mt-2">Create a customer profile to start sending invoices</p>
        </div>

        <div className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                <p className="text-sm text-gray-500">Company details and contact information</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <Label htmlFor="company-name" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Company Name *
                </Label>
                <Input
                  id="company-name"
                  placeholder="Acme Corporation"
                  className="h-11 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all"
                />
              </div>

              <div>
                <Label htmlFor="contact-name" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Contact Name
                </Label>
                <Input
                  id="contact-name"
                  placeholder="John Doe"
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
                  className="h-11 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all"
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
                  className="h-11 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Billing Address Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Billing Address</h2>
                <p className="text-sm text-gray-500">Where invoices should be sent</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <Label htmlFor="street" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Street Address
                </Label>
                <Input
                  id="street"
                  placeholder="123 Main Street"
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
                  className="h-11 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all"
                />
              </div>

              <div>
                <Label htmlFor="country" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Country
                </Label>
                <Select>
                  <SelectTrigger className="h-11 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#635bff]/20">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Payment Preferences Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-50 to-violet-50 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Payment Preferences</h2>
                <p className="text-sm text-gray-500">Configure payment settings for this customer</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <Label htmlFor="currency" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Preferred Currency
                </Label>
                <Select>
                  <SelectTrigger className="h-11 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#635bff]/20">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD - US Dollar</SelectItem>
                    <SelectItem value="eur">EUR - Euro</SelectItem>
                    <SelectItem value="gbp">GBP - British Pound</SelectItem>
                    <SelectItem value="eth">ETH - Ethereum</SelectItem>
                    <SelectItem value="usdc">USDC - USD Coin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="payment-terms" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Payment Terms
                </Label>
                <Select>
                  <SelectTrigger className="h-11 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#635bff]/20">
                    <SelectValue placeholder="Select terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Due on Receipt</SelectItem>
                    <SelectItem value="net15">Net 15</SelectItem>
                    <SelectItem value="net30">Net 30</SelectItem>
                    <SelectItem value="net60">Net 60</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="wallet" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Crypto Wallet Address (Optional)
                </Label>
                <Input
                  id="wallet"
                  placeholder="0x..."
                  className="h-11 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1.5">For customers who prefer crypto payments</p>
              </div>
            </div>
          </div>

          {/* Additional Information Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                <Settings2 className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Additional Information</h2>
                <p className="text-sm text-gray-500">Notes and custom settings</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <Label htmlFor="notes" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Internal Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this customer..."
                  className="min-h-[100px] border-gray-300 rounded-lg focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all resize-none"
                />
                <p className="text-xs text-gray-500 mt-1.5">These notes are private and won't be visible to the customer</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/customers')}
              className="h-11 px-6 border-gray-300 hover:bg-gray-50 rounded-lg font-medium"
            >
              Cancel
            </Button>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-11 px-6 border-gray-300 hover:bg-gray-50 rounded-lg font-medium"
              >
                Save as Draft
              </Button>
              <Button className="h-11 px-8 bg-gradient-to-r from-[#635bff] to-[#5045e5] hover:from-[#5045e5] hover:to-[#3d38d1] text-white rounded-lg font-semibold shadow-lg shadow-[#635bff]/20">
                Create Customer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
