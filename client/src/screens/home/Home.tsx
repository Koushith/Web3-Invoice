import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useGetDashboardMetricsQuery, useGetRevenueChartQuery, useGetInvoicesQuery, useGetProfileQuery } from '@/services/api.service';
import { Loader2 } from 'lucide-react';

type TimePeriod = 'week' | 'month' | 'year';

export const HomePage = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');

  // Fetch data
  const { data: profile } = useGetProfileQuery();
  const { data: metrics, isLoading: metricsLoading } = useGetDashboardMetricsQuery({});
  const { data: revenueData, isLoading: revenueLoading } = useGetRevenueChartQuery({ period: timePeriod });
  const { data: recentInvoices, isLoading: invoicesLoading } = useGetInvoicesQuery({
    page: 1,
    limit: 5,
    sort: 'updatedAt',
    order: 'desc'
  });

  // Calculate pie chart data from metrics
  const pieData = useMemo(() => {
    if (!metrics) return [];

    const total = metrics.totalInvoices || 1;
    const paidCount = metrics.paidInvoices || 0;
    const pendingCount = metrics.pendingInvoices || 0;
    const overdueCount = metrics.overdueInvoices || 0;

    return [
      {
        name: 'Paid',
        value: Math.round((paidCount / total) * 100),
        color: '#22c55e',
        count: paidCount
      },
      {
        name: 'Pending',
        value: Math.round((pendingCount / total) * 100),
        color: '#eab308',
        count: pendingCount
      },
      {
        name: 'Overdue',
        value: Math.round((overdueCount / total) * 100),
        color: '#ef4444',
        count: overdueCount
      },
    ].filter(item => item.value > 0);
  }, [metrics]);

  const isLoading = metricsLoading || revenueLoading || invoicesLoading;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Get relative time
  const getRelativeTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1d ago';
    return `${diffInDays}d ago`;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-500';
      case 'sent':
        return 'bg-blue-500';
      case 'draft':
        return 'bg-purple-500';
      case 'overdue':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FEFFFE] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  const userName = profile?.displayName || profile?.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen bg-[#FEFFFE]">
      <div className="w-full px-8 py-10">
        {/* Header with time range selector */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Good morning, {userName} 👋</h1>
            <p className="text-gray-500 text-sm mt-1.5">Here's what's happening with your invoices today.</p>
          </div>
          <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setTimePeriod('week')}
              className={`text-sm px-4 py-2 rounded-md transition-all font-medium ${
                timePeriod === 'week'
                  ? 'text-white bg-gradient-to-r from-[#635bff] to-[#5045e5] shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimePeriod('month')}
              className={`text-sm px-4 py-2 rounded-md transition-all font-medium ${
                timePeriod === 'month'
                  ? 'text-white bg-gradient-to-r from-[#635bff] to-[#5045e5] shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimePeriod('year')}
              className={`text-sm px-4 py-2 rounded-md transition-all font-medium ${
                timePeriod === 'year'
                  ? 'text-white bg-gradient-to-r from-[#635bff] to-[#5045e5] shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Year
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-5 mb-12 w-full">
          {[
            {
              label: 'Total Revenue',
              value: formatCurrency(metrics?.totalRevenue || 0),
              change: metrics?.revenueChange ? `${metrics.revenueChange > 0 ? '+' : ''}${metrics.revenueChange.toFixed(1)}%` : undefined,
              trend: metrics?.revenueChange && metrics.revenueChange > 0 ? '↗' : '→',
              trendColor: metrics?.revenueChange && metrics.revenueChange > 0 ? 'text-green-500' : 'text-gray-500',
              bgGradient: 'from-emerald-50 to-green-50/50',
              iconColor: 'text-emerald-600',
            },
            {
              label: 'Average Invoice',
              value: formatCurrency(metrics?.averageInvoiceValue || 0),
              change: undefined,
              trend: '→',
              trendColor: 'text-blue-500',
              bgGradient: 'from-blue-50 to-indigo-50/50',
              iconColor: 'text-blue-600',
            },
            {
              label: 'Outstanding',
              value: formatCurrency(metrics?.outstandingAmount || 0),
              subtext: `${metrics?.pendingInvoices || 0} invoices`,
              trend: '→',
              trendColor: 'text-orange-500',
              bgGradient: 'from-orange-50 to-amber-50/50',
              iconColor: 'text-orange-600',
            },
            {
              label: 'Paid',
              value: formatCurrency(metrics?.paidAmount || 0),
              subtext: `${metrics?.paidInvoices || 0} invoices`,
              trend: '↗',
              trendColor: 'text-green-500',
              bgGradient: 'from-violet-50 to-purple-50/50',
              iconColor: 'text-violet-600',
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className={`relative bg-gradient-to-br ${metric.bgGradient} border border-gray-200/50 rounded-xl p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group cursor-pointer overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[13px] font-semibold text-gray-600 uppercase tracking-wide">{metric.label}</p>
                  <span className={`text-2xl ${metric.trendColor} font-bold`}>{metric.trend}</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</p>
                <p className="text-sm text-gray-600">
                  {metric.change && <span className={`font-semibold ${metric.trendColor}`}>{metric.change}</span>}
                  {metric.subtext && <span className="text-gray-500">{metric.subtext}</span>}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-2 gap-6 mb-12 w-full">
          {/* Revenue Chart */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-7 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-[17px] font-semibold text-gray-900">Revenue</h2>
                <p className="text-[13px] text-gray-500 mt-1">Revenue overview for {timePeriod}</p>
              </div>
            </div>
            <div className="h-[300px] w-full">
              {revenueLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#635bff" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#635bff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                      }}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#635bff" fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Status Chart */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-7 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6">
              <h2 className="text-[17px] font-semibold text-gray-900">Invoice Status</h2>
              <p className="text-[13px] text-gray-500 mt-1">Distribution overview</p>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="w-full bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-7 shadow-sm">
          <h3 className="text-[17px] font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-0">
            {invoicesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : recentInvoices && recentInvoices.data.length > 0 ? (
              recentInvoices.data.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors rounded-lg px-2"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(invoice.status)} ring-4 ring-${getStatusColor(invoice.status)}/10`} />
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        Invoice #{invoice.invoiceNumber} - {invoice.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {invoice.customer?.name || 'Unknown'} • {getRelativeTime(invoice.updatedAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.location.href = `/invoices/${invoice.id}`}
                    className="text-xs text-gray-500 hover:text-gray-900 font-medium"
                  >
                    View →
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                No recent activity
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
