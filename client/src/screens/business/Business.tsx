import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Building2, ArrowLeft, Check } from 'lucide-react';
import { useGetOrganizationQuery, useUpdateOrganizationMutation } from '@/services/api.service';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';

export const BusinessScreen = () => {
  const navigate = useNavigate();
  const [isAuthReady, setIsAuthReady] = useState(false);
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
      postalCode: '',
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
          postalCode: organization.address?.postalCode || '',
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
      toast.success('Business details saved successfully');
    } catch (error: any) {
      console.error('Save business error:', error);
      toast.error(error?.data?.message || 'Failed to save business details');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEFFFE]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFFFE]">
      <div className="max-w-4xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[28px] font-semibold text-gray-900">Business</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your business information and branding</p>
            </div>
            {/* Future: Add Business button for multiple businesses */}
            {/* <Button variant="outline" className="h-9 gap-2">
              <Plus className="w-4 h-4" />
              Add Business
            </Button> */}
          </div>
        </div>

        {/* Current Business Card */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {organizationData.logo ? (
                  <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
                    <img src={organizationData.logo} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{organizationData.name || 'Your Business'}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      <Check className="w-3 h-3" />
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Details Form */}
          <div className="p-6 space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-900 mb-3 block">Company logo</Label>
              <div className="flex items-start gap-4">
                {organizationData.logo ? (
                  <div className="w-20 h-20 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
                    <img src={organizationData.logo} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    className="h-9 text-sm"
                  >
                    Upload logo
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Square image recommended. Accepted file types: .png, .jpg, .svg
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200" />

            <div className="space-y-5">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-900 mb-2 block">
                  Business name
                </Label>
                <Input
                  id="name"
                  value={organizationData.name}
                  onChange={(e) => setOrganizationData((prev) => ({ ...prev, name: e.target.value }))}
                  className="h-10"
                  placeholder="Your Company Inc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-900 mb-2 block">
                    Contact email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={organizationData.email}
                    onChange={(e) => setOrganizationData((prev) => ({ ...prev, email: e.target.value }))}
                    className="h-10"
                    placeholder="hello@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-900 mb-2 block">
                    Phone number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={organizationData.phone}
                    onChange={(e) => setOrganizationData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="h-10"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website" className="text-sm font-medium text-gray-900 mb-2 block">
                    Website
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    value={organizationData.website}
                    onChange={(e) => setOrganizationData((prev) => ({ ...prev, website: e.target.value }))}
                    className="h-10"
                    placeholder="https://yourcompany.com"
                  />
                </div>
                <div>
                  <Label htmlFor="taxId" className="text-sm font-medium text-gray-900 mb-2 block">
                    Tax ID
                  </Label>
                  <Input
                    id="taxId"
                    value={organizationData.taxId}
                    onChange={(e) => setOrganizationData((prev) => ({ ...prev, taxId: e.target.value }))}
                    className="h-10"
                    placeholder="e.g., EIN, GST, VAT"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200" />

            <div>
              <Label className="text-sm font-medium text-gray-900 mb-4 block">Business address</Label>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="street" className="text-xs text-gray-600 mb-1.5 block">
                    Street address
                  </Label>
                  <Textarea
                    id="street"
                    value={organizationData.address.street}
                    onChange={(e) =>
                      setOrganizationData((prev) => ({
                        ...prev,
                        address: { ...prev.address, street: e.target.value },
                      }))
                    }
                    className="min-h-[60px] resize-none"
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-xs text-gray-600 mb-1.5 block">
                      City
                    </Label>
                    <Input
                      id="city"
                      value={organizationData.address.city}
                      onChange={(e) =>
                        setOrganizationData((prev) => ({
                          ...prev,
                          address: { ...prev.address, city: e.target.value },
                        }))
                      }
                      className="h-10"
                      placeholder="San Francisco"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-xs text-gray-600 mb-1.5 block">
                      State / Province
                    </Label>
                    <Input
                      id="state"
                      value={organizationData.address.state}
                      onChange={(e) =>
                        setOrganizationData((prev) => ({
                          ...prev,
                          address: { ...prev.address, state: e.target.value },
                        }))
                      }
                      className="h-10"
                      placeholder="CA"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postalCode" className="text-xs text-gray-600 mb-1.5 block">
                      ZIP / Postal code
                    </Label>
                    <Input
                      id="postalCode"
                      value={organizationData.address.postalCode}
                      onChange={(e) =>
                        setOrganizationData((prev) => ({
                          ...prev,
                          address: { ...prev.address, postalCode: e.target.value },
                        }))
                      }
                      className="h-10"
                      placeholder="94103"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-xs text-gray-600 mb-1.5 block">
                      Country
                    </Label>
                    <Input
                      id="country"
                      value={organizationData.address.country}
                      onChange={(e) =>
                        setOrganizationData((prev) => ({
                          ...prev,
                          address: { ...prev.address, country: e.target.value },
                        }))
                      }
                      className="h-10"
                      placeholder="United States"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => navigate('/settings')} className="h-9">
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="h-9">
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save changes'
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Info Box for Future Multiple Business Support */}
        <div className="bg-blue-50 rounded-lg border border-blue-100 p-4">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Coming soon:</span> Support for managing multiple businesses from a single
            account. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
};
