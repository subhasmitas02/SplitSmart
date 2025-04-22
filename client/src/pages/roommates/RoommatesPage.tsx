import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { Plus, Search, UserPlus } from "lucide-react";
import AddRoommateModal from "./AddRoommateModal";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  displayName: string;
  email: string;
  avatarInitials: string;
}

interface Roommate {
  id: number;
  userId: number;
  householdId: number;
  user: User;
  owedAmount: number;
}

export default function RoommatesPage() {
  const [isAddRoommateModalOpen, setIsAddRoommateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // In a real app, this would come from context/state
  const householdId = 1;
  const currentUserId = 1;
  
  const { data: roommates, isLoading } = useQuery({
    queryKey: [`/api/households/${householdId}/roommates`],
  });
  
  const remindRoommateMutation = useMutation({
    mutationFn: async (roommateId: number) => {
      // In a real app, this would send a reminder to the roommate
      // For now, just simulate a success response
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Reminder sent",
        description: "Your roommate has been notified of their outstanding amount.",
        duration: 3000
      });
    },
    onError: () => {
      toast({
        title: "Failed to send reminder",
        description: "Please try again later.",
        variant: "destructive",
        duration: 3000
      });
    }
  });
  
  const filteredRoommates = roommates?.filter(roommate => 
    roommate.user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    roommate.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleOpenAddRoommateModal = () => {
    setIsAddRoommateModalOpen(true);
  };
  
  const handleCloseAddRoommateModal = () => {
    setIsAddRoommateModalOpen(false);
    // Refresh roommates after adding a new one
    queryClient.invalidateQueries({ queryKey: [`/api/households/${householdId}/roommates`] });
  };
  
  const handleRemindRoommate = (roommateId: number) => {
    remindRoommateMutation.mutate(roommateId);
  };
  
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Roommates</h1>
          <p className="text-slate-500 mt-1">Manage your roommates and track who owes what</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={handleOpenAddRoommateModal} size="sm">
            <UserPlus className="mr-2 h-4 w-4" /> Add Roommate
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Your Roommates</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <Input
                type="text"
                placeholder="Search roommates..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <Skeleton className="w-12 h-12 rounded-full mr-3" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                  <Skeleton className="h-9 w-24" />
                </div>
              ))}
            </div>
          ) : !filteredRoommates?.length ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <UserPlus className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">No roommates found</h3>
              <p className="text-slate-500 mb-4">
                {searchTerm ? "Try adjusting your search." : "Add roommates to start tracking shared expenses."}
              </p>
              <Button onClick={handleOpenAddRoommateModal}>
                <UserPlus className="mr-2 h-4 w-4" /> Add Your First Roommate
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRoommates.map(roommate => (
                <div key={roommate.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center mb-3 md:mb-0">
                    <div className="w-12 h-12 rounded-full bg-slate-300 flex items-center justify-center mr-4">
                      <span className="text-base font-bold text-slate-600">{roommate.user.avatarInitials}</span>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium text-slate-800">{roommate.user.displayName}</h3>
                        {roommate.user.id === currentUserId && (
                          <Badge variant="success" className="ml-2 text-xs">You</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">{roommate.user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3">
                    {roommate.owedAmount > 0 && roommate.user.id !== currentUserId ? (
                      <>
                        <Badge variant="warning" className="text-xs py-1 px-3">
                          Owes {formatCurrency(roommate.owedAmount)}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRemindRoommate(roommate.id)}
                          disabled={remindRoommateMutation.isPending}
                        >
                          <i className="fas fa-bell mr-2 text-xs"></i> 
                          Remind
                        </Button>
                      </>
                    ) : roommate.user.id === currentUserId ? (
                      <span className="text-sm text-slate-500">All settled up</span>
                    ) : (
                      <span className="text-sm text-green-500">All settled up</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Household Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Total Members</h3>
              <p className="text-2xl font-bold text-slate-800">{roommates?.length || 0}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Total Outstanding</h3>
              <p className="text-2xl font-bold text-slate-800">
                {formatCurrency(roommates?.reduce((sum, r) => sum + r.owedAmount, 0) || 0)}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Your Share Ratio</h3>
              <p className="text-2xl font-bold text-slate-800">
                {roommates?.length ? `1/${roommates.length}` : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <AddRoommateModal isOpen={isAddRoommateModalOpen} onClose={handleCloseAddRoommateModal} />
    </>
  );
}
