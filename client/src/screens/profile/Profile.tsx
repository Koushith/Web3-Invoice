import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '@/services/api.service';
import { toast } from 'sonner';

export const ProfileScreen = () => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const navigate = useNavigate();
  const { data: user, isLoading } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    language: 'en',
  });

  // Update formData when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        language: user.language || 'en',
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await updateProfile(formData).unwrap();
      toast.success('Profile updated successfully');
      setEditingSection(null);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update profile');
    }
  };

  const handleLanguageSave = async () => {
    try {
      await updateProfile({ language: formData.language }).unwrap();
      toast.success('Language updated successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update language');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FEFFFE] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFFFE]">
      <div className="max-w-6xl mx-auto px-8 py-8">
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
        <div className="mb-8">
          <h1 className="text-[28px] font-semibold text-gray-900">Personal details</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-sm text-gray-600">Global setting</span>
            <span className="text-gray-400 text-xs">ⓘ</span>
          </div>
        </div>

        {/* User Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">User</h2>
            {editingSection !== 'user' ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setEditingSection('user');
                  setFormData({
                    firstName: user?.firstName || '',
                    lastName: user?.lastName || '',
                    phone: user?.phone || '',
                    language: user?.language || 'en',
                  });
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
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-7 px-3 text-sm"
                  onClick={handleSave}
                  disabled={isUpdating}
                >
                  {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save'}
                </Button>
              </div>
            )}
          </div>

          {editingSection === 'user' ? (
            <div className="space-y-4 bg-white p-4 rounded-md border border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">First name</label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Last name</label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Email */}
              <div className="flex items-start">
                <div className="w-40 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-700">Email</span>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-gray-900">{user?.email || '—'}</span>
                </div>
              </div>

              {/* Name */}
              <div className="flex items-start">
                <div className="w-40 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-700">Name</span>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-gray-900">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user?.displayName || '—'}
                  </span>
                </div>
              </div>

              {/* Password */}
              <div className="flex items-start">
                <div className="w-40 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-700">Password</span>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-gray-900">••••••••••</span>
                </div>
              </div>

              {/* Contact phone */}
              <div className="flex items-start">
                <div className="w-40 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-gray-700">Contact phone</span>
                    <span className="text-gray-400 text-xs">ⓘ</span>
                  </div>
                </div>
                <div className="flex-1">
                  {user?.phone ? (
                    <span className="text-sm text-gray-900">{user.phone}</span>
                  ) : (
                    <button className="text-sm text-gray-600 hover:text-gray-900">
                      Add contact phone number
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Language Section */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">Language</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Please select a preferred language for your Dashboard, including date, time and number formatting.
          </p>
          <div className="flex items-center gap-3">
            <select
              className="h-8 px-3 text-sm border border-gray-300 rounded-md bg-white"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            >
              <option value="auto">Auto-detect</option>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
            <Button
              size="sm"
              className="h-8 px-3 text-sm bg-primary hover:bg-primary/90 text-white rounded-md"
              onClick={handleLanguageSave}
              disabled={isUpdating}
            >
              {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save'}
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Your detected language is{' '}
            {formData.language === 'en'
              ? 'English'
              : formData.language === 'es'
              ? 'Spanish'
              : formData.language === 'fr'
              ? 'French'
              : formData.language === 'de'
              ? 'German'
              : 'English'}
            .
          </p>
        </div>

        {/* Login sessions Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Login sessions</h2>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-3 text-sm border-gray-300 rounded-md"
            >
              Sign out all other sessions
            </Button>
          </div>
          <p className="text-sm text-gray-600 mb-5">Places where you're logged into Stripe.</p>

          {/* Sessions Table */}
          <div className="bg-white rounded-md border border-gray-200">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">India (KA)</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Chrome - Apple Macintosh - Mac OS</td>
                  <td className="px-4 py-3 text-sm text-gray-600">117.205.233.185</td>
                  <td className="px-4 py-3 text-sm text-gray-600">4 minutes ago</td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs text-gray-500">Current session</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">India (KA)</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Chrome - Apple Macintosh - Mac OS</td>
                  <td className="px-4 py-3 text-sm text-gray-600">49.37.178.24</td>
                  <td className="px-4 py-3 text-sm text-gray-600">last month</td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs text-gray-500">Expired</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">India (KA)</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Chrome - Apple Macintosh - Mac OS</td>
                  <td className="px-4 py-3 text-sm text-gray-600">117.205.233.35</td>
                  <td className="px-4 py-3 text-sm text-gray-600">2 months ago</td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs text-gray-500">Expired</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
