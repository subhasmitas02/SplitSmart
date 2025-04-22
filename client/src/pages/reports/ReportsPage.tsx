import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Calendar, Download, BarChart as BarChartIcon, PieChart as PieChartIcon, TrendingUp } from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

// Sample data to showcase the charts since we'd fetch real data in a production app
const expenseTrendData = [
  { month: 'Jan', expenses: 950 },
  { month: 'Feb', expenses: 850 },
  { month: 'Mar', expenses: 1100 },
  { month: 'Apr', expenses: 1250 },
  { month: 'May', expenses: 1350 },
  { month: 'Jun', expenses: 1200 },
];

const categoryData = [
  { name: 'Rent', value: 38, color: '#6366f1' },
  { name: 'Utilities', value: 24, color: '#8b5cf6' },
  { name: 'Groceries', value: 18, color: '#f97316' },
  { name: 'Internet', value: 12, color: '#22c55e' },
  { name: 'Subscriptions', value: 8, color: '#ef4444' },
];

const roommateShareData = [
  { name: 'Jamie (You)', value: 645, color: '#6366f1' },
  { name: 'Kim', value: 325, color: '#8b5cf6' },
  { name: 'Mike', value: 275, color: '#f97316' },
];

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("3months");
  const [activeTab, setActiveTab] = useState("overview");
  
  // In a real app, these would fetch from API based on the selected time range
  // const { data: reportData, isLoading } = useQuery({
  //   queryKey: ['/api/reports', timeRange],
  // });
  
  // Simulating loading for demo
  const isLoading = false;
  
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const handleExportReport = () => {
    // In a real app, this would generate and download a report
    alert("This would download a report in a real application");
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-sm rounded-md">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color || entry.fill }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
          <p className="text-slate-500 mt-1">Analyze your spending patterns and trends</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Select onValueChange={handleTimeRangeChange} defaultValue={timeRange}>
            <SelectTrigger className="w-[160px]">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Time Range</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="mb-6" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bycategory">By Category</TabsTrigger>
          <TabsTrigger value="byroommate">By Roommate</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
      
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-500">Total Expenses</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(1245.32)}</p>
                  <p className="text-xs text-slate-500">For the selected period</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-500">Your Share</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(645.10)}</p>
                  <p className="text-xs text-slate-500">Amount you've paid</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-500">Monthly Average</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(415.11)}</p>
                  <p className="text-xs text-slate-500">Per month spending</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Expense Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={expenseTrendData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <Tooltip formatter={(value) => [`₹${value}`, 'Expenses']} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="expenses"
                        stroke="#6366f1"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Expense</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Date</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-600">Amount</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-600">Your Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4">May Rent</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center">
                          <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                          Rent
                        </span>
                      </td>
                      <td className="py-3 px-4">May 1, 2023</td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(1800)}</td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(600)}</td>
                    </tr>
                    <tr className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4">Electricity Bill</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center">
                          <div className="w-3 h-3 rounded-full bg-secondary mr-2"></div>
                          Utilities
                        </span>
                      </td>
                      <td className="py-3 px-4">May 12, 2023</td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(124.87)}</td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(41.62)}</td>
                    </tr>
                    <tr className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4">Costco Run</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center">
                          <div className="w-3 h-3 rounded-full bg-accent mr-2"></div>
                          Groceries
                        </span>
                      </td>
                      <td className="py-3 px-4">May 18, 2023</td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(156.88)}</td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(78.44)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bycategory" className="mt-0">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={categoryData.map(item => ({ name: item.name, value: item.value * 10 }))}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `₹${value}`} />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                    <Legend />
                    <Bar dataKey="value" name="Amount" fill="#6366f1">
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: `${category.color}15` }}>
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{category.name}</p>
                          <p className="text-sm text-slate-500">{category.value}% of total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-800">{formatCurrency(category.value * 15)}</p>
                        <p className="text-sm text-slate-500">Your share: {formatCurrency(category.value * 7)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Category Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((category, index) => (
                    <div key={index} className="p-3 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-slate-800">{category.name}</p>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                          <span className="text-sm font-medium text-green-500">+{Math.floor(Math.random() * 15)}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div className="h-2.5 rounded-full" style={{ width: `${category.value * 2}%`, backgroundColor: category.color }}></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-slate-500">Previous: {formatCurrency(category.value * 12)}</span>
                        <span className="text-xs text-slate-500">Current: {formatCurrency(category.value * 15)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="byroommate" className="mt-0">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Expenses by Roommate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={roommateShareData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" tickFormatter={(value) => `₹${value}`} />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                    <Legend />
                    <Bar dataKey="value" name="Amount" fill="#6366f1">
                      {roommateShareData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roommateShareData.map((roommate, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{roommate.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-3">
                      <span className="text-xl font-bold text-slate-700">
                        {roommate.name.charAt(0)}
                        {roommate.name.includes('(') 
                          ? 'S' 
                          : roommate.name.split(' ').length > 1 
                            ? roommate.name.split(' ')[1].charAt(0) 
                            : ''}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(roommate.value)}</h3>
                    <p className="text-sm text-slate-500">Total paid</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Share of Total</span>
                      <span className="text-sm font-medium">{Math.round(roommate.value / 1245 * 100)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Monthly Average</span>
                      <span className="text-sm font-medium">{formatCurrency(roommate.value / 3)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Status</span>
                      <span className="text-sm font-medium text-green-500">All Settled</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Expense Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={expenseTrendData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `₹${value}`} />
                      <Tooltip formatter={(value) => [`₹${value}`, 'Expenses']} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="expenses"
                        name="Total Expenses"
                        stroke="#6366f1"
                        strokeWidth={3}
                        dot={{ r: 6 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Expense Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="h-5 w-5 mr-2 text-success" />
                      <h3 className="font-semibold text-slate-800">Spending Trend</h3>
                    </div>
                    <p className="text-slate-600 mb-3">Your spending has increased by <span className="font-medium text-error">12%</span> compared to the previous period.</p>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600 mb-1">Biggest increase in: <span className="font-medium text-slate-800">Groceries (+24%)</span></p>
                      <p className="text-sm text-slate-600">Biggest decrease in: <span className="font-medium text-slate-800">Subscriptions (-8%)</span></p>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <PieChartIcon className="h-5 w-5 mr-2 text-primary" />
                      <h3 className="font-semibold text-slate-800">Category Distribution</h3>
                    </div>
                    <p className="text-slate-600 mb-3">Your top spending category is <span className="font-medium text-primary">Rent</span> at 38% of total expenses.</p>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600 mb-1">Most consistent: <span className="font-medium text-slate-800">Utilities (±3%)</span></p>
                      <p className="text-sm text-slate-600">Most variable: <span className="font-medium text-slate-800">Groceries (±14%)</span></p>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <BarChartIcon className="h-5 w-5 mr-2 text-secondary" />
                      <h3 className="font-semibold text-slate-800">Monthly Comparison</h3>
                    </div>
                    <p className="text-slate-600 mb-3">May was your <span className="font-medium text-error">highest</span> spending month at <span className="font-medium text-slate-800">{formatCurrency(1350)}</span>.</p>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600 mb-1">Highest month: <span className="font-medium text-slate-800">May ({formatCurrency(1350)})</span></p>
                      <p className="text-sm text-slate-600">Lowest month: <span className="font-medium text-slate-800">Feb ({formatCurrency(850)})</span></p>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-lightbulb mr-2 text-warning"></i>
                      <h3 className="font-semibold text-slate-800">Savings Opportunities</h3>
                    </div>
                    <p className="text-slate-600 mb-3">You could save approximately <span className="font-medium text-success">{formatCurrency(125)}</span> per month by optimizing your spending.</p>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600 mb-1">Potential savings: <span className="font-medium text-slate-800">Groceries ({formatCurrency(75)})</span></p>
                      <p className="text-sm text-slate-600">Also consider: <span className="font-medium text-slate-800">Subscriptions ({formatCurrency(50)})</span></p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}