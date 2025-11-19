import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Sparkles, Zap, Globe, TrendingUp, Building2, ArrowRight } from 'lucide-react';

export const BillingScreen = () => {
  const navigate = useNavigate();

  const freeFeatures = [
    'Unlimited invoices',
    'Customer management',
    'Basic reporting',
    'Email notifications',
    'Mobile-friendly interface',
    'Data export',
  ];

  const upcomingPaidFeatures = [
    'Online payment processing',
    'Real-time payment tracking',
    'Advanced analytics & insights',
    'Multi-currency support',
    'Recurring invoices & subscriptions',
    'Custom branding & templates',
    'Priority support',
    'API access',
  ];

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
          <h1 className="text-[28px] font-semibold text-gray-900">Billing & Plans</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your subscription and billing preferences</p>
        </div>

        {/* Complete Profile Banner */}
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border border-indigo-100 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-white border border-indigo-200 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 mb-1">Complete your business profile</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                Before you start invoicing, take a moment to add your business information, logo, and contact details. This will make your invoices look professional and build trust with your clients.
              </p>
              <button
                onClick={() => navigate('/business')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Set up business profile
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Hero Message */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 mb-8 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                We're committed to keeping it free!
              </h2>
              <p className="text-base text-gray-700 leading-relaxed mb-4">
                We believe powerful invoicing tools should be accessible to everyone. That's why we're keeping most
                features completely <span className="font-semibold text-indigo-600">free forever</span>.
              </p>
              <p className="text-base text-gray-700 leading-relaxed mb-4">
                While we're rolling out exciting new features one by one, we're taking our time to ensure each one
                meets our high standards. Advanced capabilities like online payment processing, real-time tracking, and
                premium integrations will be part of our paid tiers to help sustain and grow the platform.
              </p>
              <p className="text-base text-gray-700 leading-relaxed">
                For now, enjoy unlimited access to all core features at{' '}
                <span className="font-semibold text-indigo-600">absolutely no cost</span>. No credit card required, no
                hidden fees, no surprises.
              </p>
            </div>
          </div>
        </div>

        {/* Current Plan */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">Free Plan</h4>
                <p className="text-sm text-gray-600 mt-1">Everything you need to get started</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">$0</div>
                <div className="text-sm text-gray-500">forever</div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {freeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Premium Features Coming Soon</h3>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-6">
              We're working hard to bring you these powerful features. Stay tuned for updates!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingPaidFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 bg-white rounded-lg p-4 border border-gray-200">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    {index % 3 === 0 ? (
                      <Globe className="w-4 h-4 text-indigo-600" />
                    ) : index % 3 === 1 ? (
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <Zap className="w-4 h-4 text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{feature}</div>
                    <div className="text-xs text-gray-500 mt-1">Coming soon</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
          <p className="text-sm text-gray-700 text-center">
            Have questions about pricing or features?{' '}
            <button className="text-indigo-600 hover:text-indigo-700 font-medium">Get in touch</button> - we'd love to
            hear from you!
          </p>
        </div>
      </div>
    </div>
  );
};
