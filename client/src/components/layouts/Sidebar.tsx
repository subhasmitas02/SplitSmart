import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  avatarInitials: string;
}

interface SidebarProps {
  user: User;
  className?: string;
}

export default function Sidebar({ user, className }: SidebarProps) {
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  return (
    <aside className={cn("bg-white border-r border-slate-200", className)}>
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800">SplitSmart</h1>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <a 
          href="/" 
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors",
            isActive("/") && "bg-slate-100 text-primary font-medium"
          )}
        >
          <i className="fas fa-home"></i>
          <span>Dashboard</span>
        </a>
        <a 
          href="/expenses" 
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors",
            isActive("/expenses") && "bg-slate-100 text-primary font-medium"
          )}
        >
          <i className="fas fa-receipt"></i>
          <span>Expenses</span>
        </a>
        <a 
          href="/roommates" 
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors",
            isActive("/roommates") && "bg-slate-100 text-primary font-medium"
          )}
        >
          <i className="fas fa-users"></i>
          <span>Roommates</span>
        </a>
        <a 
          href="/split-bills" 
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors",
            isActive("/split-bills") && "bg-slate-100 text-primary font-medium"
          )}
        >
          <i className="fas fa-calculator"></i>
          <span>Split Bills</span>
        </a>
        <a 
          href="/reports" 
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors",
            isActive("/reports") && "bg-slate-100 text-primary font-medium"
          )}
        >
          <i className="fas fa-chart-pie"></i>
          <span>Reports</span>
        </a>
        <a 
          href="/settings" 
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors",
            isActive("/settings") && "bg-slate-100 text-primary font-medium"
          )}
        >
          <i className="fas fa-cog"></i>
          <span>Settings</span>
        </a>
      </nav>
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center">
            <span className="text-slate-600 font-bold">{user.avatarInitials}</span>
          </div>
          <div>
            <p className="font-medium text-sm">{user.displayName}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
