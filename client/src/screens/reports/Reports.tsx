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
  LineChart,
  Line,
} from 'recharts';
import { Download, TrendingUp, TrendingDown, DollarSign, Users, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const revenueData = [
  { month: 'Jan', revenue: 45000, expenses: 32000 },
  { month: 'Feb', revenue: 52000, expenses: 35000 },
  { month: 'Mar', revenue: 48000, expenses: 33000 },
  { month: 'Apr', revenue: 61000, expenses: 38000 },
  { month: 'May', revenue: 55000, expenses: 36000 },
  { month: 'Jun', revenue: 67000, expenses: 40000 },
];

const invoiceStatusData = [
  { name: 'Paid', value: 65, color: '#22c55e' },
  { name: 'Pending', value: 25, color: '#eab308' },
  { name: 'Overdue', value: 10, color: '#ef4444' },
];

const customerGrowthData = [
  { month: 'Jan', customers: 45 },
  { month: 'Feb', customers: 52 },
  { month: 'Mar', customers: 61 },
  { month: 'Apr', customers: 70 },
  { month: 'May', customers: 78 },
  { month: 'Jun', customers: 89 },
];

const topCustomers = [
  { name: 'Acme Corporation', amount: 45000, invoices: 12 },
  { name: 'Tech Solutions Inc', amount: 38000, invoices: 9 },
  { name: 'Global Industries', amount: 32000, invoices: 8 },
  { name: 'Innovate LLC', amount: 28000, invoices: 7 },
  { name: 'Future Tech', amount: 22000, invoices: 6 },
];

export const ReportsScreen = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-xl md:text-[26px] font-bold text-gray-900 tracking-tight">Reports & Analytics</h1>
            <p className="text-xs md:text-[14px] text-gray-500 mt-1 md:mt-1.5">Detailed insights into your business performance</p>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Select defaultValue="30days">
              <SelectTrigger className="h-9 md:h-10 w-[140px] md:w-[180px] border-gray-300 rounded-lg text-xs md:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="year">This year</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="h-9 md:h-10 px-3 md:px-4 border-gray-300 rounded-lg text-xs md:text-sm"
            >
              <Download className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Export Report</span>
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6 md:mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                <TrendingUp className="w-3 h-3" />
                +12.5%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">$156,420</p>
            <p className="text-xs text-gray-500 mt-1">Total Revenue</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-blue-600">
                <TrendingUp className="w-3 h-3" />
                +8.2%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">142</p>
            <p className="text-xs text-gray-500 mt-1">Total Invoices</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-50 to-violet-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-purple-600">
                <TrendingUp className="w-3 h-3" />
                +15.3%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">89</p>
            <p className="text-xs text-gray-500 mt-1">Active Customers</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
                <TrendingDown className="w-3 h-3" />
                -3.1%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">$12,350</p>
            <p className="text-xs text-gray-500 mt-1">Overdue Amount</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          {/* Revenue vs Expenses */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Revenue vs Expenses</h3>
                <p className="text-sm text-gray-500 mt-1">Monthly comparison</p>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#635bff" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#635bff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#635bff" fill="url(#colorRevenue)" strokeWidth={2} />
                  <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="url(#colorExpenses)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#635bff]"></div>
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                <span className="text-sm text-gray-600">Expenses</span>
              </div>
            </div>
          </div>

          {/* Invoice Status */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 md:p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Invoice Status</h3>
              <p className="text-sm text-gray-500 mt-1">Distribution overview</p>
            </div>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={invoiceStatusData}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                  >
                    {invoiceStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {invoiceStatusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Customer Growth */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 md:p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Customer Growth</h3>
              <p className="text-sm text-gray-500 mt-1">Monthly new customers</p>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={customerGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="customers"
                    stroke="#635bff"
                    strokeWidth={3}
                    dot={{ fill: '#635bff', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 md:p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Customers</h3>
              <p className="text-sm text-gray-500 mt-1">By revenue generated</p>
            </div>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{customer.name}</p>
                      <p className="text-xs text-gray-500">{customer.invoices} invoices</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-900">${customer.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
