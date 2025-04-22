import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import StatCard from "./StatCard";
import ExpenseChart from "./ExpenseChart";
import CategoryChart from "./CategoryChart";
import RecentExpenses from "./RecentExpenses";
import SplitBills from "./SplitBills";
import RoommateList from "./RoommateList";
import SocialSharing from "./SocialSharing";
import AddExpenseModal from "../expenses/AddExpenseModal";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";

export default function Dashboard() {
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  
  // In a real app, the user ID would come from auth context
  const userId = 1;
  
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: [`/api/users/${userId}/dashboard`],
  });
  
  const openAddExpenseModal = () => {
    setIsAddExpenseModalOpen(true);
  };
  
  const closeAddExpenseModal = () => {
    setIsAddExpenseModalOpen(false);
  };
  
  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Track expenses, split bills, and manage your finances</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button onClick={openAddExpenseModal} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Expense
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-lg shadow-sm p-4 border border-slate-200 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
              <div className="h-6 bg-slate-200 rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
          Error loading dashboard data. Please try again.
        </div>
      ) : (
        <>
          {/* Dashboard Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard 
              title="Total Expenses" 
              value={dashboardData?.totalExpenses || 0} 
              change={8.2} 
              changeType="positive" 
              icon="dollar-sign" 
              iconColor="#6366f1" 
            />
            
            <StatCard 
              title="Your Share" 
              value={dashboardData?.userShare || 0} 
              change={-3.1} 
              changeType="negative" 
              icon="user" 
              iconColor="#8b5cf6" 
            />
            
            <StatCard 
              title="Outstanding" 
              value={dashboardData?.outstandingAmount || 0} 
              change={12.4} 
              changeType="warning" 
              icon="clock" 
              iconColor="#f59e0b" 
            />
            
            <StatCard 
              title="Roommates" 
              value={dashboardData?.roommateCount || 0} 
              suffix="" 
              icon="users" 
              iconColor="#f97316" 
            />
          </div>
          
          {/* Expense & Category Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ExpenseChart />
            <CategoryChart categories={dashboardData?.expensesByCategory || []} />
          </div>
          
          {/* Recent Expenses & Split Bills Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <RecentExpenses expenses={dashboardData?.recentExpenses || []} />
            <SplitBills />
          </div>
          
          {/* Roommates & Sharing Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RoommateList />
            <SocialSharing />
          </div>
        </>
      )}
      
      <AddExpenseModal isOpen={isAddExpenseModalOpen} onClose={closeAddExpenseModal} />
    </>
  );
}
