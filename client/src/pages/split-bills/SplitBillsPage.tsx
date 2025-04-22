import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, Share2, Bell } from "lucide-react";
import NewSplitModal from "./NewSplitModal";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
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
  expense: {
    id: number;
    name: string;
    amount: number;
    date: string;
    categoryId: number;
  };
}

export default function SplitBillsPage() {
  const [isNewSplitModalOpen, setIsNewSplitModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // In a real app, the user ID would come from auth context
  const userId = 1;
  
  const { data: userSplits, isLoading } = useQuery({
    queryKey: [`/api/users/${userId}/splits`],
  });
  
  const updateSplitMutation = useMutation({
    mutationFn: async ({ splitId, isPaid }: { splitId: number; isPaid: boolean }) => {
      const response = await apiRequest("PATCH", `/api/splits/${splitId}`, { isPaid });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/splits`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/dashboard`] });
      toast({
        title: "Split updated",
        description: "The payment status has been updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  });
  
  const filteredSplits = userSplits?.filter(split => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return !split.isPaid;
    if (activeTab === "paid") return split.isPaid;
    return true;
  });
  
  const handleOpenNewSplitModal = () => {
    setIsNewSplitModalOpen(true);
  };
  
  const handleCloseNewSplitModal = () => {
    setIsNewSplitModalOpen(false);
    // Refresh splits after adding a new one
    queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/splits`] });
  };
  
  const handleMarkAsPaid = (splitId: number) => {
    updateSplitMutation.mutate({ splitId, isPaid: true });
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const remindRoommateMutation = useMutation({
    mutationFn: async (splitId: number) => {
      // In a real app, this would send a reminder about the split
      // For now, just simulate a success response
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Reminder sent",
        description: "Your roommate has been notified of their outstanding payment",
        duration: 3000
      });
    },
    onError: () => {
      toast({
        title: "Failed to send reminder",
        description: "Please try again later",
        variant: "destructive",
        duration: 3000
      });
    }
  });
  
  const handleRemind = (splitId: number) => {
    remindRoommateMutation.mutate(splitId);
  };
  
  const handleShare = (splitId: number) => {
    // In a real app, this would open sharing options or generate a share link
    const shareUrl = window.location.origin + `/share/split/${splitId}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Split Bill Payment Request',
        text: 'Please pay your share of our expense.',
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast({
          title: "Link copied!",
          description: "Share link has been copied to clipboard",
          duration: 3000
        });
      });
    }
  };
  
  const getTotalAmount = (type: 'all' | 'pending' | 'paid') => {
    if (!userSplits) return 0;
    
    return userSplits.reduce((sum, split) => {
      if (type === 'all' || 
          (type === 'pending' && !split.isPaid) || 
          (type === 'paid' && split.isPaid)) {
        return sum + split.amount;
      }
      return sum;
    }, 0);
  };
  
  // Group splits by expense
  const groupedSplits: Record<number, Split[]> = {};
  filteredSplits?.forEach(split => {
    if (!groupedSplits[split.expenseId]) {
      groupedSplits[split.expenseId] = [];
    }
    groupedSplits[split.expenseId].push(split);
  });
  
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Split Bills</h1>
          <p className="text-slate-500 mt-1">Track shared expenses and see who owes what</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={handleOpenNewSplitModal} size="sm">
            <Plus className="mr-2 h-4 w-4" /> New Split
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-500">Total Splits</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(getTotalAmount('all'))}</p>
              <p className="text-xs text-slate-500">Across {userSplits?.length || 0} expenses</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-500">Pending Payments</p>
              <p className="text-2xl font-bold text-error mt-1">{formatCurrency(getTotalAmount('pending'))}</p>
              <p className="text-xs text-slate-500">Amount you still owe</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-500">Paid</p>
              <p className="text-2xl font-bold text-success mt-1">{formatCurrency(getTotalAmount('paid'))}</p>
              <p className="text-xs text-slate-500">Amount you've already paid</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <CardTitle>Your Splits</CardTitle>
            <Tabs defaultValue="all" className="mt-2 md:mt-0" onValueChange={handleTabChange}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Skeleton className="w-8 h-8 rounded-full mr-2" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-16 rounded" />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !filteredSplits?.length ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Share2 className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">No split bills found</h3>
              <p className="text-slate-500 mb-4">
                {activeTab !== "all" 
                  ? `You don't have any ${activeTab} bills.` 
                  : "Start by adding a new split bill."}
              </p>
              <Button onClick={handleOpenNewSplitModal}>
                <Plus className="mr-2 h-4 w-4" /> New Split
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedSplits).map(([expenseId, splits]) => {
                const firstSplit = splits[0];
                const totalAmount = firstSplit.expense.amount;
                const yourSplit = splits.find(s => s.userId === userId);
                
                return (
                  <div key={expenseId} className="border border-slate-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                          <i className="fas fa-receipt text-xs text-primary"></i>
                        </div>
                        <h3 className="font-medium text-slate-800">{firstSplit.expense.name}</h3>
                      </div>
                      <span className="text-sm font-semibold text-slate-800">{formatCurrency(totalAmount)}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                      {splits.map(split => (
                        <div key={split.id} className="text-center p-2 bg-slate-50 rounded">
                          <div className="w-6 h-6 rounded-full bg-slate-300 mx-auto mb-1 flex items-center justify-center">
                            <span className="text-xs font-bold text-slate-600">{split.user.avatarInitials}</span>
                          </div>
                          <p className="text-xs font-medium text-slate-800">{formatCurrency(split.amount)}</p>
                          <p className={`text-xs ${split.isPaid ? 'text-success' : 'text-error'}`}>
                            {split.isPaid ? 'Paid' : 'Pending'}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <p className="text-xs text-slate-500 mb-2 sm:mb-0">
                        {firstSplit.dueDate ? `Due: ${formatDate(firstSplit.dueDate)}` : `Added: ${formatDate(firstSplit.expense.date)}`}
                      </p>
                      <div className="flex space-x-2">
                        {yourSplit && !yourSplit.isPaid && (
                          <Button 
                            variant="success" 
                            size="sm" 
                            className="h-7 px-2 text-xs"
                            onClick={() => handleMarkAsPaid(yourSplit.id)}
                            disabled={updateSplitMutation.isPending}
                          >
                            <i className="fas fa-check mr-1"></i> Mark as Paid
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 px-2 text-xs"
                          onClick={() => handleRemind(parseInt(expenseId))}
                          disabled={remindRoommateMutation.isPending}
                        >
                          <Bell className="h-3 w-3 mr-1" /> Remind
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 px-2 text-xs"
                          onClick={() => handleShare(parseInt(expenseId))}
                        >
                          <Share2 className="h-3 w-3 mr-1" /> Share
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      <NewSplitModal isOpen={isNewSplitModalOpen} onClose={handleCloseNewSplitModal} />
    </>
  );
}
