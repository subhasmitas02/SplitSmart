import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import AddRoommateModal from "../roommates/AddRoommateModal";

interface Roommate {
  id: number;
  user: {
    id: number;
    displayName: string;
    email: string;
    avatarInitials: string;
  };
  owedAmount: number;
}

export default function RoommateList() {
  const [isAddRoommateModalOpen, setIsAddRoommateModalOpen] = useState(false);
  
  // In a real app, this would fetch from API with the correct household ID
  // const householdId = 1;
  // const { data: roommates, isLoading } = useQuery({
  //   queryKey: [`/api/households/${householdId}/roommates`],
  // });
  
  // Mock data for demonstration
  const roommates: Roommate[] = [
    {
      id: 1,
      user: {
        id: 1,
        displayName: "Jamie Smith",
        email: "jamie@remote.co",
        avatarInitials: "JS",
      },
      owedAmount: 0
    },
    {
      id: 2,
      user: {
        id: 2,
        displayName: "Kim Lee",
        email: "kim@example.com",
        avatarInitials: "KL",
      },
      owedAmount: 78.44
    },
    {
      id: 3,
      user: {
        id: 3,
        displayName: "Mike Rodriguez",
        email: "mike@example.com",
        avatarInitials: "MR",
      },
      owedAmount: 600
    }
  ];
  
  const handleAddRoommate = () => {
    setIsAddRoommateModalOpen(true);
  };
  
  const handleCloseAddRoommateModal = () => {
    setIsAddRoommateModalOpen(false);
  };
  
  // In a real app, this ID would come from auth context
  const currentUserId = 1;
  
  return (
    <>
      <Card className="lg:col-span-1">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">Roommates</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAddRoommate}
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          <div className="space-y-3">
            {roommates.map(roommate => (
              <div key={roommate.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-slate-600">{roommate.user.avatarInitials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{roommate.user.displayName}</p>
                    <p className="text-xs text-slate-500">{roommate.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {roommate.user.id === currentUserId ? (
                    <Badge variant="success" className="text-xs font-medium px-2 py-1">You</Badge>
                  ) : roommate.owedAmount > 0 ? (
                    <Badge variant="warning" className="text-xs font-medium px-2 py-1">
                      Owes {formatCurrency(roommate.owedAmount)}
                    </Badge>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <AddRoommateModal isOpen={isAddRoommateModalOpen} onClose={handleCloseAddRoommateModal} />
    </>
  );
}
