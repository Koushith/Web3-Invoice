import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const revenueData = [
  { date: 'Jan 1', amount: 4000, invoices: 24 },
  { date: 'Jan 8', amount: 3000, invoices: 18 },
  { date: 'Jan 15', amount: 5000, invoices: 32 },
  { date: 'Jan 22', amount: 7000, invoices: 45 },
  { date: 'Jan 29', amount: 6000, invoices: 38 },
  { date: 'Feb 5', amount: 8000, invoices: 52 },
];

const pieData = [
  { name: 'Paid', value: 65, color: '#22c55e' },
  { name: 'Pending', value: 25, color: '#eab308' },
  { name: 'Overdue', value: 10, color: '#ef4444' },
];

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-8 py-10">
        {/* Header with time range selector */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Good morning, Koushith 👋</h1>
            <p className="text-gray-500 text-sm mt-1.5">Here's what's happening with your invoices today.</p>
          </div>
          <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-lg p-1 shadow-sm">
            <button className="text-sm text-gray-600 px-4 py-2 hover:bg-gray-50 rounded-md transition-all font-medium">Today</button>
            <button className="text-sm text-white px-4 py-2 bg-gradient-to-r from-[#635bff] to-[#5045e5] rounded-md shadow-sm font-medium">Week</button>
            <button className="text-sm text-gray-600 px-4 py-2 hover:bg-gray-50 rounded-md transition-all font-medium">Month</button>
            <button className="text-sm text-gray-600 px-4 py-2 hover:bg-gray-50 rounded-md transition-all font-medium">Year</button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-5 mb-12 w-full">
          {[
            {
              label: 'Total Revenue',
              value: '$42,350.00',
              change: '+12%',
              trend: '↗',
              trendColor: 'text-green-500',
              bgGradient: 'from-emerald-50 to-green-50/50',
              iconColor: 'text-emerald-600',
            },
            {
              label: 'Average Invoice',
              value: '$2,150.00',
              change: '+5%',
              trend: '↗',
              trendColor: 'text-blue-500',
              bgGradient: 'from-blue-50 to-indigo-50/50',
              iconColor: 'text-blue-600',
            },
            {
              label: 'Outstanding',
              value: '$12,350.00',
              subtext: '8 invoices',
              trend: '→',
              trendColor: 'text-orange-500',
              bgGradient: 'from-orange-50 to-amber-50/50',
              iconColor: 'text-orange-600',
            },
            {
              label: 'Paid',
              value: '$28,250.00',
              subtext: '23 invoices',
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
                <p className="text-[13px] text-gray-500 mt-1">Daily revenue overview</p>
              </div>
              <select className="text-sm border-gray-200 rounded-lg px-4 py-2 bg-gray-50/50 hover:bg-gray-100 transition-colors font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#635bff]/20">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            {[
              { status: 'paid', invoice: '#1234', time: '2h ago', color: 'bg-green-500' },
              { status: 'sent', invoice: '#1235', time: '4h ago', color: 'bg-blue-500' },
              { status: 'created', invoice: '#1236', time: '5h ago', color: 'bg-purple-500' },
              { status: 'paid', invoice: '#1237', time: '1d ago', color: 'bg-green-500' },
              { status: 'viewed', invoice: '#1238', time: '2d ago', color: 'bg-orange-500' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors rounded-lg px-2">
                <div className="flex items-center space-x-4">
                  <div className={`w-2.5 h-2.5 rounded-full ${activity.color} ring-4 ring-${activity.color}/10`} />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Invoice {activity.invoice} {activity.status}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                  </div>
                </div>
                <button className="text-xs text-gray-500 hover:text-gray-900 font-medium">View →</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
