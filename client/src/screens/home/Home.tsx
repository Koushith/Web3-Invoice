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
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-[22px] text-gray-900">Good morning, Alex 👋</h1>
            <p className="text-gray-500 text-sm mt-1">Here's what's happening with your invoices today.</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="text-sm text-gray-600 px-3 py-1.5 hover:bg-gray-50 rounded-md">Today</button>
            <button className="text-sm text-white px-3 py-1.5 bg-[#635bff] rounded-md">Week</button>
            <button className="text-sm text-gray-600 px-3 py-1.5 hover:bg-gray-50 rounded-md">Month</button>
            <button className="text-sm text-gray-600 px-3 py-1.5 hover:bg-gray-50 rounded-md">Year</button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-6 mb-12 w-full">
          {[
            {
              label: 'Total Revenue',
              value: '$42,350.00',
              change: '+12%',
              trend: '↗',
              trendColor: 'text-green-500',
            },
            {
              label: 'Average Invoice',
              value: '$2,150.00',
              change: '+5%',
              trend: '↗',
              trendColor: 'text-green-500',
            },
            {
              label: 'Outstanding',
              value: '$12,350.00',
              subtext: '8 invoices',
              trend: '↘',
              trendColor: 'text-red-500',
            },
            {
              label: 'Paid',
              value: '$28,250.00',
              subtext: '23 invoices',
              trend: '↗',
              trendColor: 'text-green-500',
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="border border-gray-100 rounded-lg p-6 hover:border-[#635bff] transition-colors"
            >
              <div className="flex justify-between items-start">
                <p className="text-sm text-gray-500">{metric.label}</p>
                <span className={`text-xl ${metric.trendColor}`}>{metric.trend}</span>
              </div>
              <p className="text-2xl mt-2 text-gray-900">{metric.value}</p>
              <p className="text-sm mt-1 text-gray-500">
                {metric.change && <span className="text-green-600">{metric.change}</span>}
                {metric.subtext && metric.subtext}
              </p>
            </div>
          ))}
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-2 gap-8 mb-12 w-full">
          {/* Revenue Chart */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-[15px] font-medium text-gray-900">Revenue</h2>
                <p className="text-sm text-gray-500 mt-1">Daily revenue overview</p>
              </div>
              <select className="text-sm border-gray-200 rounded-md px-3 py-1.5">
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
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-[15px] font-medium text-gray-900">Invoice Status</h2>
              <p className="text-sm text-gray-500 mt-1">Distribution overview</p>
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
        <div className="w-full border border-gray-200 rounded-lg p-6">
          <h3 className="text-[15px] font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-900">Invoice #1234 paid</span>
                </div>
                <span className="text-sm text-gray-500">2h ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
