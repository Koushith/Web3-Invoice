import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  logo: string; // URL to logo
  category: 'communication' | 'productivity' | 'development' | 'analytics';
  comingSoon: boolean;
  connected?: boolean;
}

const integrations: Integration[] = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get real-time notifications about invoices, payments, and customer activity in your Slack workspace.',
    logo: 'https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png',
    category: 'communication',
    comingSoon: true,
  },
  {
    id: 'telegram',
    name: 'Telegram',
    description: 'Receive instant alerts and manage invoices directly from Telegram bot.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg',
    category: 'communication',
    comingSoon: true,
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Get invoice updates and payment notifications directly in your Discord server.',
    logo: 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png',
    category: 'communication',
    comingSoon: true,
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect with 5,000+ apps and automate your invoicing workflow.',
    logo: 'https://cdn.zapier.com/zapier/images/logos/zapier-logomark.png',
    category: 'productivity',
    comingSoon: true,
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Sync invoices and customer data to your Notion workspace.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
    category: 'productivity',
    comingSoon: true,
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Accept online payments and automatically mark invoices as paid.',
    logo: 'https://images.ctfassets.net/fzn2n1nzq965/HTTOloNPhisV9P4hlMPNA/cacf1bb88b9fc492dfad34378d844280/Stripe_icon_-_square.svg',
    category: 'productivity',
    comingSoon: true,
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    description: 'Sync invoices and payments with QuickBooks for seamless accounting.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/QuickBooks_logo.svg/200px-QuickBooks_logo.svg.png',
    category: 'analytics',
    comingSoon: true,
  },
  {
    id: 'xero',
    name: 'Xero',
    description: 'Connect your Xero account to automatically sync financial data.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Xero_software_logo.svg/200px-Xero_software_logo.svg.png',
    category: 'analytics',
    comingSoon: true,
  },
  {
    id: 'sheets',
    name: 'Google Sheets',
    description: 'Export invoice and payment data to Google Sheets automatically.',
    logo: 'https://www.gstatic.com/images/branding/product/2x/sheets_2020q4_48dp.png',
    category: 'analytics',
    comingSoon: true,
  },
  {
    id: 'airtable',
    name: 'Airtable',
    description: 'Sync invoice data to Airtable for custom workflows and reporting.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Airtable_Logo.svg/200px-Airtable_Logo.svg.png',
    category: 'analytics',
    comingSoon: true,
  },
];

const categories = {
  communication: 'Communication',
  productivity: 'Productivity',
  development: 'Development',
  analytics: 'Analytics & Accounting',
};

export const IntegrationsScreen = () => {
  const navigate = useNavigate();

  const groupedIntegrations = integrations.reduce((acc, integration) => {
    if (!acc[integration.category]) {
      acc[integration.category] = [];
    }
    acc[integration.category].push(integration);
    return acc;
  }, {} as Record<string, Integration[]>);

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
          <h1 className="text-xl md:text-[28px] font-semibold text-gray-900">Integrations</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-sm text-gray-600">Connect your favorite tools and automate your workflow</span>
          </div>
        </div>

        {/* Integration Categories */}
        {Object.entries(groupedIntegrations).map(([category, items]) => (
          <div key={category} className="mb-8 pb-8 border-b border-gray-200 last:border-b-0">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-gray-900">{categories[category as keyof typeof categories]}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((integration) => (
                <div
                  key={integration.id}
                  className="relative bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all group"
                >
                  {/* Coming Soon Badge */}
                  {integration.comingSoon && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        Coming soon
                      </span>
                    </div>
                  )}

                  {/* Connected Badge */}
                  {integration.connected && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        Available
                      </span>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Logo */}
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-white border border-gray-200 p-2 group-hover:border-gray-300 transition-colors">
                      <img
                        src={integration.logo}
                        alt={`${integration.name} logo`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          // Fallback to first letter if logo fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.fallback-text')) {
                            const fallback = document.createElement('div');
                            fallback.className = 'fallback-text w-full h-full flex items-center justify-center text-xl font-bold text-gray-400';
                            fallback.textContent = integration.name.charAt(0);
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 mb-1.5">{integration.name}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{integration.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Custom Integrations Card */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-[#635BFF] to-[#5045e5] rounded-lg p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Custom Integrations with Webhooks</h3>
                <p className="text-white/90 text-sm mb-4 leading-relaxed">
                  Build custom integrations using webhooks to receive real-time events for invoices, payments, and customers. Perfect for developers who want full control.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/webhooks')}
                  className="h-8 px-4 text-sm bg-white text-[#635BFF] border-white hover:bg-white/90 hover:text-[#5045e5]"
                >
                  Configure Webhooks
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 rounded-lg border border-blue-100 p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Need a specific integration?</span> Let us know what tools you'd like to connect and we'll prioritize building them. Reach out via{' '}
                <button onClick={() => navigate('/feedback')} className="text-[#635BFF] hover:underline font-medium">
                  feedback
                </button>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
