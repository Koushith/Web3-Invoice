import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Building2, ArrowLeft, Upload } from 'lucide-react';
import { DetailSkeleton } from '@/components/ui/skeleton';
import { useGetOrganizationQuery, useUpdateOrganizationMutation } from '@/services/api.service';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';
import { LogoUploadDialog } from '@/components/business/LogoUploadDialog';

export const BusinessScreen = () => {
  const navigate = useNavigate();
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLogoDialogOpen, setIsLogoDialogOpen] = useState(false);
  const [isIconDialogOpen, setIsIconDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [organizationData, setOrganizationData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    taxId: '',
    logo: '',
    icon: '',
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
        icon: organization.icon || '',
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

  const handleLogoSave = (compressedImage: string) => {
    setOrganizationData((prev) => ({ ...prev, logo: compressedImage }));
  };

  const handleIconSave = (compressedImage: string) => {
    setOrganizationData((prev) => ({ ...prev, icon: compressedImage }));
  };

  const handleRemoveLogo = () => {
    setOrganizationData((prev) => ({ ...prev, logo: '' }));
    toast.success('Logo removed');
  };

  const handleRemoveIcon = () => {
    setOrganizationData((prev) => ({ ...prev, icon: '' }));
    toast.success('Icon removed');
  };

  const handleSave = async (section?: string) => {
    try {
      await updateOrganization(organizationData).unwrap();
      toast.success('Business details saved successfully');
      if (section) {
        setEditingSection(null);
      }
    } catch (error: any) {
      console.error('Save business error:', error);
      toast.error(error?.data?.message || 'Failed to save business details');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FEFFFE]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
          <DetailSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFFFE]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>

        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-[28px] font-semibold text-gray-900">Business</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-sm text-gray-600">Manage your business information and branding</span>
          </div>
        </div>

        {/* Branding Section */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">Branding</h2>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Upload your business logos to personalize invoices and communications.
          </p>

          <div className="space-y-6">
            {/* Company Icon */}
            <div>
              <Label className="text-sm font-medium text-gray-900 mb-3 block">Company icon</Label>
              <div className="flex items-start gap-4">
                {organizationData.icon ? (
                  <div className="w-20 h-20 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center bg-white">
                    <img src={organizationData.icon} alt="Icon" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsIconDialogOpen(true)}
                      className="h-8 text-sm px-3 border-gray-300 rounded-md"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {organizationData.icon ? 'Change icon' : 'Upload icon'}
                    </Button>
                    {organizationData.icon && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveIcon}
                        className="h-8 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    A square version of your logo or brand symbol. Used in small spaces like app icons and favicons.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, SVG (max 10MB) • Auto-cropped to square 512x512px
                  </p>
                </div>
              </div>
            </div>

            {/* Full Logo */}
            <div>
              <Label className="text-sm font-medium text-gray-900 mb-3 block">
                Full logo <span className="text-gray-600 font-normal text-sm">(Optional)</span>
              </Label>
              <div className="flex items-start gap-4">
                {organizationData.logo ? (
                  <div className="w-32 h-20 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center bg-white p-2">
                    <img src={organizationData.logo} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-32 h-20 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsLogoDialogOpen(true)}
                      className="h-8 text-sm px-3 border-gray-300 rounded-md"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {organizationData.logo ? 'Change logo' : 'Upload logo'}
                    </Button>
                    {organizationData.logo && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveLogo}
                        className="h-8 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Perfect for horizontal text-based logos, wordmarks, or wide brand logos that don't fit in a square.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, SVG (max 10MB) • Will be optimized with max width 512px
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Details Section */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Business details</h2>
            {editingSection !== 'details' ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setEditingSection('details');
                }}
              >
                ✎ Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-3 text-sm"
                  onClick={() => setEditingSection(null)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-7 px-3 text-sm"
                  onClick={() => handleSave('details')}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save'}
                </Button>
              </div>
            )}
          </div>

          {editingSection === 'details' ? (
            <div className="space-y-4 bg-white p-4 rounded-md border border-gray-200">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Business name</label>
                <Input
                  value={organizationData.name}
                  onChange={(e) => setOrganizationData((prev) => ({ ...prev, name: e.target.value }))}
                  className="h-8 text-sm"
                  placeholder="Your Company Inc."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Contact email</label>
                  <Input
                    type="email"
                    value={organizationData.email}
                    onChange={(e) => setOrganizationData((prev) => ({ ...prev, email: e.target.value }))}
                    className="h-8 text-sm"
                    placeholder="hello@company.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Phone number</label>
                  <Input
                    type="tel"
                    value={organizationData.phone}
                    onChange={(e) => setOrganizationData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="h-8 text-sm"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Website</label>
                  <Input
                    type="url"
                    value={organizationData.website}
                    onChange={(e) => setOrganizationData((prev) => ({ ...prev, website: e.target.value }))}
                    className="h-8 text-sm"
                    placeholder="https://yourcompany.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Tax ID</label>
                  <Input
                    value={organizationData.taxId}
                    onChange={(e) => setOrganizationData((prev) => ({ ...prev, taxId: e.target.value }))}
                    className="h-8 text-sm"
                    placeholder="e.g., EIN, GST, VAT"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Business name */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
                <div className="w-full sm:w-40 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-700">Business name</span>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-gray-900">{organizationData.name || '—'}</span>
                </div>
              </div>

              {/* Contact email */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
                <div className="w-full sm:w-40 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-700">Contact email</span>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-gray-900">{organizationData.email || '—'}</span>
                </div>
              </div>

              {/* Phone number */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
                <div className="w-full sm:w-40 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-700">Phone number</span>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-gray-900">{organizationData.phone || '—'}</span>
                </div>
              </div>

              {/* Website */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
                <div className="w-full sm:w-40 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-700">Website</span>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-gray-900">{organizationData.website || '—'}</span>
                </div>
              </div>

              {/* Tax ID */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
                <div className="w-full sm:w-40 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-700">Tax ID</span>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-gray-900">{organizationData.taxId || '—'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Business Address Section */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Business address</h2>
            {editingSection !== 'address' ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setEditingSection('address');
                }}
              >
                ✎ Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-3 text-sm"
                  onClick={() => setEditingSection(null)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-7 px-3 text-sm"
                  onClick={() => handleSave('address')}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save'}
                </Button>
              </div>
            )}
          </div>

          {editingSection === 'address' ? (
            <div className="space-y-4 bg-white p-4 rounded-md border border-gray-200">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Street address</label>
                <Textarea
                  value={organizationData.address.street}
                  onChange={(e) =>
                    setOrganizationData((prev) => ({
                      ...prev,
                      address: { ...prev.address, street: e.target.value },
                    }))
                  }
                  className="min-h-[60px] resize-none text-sm"
                  placeholder="123 Main Street"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">City</label>
                  <Input
                    value={organizationData.address.city}
                    onChange={(e) =>
                      setOrganizationData((prev) => ({
                        ...prev,
                        address: { ...prev.address, city: e.target.value },
                      }))
                    }
                    className="h-8 text-sm"
                    placeholder="San Francisco"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">State / Province</label>
                  <Input
                    value={organizationData.address.state}
                    onChange={(e) =>
                      setOrganizationData((prev) => ({
                        ...prev,
                        address: { ...prev.address, state: e.target.value },
                      }))
                    }
                    className="h-8 text-sm"
                    placeholder="CA"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">ZIP / Postal code</label>
                  <Input
                    value={organizationData.address.postalCode}
                    onChange={(e) =>
                      setOrganizationData((prev) => ({
                        ...prev,
                        address: { ...prev.address, postalCode: e.target.value },
                      }))
                    }
                    className="h-8 text-sm"
                    placeholder="94103"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Country</label>
                  <Input
                    value={organizationData.address.country}
                    onChange={(e) =>
                      setOrganizationData((prev) => ({
                        ...prev,
                        address: { ...prev.address, country: e.target.value },
                      }))
                    }
                    className="h-8 text-sm"
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Full Address */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
                <div className="w-full sm:w-40 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-700">Address</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-900">
                    {organizationData.address.street && <div>{organizationData.address.street}</div>}
                    {(organizationData.address.city || organizationData.address.state || organizationData.address.postalCode) && (
                      <div>
                        {[organizationData.address.city, organizationData.address.state, organizationData.address.postalCode]
                          .filter(Boolean)
                          .join(', ')}
                      </div>
                    )}
                    {organizationData.address.country && <div>{organizationData.address.country}</div>}
                    {!organizationData.address.street &&
                      !organizationData.address.city &&
                      !organizationData.address.state &&
                      !organizationData.address.postalCode &&
                      !organizationData.address.country && '—'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Box for Future Multiple Business Support */}
        <div className="bg-blue-50 rounded-lg border border-blue-100 p-4">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Coming soon:</span> Support for managing multiple businesses from a single
            account. Stay tuned!
          </p>
        </div>
      </div>

      {/* Icon Upload Dialog (Square 1:1) */}
      <LogoUploadDialog
        open={isIconDialogOpen}
        onClose={() => setIsIconDialogOpen(false)}
        onSave={handleIconSave}
        currentLogo={organizationData.icon}
        aspectRatio={1}
        title="Upload Company Icon"
        description="Upload your square company icon. Perfect for small spaces like favicons and app icons. Will be optimized to 512x512px."
      />

      {/* Logo Upload Dialog (Free-form) */}
      <LogoUploadDialog
        open={isLogoDialogOpen}
        onClose={() => setIsLogoDialogOpen(false)}
        onSave={handleLogoSave}
        currentLogo={organizationData.logo}
        title="Upload Full Logo"
        description="Upload and crop your full company logo. You can select any shape or size. Will be optimized with max width of 512px."
      />
    </div>
  );
};
