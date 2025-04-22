import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, Search, Filter, Download } from "lucide-react";
import AddExpenseModal from "./AddExpenseModal";
import { apiRequest } from "@/lib/queryClient";

interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

interface Expense {
  id: number;
  name: string;
  amount: number;
  date: string;
  notes: string;
  categoryId: number;
  createdById: number;
  category?: Category;
}

export default function ExpensesPage() {
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const queryClient = useQueryClient();
  
  // Fetch expenses
  const { data: expenses, isLoading: expensesLoading } = useQuery({
    queryKey: ['/api/expenses'],
  });
  
  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
  });
  
  const getCategoryDetails = (categoryId: number) => {
    return categories?.find(c => c.id === categoryId);
  };
  
  const filteredExpenses = expenses?.filter(expense => {
    const matchesCategory = filterCategory === "all" || expense.categoryId.toString() === filterCategory;
    const matchesSearch = !searchTerm || 
      expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.notes && expense.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  }) || [];
  
  const handleOpenAddExpenseModal = () => {
    setIsAddExpenseModalOpen(true);
  };
  
  const handleCloseAddExpenseModal = () => {
    setIsAddExpenseModalOpen(false);
    // Refresh expenses after adding a new one
    queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
  };
  
  const handleFilterChange = (value: string) => {
    setFilterCategory(value);
  };
  
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
  
  // Group expenses by month
  const groupedExpenses: Record<string, Expense[]> = {};
  filteredExpenses.forEach(expense => {
    const date = new Date(expense.date);
    const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    if (!groupedExpenses[monthYear]) {
      groupedExpenses[monthYear] = [];
    }
    
    groupedExpenses[monthYear].push(expense);
  });
  
  // Sort month-year groups in descending order
  const sortedMonths = Object.keys(groupedExpenses).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime();
  });
  
  const isLoading = expensesLoading || categoriesLoading;
  
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Expenses</h1>
          <p className="text-slate-500 mt-1">Track and manage your expenses</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button onClick={handleOpenAddExpenseModal} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Expense
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <Input
              type="text"
              placeholder="Search expenses..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Select onValueChange={handleFilterChange} defaultValue={filterCategory}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <span>{filterCategory === "all" ? "All Categories" : "Filter by Category"}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map(category => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <ExpensesListSkeleton />
      ) : filteredExpenses.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-10">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">No expenses found</h3>
              <p className="text-slate-500 mb-4">Try adjusting your search or filter to find what you're looking for.</p>
              <Button onClick={handleOpenAddExpenseModal}>
                <Plus className="mr-2 h-4 w-4" /> Add Your First Expense
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedMonths.map(monthYear => (
            <div key={monthYear}>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">{monthYear}</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="divide-y divide-slate-200">
                    {groupedExpenses[monthYear].map(expense => {
                      const category = getCategoryDetails(expense.categoryId);
                      return (
                        <div key={expense.id} className="py-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                              style={{ backgroundColor: category ? `${category.color}10` : '#e5e7eb' }}
                            >
                              <i 
                                className={`fas fa-${category ? getCategoryIcon(category.name) : 'tag'}`} 
                                style={{ color: category?.color || '#6b7280' }}
                              ></i>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-800">{expense.name}</p>
                              <p className="text-xs text-slate-500">{formatDate(expense.date)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-slate-800">{formatCurrency(expense.amount)}</p>
                            <p className="text-xs text-slate-500">{category?.name || 'Uncategorized'}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
      
      <AddExpenseModal isOpen={isAddExpenseModalOpen} onClose={handleCloseAddExpenseModal} />
    </>
  );
}

function ExpensesListSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="py-3 flex items-center justify-between">
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
