import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

interface CategoryExpense {
  category: Category;
  total: number;
  percentage: number;
}

interface CategoryChartProps {
  categories: CategoryExpense[];
}

export default function CategoryChart({ categories }: CategoryChartProps) {
  const [timeRange, setTimeRange] = useState("thisMonth");
  
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };
  
  // Format data for the chart
  const chartData = categories.map(item => ({
    name: item.category.name,
    value: item.percentage,
    color: item.category.color,
    amount: item.total
  }));
  
  // If no data, show placeholder
  if (chartData.length === 0) {
    chartData.push(
      { name: 'No Data', value: 100, color: '#e5e7eb', amount: 0 }
    );
  }
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-sm rounded-md">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-sm" style={{ color: data.color }}>
            {formatCurrency(data.amount)} ({data.value}%)
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800">Expenses by Category</h2>
          <Select onValueChange={handleTimeRangeChange} defaultValue={timeRange}>
            <SelectTrigger className="w-[120px] h-8 bg-slate-100 border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">This month</SelectItem>
              <SelectItem value="lastMonth">Last month</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="thisYear">This year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={1}
                  dataKey="value"
                  label={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-slate-700">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
