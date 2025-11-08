import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Globe, DollarSign, Bell, Shield, Palette } from 'lucide-react';
import { PasskeyManagement } from '@/components/passkey/PasskeyManagement';

export const SettingsScreen = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-[1000px] mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-sm text-gray-500 mt-2">Manage your organization preferences and configuration</p>
        </div>

        <div className="space-y-6">
          {/* Organization Settings */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Organization</h2>
                <p className="text-sm text-gray-500">Manage your business information</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="org-name" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Organization Name
                  </Label>
                  <Input
                    id="org-name"
                    defaultValue="DefInvoice Inc."
                    className="h-11 border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="org-email" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Contact Email
                  </Label>
                  <Input
                    id="org-email"
                    type="email"
                    defaultValue="hello@definvoice.com"
                    className="h-11 border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="invoice-prefix" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Invoice Number Prefix
                </Label>
                <Input
                  id="invoice-prefix"
                  defaultValue="INV"
                  className="h-11 border-gray-300 rounded-lg w-40"
                  placeholder="INV"
                />
                <p className="text-xs text-gray-500 mt-1.5">Invoices will be numbered as INV-0001, INV-0002, etc.</p>
              </div>
            </div>
          </div>

          {/* Regional Settings */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
                <Globe className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Regional Settings</h2>
                <p className="text-sm text-gray-500">Configure localization preferences</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <Label htmlFor="timezone" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Timezone
                </Label>
                <Select defaultValue="utc">
                  <SelectTrigger className="h-11 border-gray-300 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC (GMT+0:00)</SelectItem>
                    <SelectItem value="est">Eastern Time (GMT-5:00)</SelectItem>
                    <SelectItem value="pst">Pacific Time (GMT-8:00)</SelectItem>
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

          {/* Currency & Payment */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-50 to-violet-50 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Currency & Payment</h2>
                <p className="text-sm text-gray-500">Configure default currency and payment settings</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="default-currency" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Default Currency
                  </Label>
                  <Select defaultValue="usd">
                    <SelectTrigger className="h-11 border-gray-300 rounded-lg">
                      <SelectValue />
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
                  <Label htmlFor="tax-rate" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Default Tax Rate (%)
                  </Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    defaultValue="10"
                    className="h-11 border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="payment-terms" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Default Payment Terms
                </Label>
                <Select defaultValue="net30">
                  <SelectTrigger className="h-11 border-gray-300 rounded-lg w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Due on Receipt</SelectItem>
                    <SelectItem value="net15">Net 15 days</SelectItem>
                    <SelectItem value="net30">Net 30 days</SelectItem>
                    <SelectItem value="net60">Net 60 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                <Bell className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                <p className="text-sm text-gray-500">Manage email notifications and alerts</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { id: 'invoice-sent', label: 'Invoice Sent', description: 'Get notified when an invoice is sent to a customer' },
                { id: 'payment-received', label: 'Payment Received', description: 'Get notified when a payment is received' },
                { id: 'invoice-overdue', label: 'Invoice Overdue', description: 'Get notified when an invoice becomes overdue' },
                { id: 'weekly-summary', label: 'Weekly Summary', description: 'Receive a weekly summary of your invoices and payments' },
              ].map((notification) => (
                <div key={notification.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{notification.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{notification.description}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Security</h2>
                <p className="text-sm text-gray-500">Manage security and authentication settings</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Passkeys */}
              <PasskeyManagement />

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500 mt-0.5">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline" className="h-9 px-4 rounded-lg">
                  Enable
                </Button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">Change Password</p>
                  <p className="text-xs text-gray-500 mt-0.5">Update your account password</p>
                </div>
                <Button variant="outline" className="h-9 px-4 rounded-lg">
                  Change
                </Button>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
                <Palette className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
                <p className="text-sm text-gray-500">Customize the look and feel</p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                Theme
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {['Light', 'Dark', 'System'].map((theme) => (
                  <button
                    key={theme}
                    className="h-20 rounded-lg border-2 border-gray-200 hover:border-[#635bff] transition-all flex items-center justify-center text-sm font-medium"
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end pt-4 border-t border-gray-200">
            <div className="flex gap-3">
              <Button variant="outline" className="h-11 px-6 border-gray-300 rounded-lg">
                Reset
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
