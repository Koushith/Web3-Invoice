import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building2, Shield, User, Mail, Briefcase, CreditCard, Zap, Users2, FileText } from 'lucide-react';
import { PasskeyManagement } from '@/components/passkey/PasskeyManagement';

export const SettingsScreen = () => {
  const navigate = useNavigate();
  const [showSecurity, setShowSecurity] = useState(false);

  return (
    <div className="min-h-screen bg-[#FEFFFE]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
        <div className="mb-6 md:mb-10">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Settings</h1>
        </div>

        {/* Personal settings */}
        <div className="mb-8 md:mb-10">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 md:mb-5">Personal settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-x-8 md:gap-y-6">
            <button
              onClick={() => navigate('/profile')}
              className="px-4 py-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 active:scale-98 transition-all text-left md:px-3 md:py-3 md:-mx-3 md:border-0 md:bg-transparent md:hover:bg-gray-100/60"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 md:w-8 md:h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 md:w-4 md:h-4 text-primary" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm md:text-base font-medium text-primary mb-1">Personal details</div>
                  <div className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    Contact information, password, authentication methods and your active sessions.
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/security')}
              className="px-4 py-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 active:scale-98 transition-all text-left md:px-3 md:py-3 md:-mx-3 md:border-0 md:bg-transparent md:hover:bg-gray-100/60"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 md:w-8 md:h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 md:w-4 md:h-4 text-primary" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm md:text-base font-medium text-primary mb-1">Security</div>
                  <div className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    Authentication methods, Google account, and two-step verification.
                  </div>
                </div>
              </div>
            </button>

            <button className="px-4 py-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 active:scale-98 transition-all text-left md:px-3 md:py-3 md:-mx-3 md:border-0 md:bg-transparent md:hover:bg-gray-100/60">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 md:w-8 md:h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 md:w-4 md:h-4 text-primary" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm md:text-base font-medium text-primary mb-1">Communication preferences</div>
                  <div className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    Customise the emails, SMS, and push notifications you receive.
                  </div>
                </div>
              </div>
            </button>

            <button className="px-4 py-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 active:scale-98 transition-all text-left md:px-3 md:py-3 md:-mx-3 md:border-0 md:bg-transparent md:hover:bg-gray-100/60">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 md:w-8 md:h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 md:w-4 md:h-4 text-primary" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm md:text-base font-medium text-primary mb-1">Developers</div>
                  <div className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    Workbench, developer tools, and more.
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Account settings */}
        <div className="mb-8 md:mb-10">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 md:mb-5">Account settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-x-8 md:gap-y-6">
            <button
              onClick={() => navigate('/business')}
              className="px-4 py-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 active:scale-98 transition-all text-left md:px-3 md:py-3 md:-mx-3 md:border-0 md:bg-transparent md:hover:bg-gray-100/60"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 md:w-8 md:h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 md:w-4 md:h-4 text-primary" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm md:text-base font-medium text-primary mb-1">Business</div>
                  <div className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    Account details, account health, public info, payouts, legal entity, custom domains, and more.
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/team')}
              className="px-4 py-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 active:scale-98 transition-all text-left md:px-3 md:py-3 md:-mx-3 md:border-0 md:bg-transparent md:hover:bg-gray-100/60"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 md:w-8 md:h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users2 className="w-5 h-5 md:w-4 md:h-4 text-primary" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm md:text-base font-medium text-primary mb-1">Team</div>
                  <div className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    Manage team members, roles, and permissions.
                  </div>
                </div>
              </div>
            </button>

            <button className="px-4 py-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 active:scale-98 transition-all text-left md:px-3 md:py-3 md:-mx-3 md:border-0 md:bg-transparent md:hover:bg-gray-100/60">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 md:w-8 md:h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 md:w-4 md:h-4 text-primary" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm md:text-base font-medium text-primary mb-1">Compliance and documents</div>
                  <div className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    PCI compliance, documents, and legacy exports.
                  </div>
                </div>
              </div>
            </button>

            <button className="px-4 py-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 active:scale-98 transition-all text-left md:px-3 md:py-3 md:-mx-3 md:border-0 md:bg-transparent md:hover:bg-gray-100/60">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 md:w-8 md:h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 md:w-4 md:h-4 text-primary" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm md:text-base font-medium text-primary mb-1">Product previews</div>
                  <div className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    Try out new features.
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Product settings */}
        <div className="mb-8 md:mb-10">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 md:mb-5">Product settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-x-8 md:gap-y-6">
            <button
              onClick={() => navigate('/billing')}
              className="px-4 py-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 active:scale-98 transition-all text-left md:px-3 md:py-3 md:-mx-3 md:border-0 md:bg-transparent md:hover:bg-gray-100/60"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 md:w-8 md:h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 md:w-4 md:h-4 text-primary" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm md:text-base font-medium text-primary mb-1">Billing & Payments</div>
                  <div className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    Subscriptions, invoices, payment methods, and customer portal.
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>


        {/* Security Modal */}
        {showSecurity && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg md:rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base md:text-lg font-semibold text-gray-900">Security</h2>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">Manage your authentication methods and account security</p>
                </div>
                <button onClick={() => setShowSecurity(false)} className="text-gray-400 hover:text-gray-600 active:scale-95 transition-transform">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4 sm:p-6">
                <PasskeyManagement />
              </div>
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-4 flex justify-end">
                <Button variant="outline" onClick={() => setShowSecurity(false)} className="h-9 active:scale-98">Close</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
