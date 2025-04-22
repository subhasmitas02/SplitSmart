import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";

// Sample data for the chart
const mockData = [
  { date: 'Apr 15', totalExpenses: 850, userShare: 425 },
  { date: 'Apr 22', totalExpenses: 920, userShare: 480 },
  { date: 'Apr 29', totalExpenses: 1050, userShare: 510 },
  { date: 'May 6', totalExpenses: 980, userShare: 490 },
  { date: 'May 13', totalExpenses: 1150, userShare: 580 },
  { date: 'May 20', totalExpenses: 1245, userShare: 645 },
];

export default function ExpenseChart() {
  const [timeRange, setTimeRange] = useState("30days");
  
  // In a real app, this would fetch data from the backend
  // const { data, isLoading } = useQuery({
  //   queryKey: ['/api/expense-trends', timeRange],
  // });
  
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };
  
  // Using mock data for the demo
  const data = mockData;
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-sm rounded-md">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800">Expense Trend</h2>
          <Select onValueChange={handleTimeRangeChange} defaultValue={timeRange}>
            <SelectTrigger className="w-[160px] h-8 bg-slate-100 border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 5,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis 
                tickFormatter={(value) => `$${value}`} 
                tickLine={false} 
                axisLine={false}
                tickCount={5}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <Line
                name="Total Expenses"
                type="monotone"
                dataKey="totalExpenses"
                stroke="#6366f1"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                dot={{ r: 3 }}
                fill="url(#colorTotal)"
              />
              <Line
                name="Your Share"
                type="monotone"
                dataKey="userShare"
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
              />
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
