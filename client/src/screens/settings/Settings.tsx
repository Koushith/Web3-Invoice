import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Building2, Shield, User, Mail, Briefcase, FileText, CreditCard, Zap, DollarSign, Plus, Lock, Users2 } from 'lucide-react';
import { PasskeyManagement } from '@/components/passkey/PasskeyManagement';
import { useGetOrganizationQuery, useUpdateOrganizationMutation } from '@/services/api.service';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';

export const SettingsScreen = () => {
  const navigate = useNavigate();
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [showBusinessDetails, setShowBusinessDetails] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [organizationData, setOrganizationData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    taxId: '',
    logo: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthReady(true);
      }
    });
    return () => unsubscribe();
  }, []);

  const { data: organization, isLoading } = useGetOrganizationQuery(undefined, {
    skip: !isAuthReady,
  });

  const [updateOrganization, { isLoading: isSaving }] = useUpdateOrganizationMutation();

  useEffect(() => {
    if (organization) {
      setOrganizationData({
        name: organization.name || '',
        email: organization.email || '',
        phone: organization.phone || '',
        website: organization.website || '',
        taxId: organization.taxId || '',
        logo: organization.logo || '',
        address: {
          street: organization.address?.street || '',
          city: organization.address?.city || '',
          state: organization.address?.state || '',
          zipCode: organization.address?.zipCode || '',
          country: organization.address?.country || '',
        },
      });
    }
  }, [organization]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOrganizationData((prev) => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      await updateOrganization(organizationData).unwrap();
      toast.success('Settings saved successfully');
    } catch (error: any) {
      console.error('Save settings error:', error);
      toast.error(error?.data?.message || 'Failed to save settings');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFFFE]">
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        </div>

        {/* Personal settings */}
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-gray-900 mb-5">Personal settings</h2>
          <div className="grid grid-cols-3 gap-x-8 gap-y-6">
            <button
              onClick={() => navigate('/profile')}
              className="px-3 py-3 -mx-3 rounded-lg hover:bg-gray-100/60 transition-colors text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-primary mb-1">Personal details</div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    Contact information, password, authentication methods and your active sessions.
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/security')}
              className="px-3 py-3 -mx-3 rounded-lg hover:bg-gray-100/60 transition-colors text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-primary" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-primary mb-1">Security</div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    Authentication methods, Google account, and two-step verification.
                  </div>
                </div>
              </div>
            </button>

            <button className="px-3 py-3 -mx-3 rounded-lg hover:bg-gray-100/60 transition-colors text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-primary" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-primary mb-1">Communication preferences</div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    Customise the emails, SMS, and push notifications you receive.
                  </div>
                </div>
              </div>
            </button>

            <button className="px-3 py-3 -mx-3 rounded-lg hover:bg-gray-100/60 transition-colors text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-4 h-4 text-primary" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-primary mb-1">Developers</div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    Workbench, developer tools, and more.
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Account settings */}
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-gray-900 mb-5">Account settings</h2>
          <div className="grid grid-cols-3 gap-x-8 gap-y-6">
            <button
              onClick={() => setShowBusinessDetails(true)}
              className="px-3 py-3 -mx-3 rounded-lg hover:bg-gray-100/60 transition-colors text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4 text-primary" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-primary mb-1">Business</div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    Account details, account health, public info, payouts, legal entity, custom domains, and more.
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/team')}
              className="px-3 py-3 -mx-3 rounded-lg hover:bg-gray-100/60 transition-colors text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users2 className="w-4 h-4 text-primary" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-primary mb-1">Team</div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    Manage team members, roles, and permissions.
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/passkeys')}
              className="px-3 py-3 -mx-3 rounded-lg hover:bg-gray-100/60 transition-colors text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-4 h-4 text-primary" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-primary mb-1">Passkeys</div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    Manage your passkeys for secure authentication.
                  </div>
                </div>
              </div>
            </button>

            <button className="px-3 py-3 -mx-3 rounded-lg hover:bg-gray-100/60 transition-colors text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-primary" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-primary mb-1">Compliance and documents</div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    PCI compliance, documents, and legacy exports.
                  </div>
                </div>
              </div>
            </button>

            <button className="px-3 py-3 -mx-3 rounded-lg hover:bg-gray-100/60 transition-colors text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-primary" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-primary mb-1">Product previews</div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    Try out new features.
                  </div>
                </div>
              </div>
            </button>

            <button className="px-3 py-3 -mx-3 rounded-lg hover:bg-gray-100/60 transition-colors text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-4 h-4 text-primary" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-primary mb-1">Perks</div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    Discounts on tools to run your startup.
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Product settings */}
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-gray-900 mb-5">Product settings</h2>
          <div className="grid grid-cols-3 gap-x-8 gap-y-6">
            <button className="px-3 py-3 -mx-3 rounded-lg hover:bg-gray-100/60 transition-colors text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-primary" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-primary mb-1">Billing</div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    Subscriptions, invoices, quotes, and customer portal.
                  </div>
                </div>
              </div>
            </button>

            <button className="px-3 py-3 -mx-3 rounded-lg hover:bg-gray-100/60 transition-colors text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-4 h-4 text-primary" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-primary mb-1">Payments</div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    Checkout, payment methods, currency conversion, and more.
                  </div>
                </div>
              </div>
            </button>

            <button className="px-3 py-3 -mx-3 rounded-lg hover:bg-gray-100/60 transition-colors text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Plus className="w-4 h-4 text-primary" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-primary mb-1">Discover more features</div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    Boost revenue, manage finances, and more.
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Business Details Modal */}
        {showBusinessDetails && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Business details</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your business information and branding</p>
                </div>
                <button onClick={() => setShowBusinessDetails(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-3 block">Company logo</Label>
                  <div className="flex items-start gap-4">
                    {organizationData.logo ? (
                      <div className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
                        <img src={organizationData.logo} alt="Logo" className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <input type="file" id="logo-upload" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                      <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('logo-upload')?.click()} className="h-9 text-sm">
                        Upload logo
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">Square image recommended. Accepted file types: .png, .jpg, .svg</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200" />

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-900 mb-2 block">Business name</Label>
                    <Input id="name" value={organizationData.name} onChange={(e) => setOrganizationData((prev) => ({ ...prev, name: e.target.value }))} className="h-10" placeholder="Your Company Inc." />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-900 mb-2 block">Contact email</Label>
                      <Input id="email" type="email" value={organizationData.email} onChange={(e) => setOrganizationData((prev) => ({ ...prev, email: e.target.value }))} className="h-10" placeholder="hello@company.com" />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-900 mb-2 block">Phone number</Label>
                      <Input id="phone" type="tel" value={organizationData.phone} onChange={(e) => setOrganizationData((prev) => ({ ...prev, phone: e.target.value }))} className="h-10" placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="website" className="text-sm font-medium text-gray-900 mb-2 block">Website</Label>
                      <Input id="website" type="url" value={organizationData.website} onChange={(e) => setOrganizationData((prev) => ({ ...prev, website: e.target.value }))} className="h-10" placeholder="https://yourcompany.com" />
                    </div>
                    <div>
                      <Label htmlFor="taxId" className="text-sm font-medium text-gray-900 mb-2 block">Tax ID</Label>
                      <Input id="taxId" value={organizationData.taxId} onChange={(e) => setOrganizationData((prev) => ({ ...prev, taxId: e.target.value }))} className="h-10" placeholder="e.g., EIN, GST, VAT" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200" />

                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-4 block">Business address</Label>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="street" className="text-xs text-gray-600 mb-1.5 block">Street address</Label>
                      <Textarea id="street" value={organizationData.address.street} onChange={(e) => setOrganizationData((prev) => ({ ...prev, address: { ...prev.address, street: e.target.value } }))} className="min-h-[60px] resize-none" placeholder="123 Main Street" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-xs text-gray-600 mb-1.5 block">City</Label>
                        <Input id="city" value={organizationData.address.city} onChange={(e) => setOrganizationData((prev) => ({ ...prev, address: { ...prev.address, city: e.target.value } }))} className="h-10" placeholder="San Francisco" />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-xs text-gray-600 mb-1.5 block">State / Province</Label>
                        <Input id="state" value={organizationData.address.state} onChange={(e) => setOrganizationData((prev) => ({ ...prev, address: { ...prev.address, state: e.target.value } }))} className="h-10" placeholder="CA" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode" className="text-xs text-gray-600 mb-1.5 block">ZIP / Postal code</Label>
                        <Input id="zipCode" value={organizationData.address.zipCode} onChange={(e) => setOrganizationData((prev) => ({ ...prev, address: { ...prev.address, zipCode: e.target.value } }))} className="h-10" placeholder="94103" />
                      </div>
                      <div>
                        <Label htmlFor="country" className="text-xs text-gray-600 mb-1.5 block">Country</Label>
                        <Input id="country" value={organizationData.address.country} onChange={(e) => setOrganizationData((prev) => ({ ...prev, address: { ...prev.address, country: e.target.value } }))} className="h-10" placeholder="United States" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowBusinessDetails(false)} className="h-9">Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving} className="h-9">
                  {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Security Modal */}
        {showSecurity && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Security</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your authentication methods and account security</p>
                </div>
                <button onClick={() => setShowSecurity(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <PasskeyManagement />
              </div>
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end">
                <Button variant="outline" onClick={() => setShowSecurity(false)} className="h-9">Close</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
