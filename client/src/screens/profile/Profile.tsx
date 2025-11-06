import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, MapPin, Camera, Briefcase, Calendar } from 'lucide-react';

export const ProfileScreen = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-[900px] mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Profile</h1>
          <p className="text-sm text-gray-500 mt-2">Manage your personal information and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Picture Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Profile Picture</h2>
                <p className="text-sm text-gray-500">Update your profile photo</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#635bff] to-[#5045e5] flex items-center justify-center text-white text-2xl font-bold">
                  KT
                </div>
                <button className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </button>
              </div>
              <div className="flex-1">
                <div className="flex gap-3">
                  <Button variant="outline" className="h-10 px-4 border-gray-300 rounded-lg">
                    Change Photo
                  </Button>
                  <Button variant="outline" className="h-10 px-4 border-gray-300 rounded-lg text-red-600 hover:bg-red-50 border-red-200">
                    Remove
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max size of 2MB.</p>
              </div>
            </div>
          </div>

          {/* Personal Information Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
                <Mail className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                <p className="text-sm text-gray-500">Update your personal details</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <Label htmlFor="first-name" className="text-sm font-semibold text-gray-700 mb-2 block">
                  First Name
                </Label>
                <Input
                  id="first-name"
                  defaultValue="Koushith"
                  className="h-11 border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <Label htmlFor="last-name" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Last Name
                </Label>
                <Input
                  id="last-name"
                  defaultValue="Amin"
                  className="h-11 border-gray-300 rounded-lg"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="koushith@definvoice.com"
                  className="h-11 border-gray-300 rounded-lg"
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
                  className="h-11 border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <Label htmlFor="language" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Language
                </Label>
                <Select defaultValue="en">
                  <SelectTrigger className="h-11 border-gray-300 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Professional Information Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-50 to-violet-50 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Professional Information</h2>
                <p className="text-sm text-gray-500">Work-related details</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <Label htmlFor="job-title" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Job Title
                </Label>
                <Input
                  id="job-title"
                  placeholder="e.g., Product Manager"
                  className="h-11 border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <Label htmlFor="department" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Department
                </Label>
                <Select>
                  <SelectTrigger className="h-11 border-gray-300 rounded-lg">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="bio" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  className="min-h-[100px] border-gray-300 rounded-lg resize-none"
                />
                <p className="text-xs text-gray-500 mt-1.5">Brief description for your profile. Max 200 characters.</p>
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Location</h2>
                <p className="text-sm text-gray-500">Where you're based</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <Label htmlFor="city" className="text-sm font-semibold text-gray-700 mb-2 block">
                  City
                </Label>
                <Input
                  id="city"
                  placeholder="San Francisco"
                  className="h-11 border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <Label htmlFor="country" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Country
                </Label>
                <Select>
                  <SelectTrigger className="h-11 border-gray-300 rounded-lg">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="in">India</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timezone" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Timezone
                </Label>
                <Select defaultValue="pst">
                  <SelectTrigger className="h-11 border-gray-300 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pst">Pacific Time (GMT-8:00)</SelectItem>
                    <SelectItem value="est">Eastern Time (GMT-5:00)</SelectItem>
                    <SelectItem value="utc">UTC (GMT+0:00)</SelectItem>
                    <SelectItem value="ist">India Time (GMT+5:30)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date-format" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Date Format
                </Label>
                <Select defaultValue="mm-dd-yyyy">
                  <SelectTrigger className="h-11 border-gray-300 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Account Information Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
                <p className="text-sm text-gray-500">Account details and metadata</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">User ID</p>
                  <p className="text-xs text-gray-500 mt-0.5">Your unique identifier</p>
                </div>
                <code className="text-sm font-mono bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
                  usr_2aK9j4nX7qB
                </code>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">Member Since</p>
                  <p className="text-xs text-gray-500 mt-0.5">Account creation date</p>
                </div>
                <span className="text-sm text-gray-600">January 10, 2024</span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Account Type</p>
                  <p className="text-xs text-gray-500 mt-0.5">Current subscription plan</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 ring-1 ring-purple-200/50">
                  Pro Plan
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end pt-4 border-t border-gray-200">
            <div className="flex gap-3">
              <Button variant="outline" className="h-11 px-6 border-gray-300 rounded-lg">
                Cancel
              </Button>
              <Button className="h-11 px-8 bg-gradient-to-r from-[#635bff] to-[#5045e5] hover:from-[#5045e5] hover:to-[#3d38d1] text-white rounded-lg font-semibold shadow-lg shadow-[#635bff]/20">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
