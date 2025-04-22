import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

interface User {
  id: number;
  username: string;
  displayName: string;
  email: string;
  avatarInitials: string;
}

interface Split {
  id: number;
  expenseId: number;
  userId: number;
  amount: number;
  isPaid: boolean;
  dueDate: string;
  user: User;
}

interface Expense {
  id: number;
  name: string;
  amount: number;
  date: string;
  notes: string;
  createdById: number;
  categoryId: number;
  category: Category;
  createdBy: User;
  splits: Split[];
}

interface RecentExpensesProps {
  expenses: Expense[];
}

export default function RecentExpenses({ expenses }: RecentExpensesProps) {
  if (!expenses) {
    return <RecentExpensesSkeleton />;
  }
  
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<string, string> = {
      "Rent": "home",
      "Utilities": "bolt",
      "Groceries": "shopping-basket",
      "Internet": "wifi",
      "Subscriptions": "tv",
      "Takeout": "utensils",
      "Transportation": "car",
      "Entertainment": "film",
      "Other": "tag"
    };
    
    return iconMap[categoryName] || "tag";
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800">Recent Expenses</h2>
          <a href="/expenses" className="text-sm font-medium text-primary hover:text-primary/80">View All</a>
        </div>
        <div className="divide-y divide-slate-200">
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <div key={expense.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: `${expense.category.color}10` }}
                  >
                    <i 
                      className={`fas fa-${getCategoryIcon(expense.category.name)}`} 
                      style={{ color: expense.category.color }}
                    ></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{expense.name}</p>
                    <p className="text-xs text-slate-500">{formatDate(expense.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800">{formatCurrency(expense.amount)}</p>
                  <p className="text-xs text-success">
                    Split with {expense.splits.length} {expense.splits.length === 1 ? 'person' : 'people'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-500">No recent expenses found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function RecentExpensesSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="divide-y divide-slate-200">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="py-3 flex items-center justify-between">
              <div className="flex items-center">
                <Skeleton className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
