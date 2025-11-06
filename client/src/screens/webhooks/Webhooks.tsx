import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Webhook, Plus, MoreVertical, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  lastDelivery: string;
  successRate: number;
  created: string;
}

interface WebhookLog {
  id: string;
  event: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: string;
  responseCode: number;
  duration: number;
}

export const WebhooksScreen = () => {
  const [showNewWebhookModal, setShowNewWebhookModal] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());

  const webhooks: WebhookEndpoint[] = [
    {
      id: '1',
      url: 'https://api.example.com/webhooks/invoice',
      events: ['invoice.created', 'invoice.paid', 'invoice.failed'],
      status: 'active',
      lastDelivery: '2024-02-15T10:30:00Z',
      successRate: 98.5,
      created: '2024-01-10',
    },
    {
      id: '2',
      url: 'https://api.myapp.com/webhooks',
      events: ['payment.received', 'customer.created'],
      status: 'active',
      lastDelivery: '2024-02-14T15:20:00Z',
      successRate: 100,
      created: '2024-01-15',
    },
  ];

  const recentLogs: WebhookLog[] = [
    {
      id: '1',
      event: 'invoice.paid',
      status: 'success',
      timestamp: '2024-02-15T10:30:00Z',
      responseCode: 200,
      duration: 245,
    },
    {
      id: '2',
      event: 'invoice.created',
      status: 'success',
      timestamp: '2024-02-15T09:15:00Z',
      responseCode: 200,
      duration: 189,
    },
    {
      id: '3',
      event: 'payment.received',
      status: 'failed',
      timestamp: '2024-02-14T18:45:00Z',
      responseCode: 500,
      duration: 1023,
    },
  ];

  const availableEvents = [
    { id: 'invoice.created', label: 'Invoice Created', description: 'When a new invoice is created' },
    { id: 'invoice.paid', label: 'Invoice Paid', description: 'When an invoice is marked as paid' },
    { id: 'invoice.failed', label: 'Invoice Failed', description: 'When a payment fails' },
    { id: 'invoice.overdue', label: 'Invoice Overdue', description: 'When an invoice becomes overdue' },
    { id: 'payment.received', label: 'Payment Received', description: 'When a payment is received' },
    { id: 'customer.created', label: 'Customer Created', description: 'When a new customer is added' },
    { id: 'customer.updated', label: 'Customer Updated', description: 'When customer details are changed' },
  ];

  const toggleEvent = (eventId: string) => {
    setSelectedEvents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-[1200px] mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Webhooks</h1>
          <p className="text-sm text-gray-500 mt-2">Configure webhooks to receive real-time notifications</p>
        </div>

        {/* Create New Webhook Button */}
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => setShowNewWebhookModal(true)}
            className="bg-gradient-to-r from-[#635bff] to-[#5045e5] hover:from-[#5045e5] hover:to-[#3d38d1] text-white rounded-lg h-10 px-5 text-[13px] font-semibold shadow-lg shadow-[#635bff]/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Endpoint
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Webhook Endpoints */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Endpoints</h2>
            {webhooks.map((webhook) => (
              <div
                key={webhook.id}
                className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center flex-shrink-0">
                      <Webhook className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm font-mono text-gray-900 font-medium truncate">{webhook.url}</code>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${
                            webhook.status === 'active'
                              ? 'bg-green-50 text-green-700 ring-1 ring-green-200/50'
                              : 'bg-gray-50 text-gray-700 ring-1 ring-gray-200/50'
                          }`}
                        >
                          {webhook.status.charAt(0).toUpperCase() + webhook.status.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {webhook.successRate}% success rate
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>

                {/* Events */}
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-500 mb-2">LISTENING TO</p>
                  <div className="flex flex-wrap gap-2">
                    {webhook.events.map((event) => (
                      <span
                        key={event}
                        className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-gray-50 text-gray-700 rounded-md border border-gray-200"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span>
                    Created{' '}
                    {new Date(webhook.created).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span>
                    Last delivery{' '}
                    {new Date(webhook.lastDelivery).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Deliveries</h2>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-5 shadow-sm">
              <div className="space-y-4">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {log.status === 'success' ? (
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : log.status === 'failed' ? (
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        )}
                        <span className="text-sm font-medium text-gray-900">{log.event}</span>
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          log.status === 'success'
                            ? 'text-green-600'
                            : log.status === 'failed'
                            ? 'text-red-600'
                            : 'text-yellow-600'
                        }`}
                      >
                        {log.responseCode}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 ml-6">
                      <span>
                        {new Date(log.timestamp).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span>{log.duration}ms</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* New Webhook Modal */}
        {showNewWebhookModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                  <Webhook className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Add Webhook Endpoint</h2>
                  <p className="text-sm text-gray-500">Configure a new webhook to receive events</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="webhook-url" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Endpoint URL
                  </Label>
                  <Input
                    id="webhook-url"
                    type="url"
                    placeholder="https://api.example.com/webhooks"
                    className="h-11 border-gray-300 rounded-lg font-mono text-sm"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                    Events to Send
                  </Label>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {availableEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{event.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{event.description}</p>
                        </div>
                        <Switch
                          checked={selectedEvents.has(event.id)}
                          onCheckedChange={() => toggleEvent(event.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200/60 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    <strong>Note:</strong> Your endpoint must respond with a 2xx status code within 5 seconds to be considered successful.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowNewWebhookModal(false)}
                  className="flex-1 h-11 border-gray-300 rounded-lg"
                >
                  Cancel
                </Button>
                <Button className="flex-1 h-11 bg-gradient-to-r from-[#635bff] to-[#5045e5] hover:from-[#5045e5] hover:to-[#3d38d1] text-white rounded-lg font-semibold shadow-lg shadow-[#635bff]/20">
                  Add Endpoint
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
