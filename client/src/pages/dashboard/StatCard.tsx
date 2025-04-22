import { formatCurrency } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  change?: number;
  changeType?: "positive" | "negative" | "warning";
  icon: string;
  iconColor: string;
  suffix?: string;
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  changeType = "positive",
  icon, 
  iconColor,
  suffix = "$"
}: StatCardProps) {
  const formattedValue = suffix === "$" ? formatCurrency(value) : value.toString();
  
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-success";
      case "negative":
        return "text-error";
      case "warning":
        return "text-warning";
      default:
        return "text-success";
    }
  };
  
  const getChangeIcon = () => {
    switch (changeType) {
      case "positive":
        return "fa-arrow-up";
      case "negative":
        return "fa-arrow-down";
      default:
        return "fa-arrow-up";
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{formattedValue}</p>
          {change !== undefined && (
            <div className="flex items-center mt-1">
              <span className={`text-xs font-medium ${getChangeColor()} flex items-center`}>
                <i className={`fas ${getChangeIcon()} mr-1`}></i> {Math.abs(change)}%
              </span>
              <span className="text-xs text-slate-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${iconColor}10` }}
        >
          <i className={`fas fa-${icon}`} style={{ color: iconColor }}></i>
        </div>
      </div>
    </div>
  );
}
