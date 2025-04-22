import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Bell, Share } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import NewSplitModal from "../split-bills/NewSplitModal";

// Mock data - would come from API in real app
const mockSplitBills = [
  {
    id: 1,
    name: "May Rent",
    icon: "home",
    iconBg: "#6366f110",
    iconColor: "#6366f1",
    amount: 1800,
    dueDate: "2023-05-31",
    addedDate: "2023-05-01",
    splits: [
      { id: 1, userId: 1, userName: "Jamie Smith", initials: "JS", amount: 600, isPaid: true },
      { id: 2, userId: 2, userName: "Kim Lee", initials: "KL", amount: 600, isPaid: true },
      { id: 3, userId: 3, userName: "Mike Rodriguez", initials: "MR", amount: 600, isPaid: false },
    ]
  },
  {
    id: 2,
    name: "Costco Run",
    icon: "shopping-cart",
    iconBg: "#8b5cf610",
    iconColor: "#8b5cf6",
    amount: 156.88,
    dueDate: null,
    addedDate: "2023-05-18",
    splits: [
      { id: 4, userId: 1, userName: "Jamie Smith", initials: "JS", amount: 78.44, isPaid: true },
      { id: 5, userId: 2, userName: "Kim Lee", initials: "KL", amount: 78.44, isPaid: false },
    ]
  }
];

export default function SplitBills() {
  const [isNewSplitModalOpen, setIsNewSplitModalOpen] = useState(false);
  
  // In a real app, fetch data from API
  // const { data: splitBills, isLoading } = useQuery({
  //   queryKey: ['/api/split-bills'],
  // });
  
  const splitBills = mockSplitBills;
  
  const handleOpenNewSplitModal = () => {
    setIsNewSplitModalOpen(true);
  };
  
  const handleCloseNewSplitModal = () => {
    setIsNewSplitModalOpen(false);
  };
  
  const handleRemind = (splitId: number) => {
    console.log(`Remind for split ${splitId}`);
    // In a real app, would make API call to send reminder
  };
  
  const handleShare = (splitId: number) => {
    console.log(`Share split ${splitId}`);
    // In a real app, would open sharing options
  };
  
  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">Split Bills</h2>
            <Button onClick={handleOpenNewSplitModal} size="sm">New Split</Button>
          </div>
          <div className="space-y-4">
            {splitBills.map(bill => (
              <div key={bill.id} className="border border-slate-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                      style={{ backgroundColor: bill.iconBg }}
                    >
                      <i className={`fas fa-${bill.icon} text-xs`} style={{ color: bill.iconColor }}></i>
                    </div>
                    <h3 className="font-medium text-slate-800">{bill.name}</h3>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{formatCurrency(bill.amount)}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {bill.splits.map(split => (
                    <div key={split.id} className="text-center p-2 bg-slate-50 rounded">
                      <div className="w-6 h-6 rounded-full bg-slate-300 mx-auto mb-1 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-600">{split.initials}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-800">{formatCurrency(split.amount)}</p>
                      <p className={`text-xs ${split.isPaid ? 'text-success' : 'text-error'}`}>
                        {split.isPaid ? 'Paid' : 'Pending'}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    {bill.dueDate 
                      ? `Due: ${formatDate(bill.dueDate)}` 
                      : `Added: ${formatDate(bill.addedDate)}`}
                  </p>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 px-2 text-xs"
                      onClick={() => handleRemind(bill.id)}
                    >
                      <Bell className="h-3 w-3 mr-1" /> Remind
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 px-2 text-xs"
                      onClick={() => handleShare(bill.id)}
                    >
                      <Share className="h-3 w-3 mr-1" /> Share
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <NewSplitModal isOpen={isNewSplitModalOpen} onClose={handleCloseNewSplitModal} />
    </>
  );
}
