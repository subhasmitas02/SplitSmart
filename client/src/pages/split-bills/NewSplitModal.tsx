import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface NewSplitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const splitSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.string().min(1, "Amount is required").refine(val => !isNaN(parseFloat(val)), {
    message: "Amount must be a valid number",
  }),
  categoryId: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  splitType: z.enum(["equal", "custom"]),
  splitWith: z.array(z.number()),
  customSplits: z.record(z.string(), z.string()).optional(),
});

type SplitFormValues = z.infer<typeof splitSchema>;

export default function NewSplitModal({ isOpen, onClose }: NewSplitModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");
  
  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });
  
  // Fetch roommates
  const { data: roommates } = useQuery({
    queryKey: ['/api/households/1/roommates'],
  });
  
  const { control, register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<SplitFormValues>({
    resolver: zodResolver(splitSchema),
    defaultValues: {
      name: "",
      amount: "",
      categoryId: "",
      date: new Date().toISOString().split('T')[0],
      dueDate: "",
      notes: "",
      splitType: "equal",
      splitWith: [1], // Current user is always included
      customSplits: {},
    }
  });
  
  const selectedRoommates = watch("splitWith");
  const totalAmount = parseFloat(watch("amount") || "0");
  
  useEffect(() => {
    if (splitType === "equal") {
      // Clear any custom splits when switching to equal
      setValue("customSplits", {});
    }
  }, [splitType, setValue]);
  
  // Calculate equal split amount
  const equalSplitAmount = selectedRoommates.length > 0 
    ? (totalAmount / selectedRoommates.length).toFixed(2) 
    : "0.00";
  
  const createSplitMutation = useMutation({
    mutationFn: async (data: SplitFormValues) => {
      const amount = parseFloat(data.amount);
      const categoryId = parseInt(data.categoryId);
      
      // 1. Create the expense
      const expenseResponse = await apiRequest("POST", "/api/expenses", {
        name: data.name,
        amount,
        date: new Date(data.date),
        notes: data.notes,
        categoryId,
        createdById: 1, // Current user ID
      });
      
      const expense = await expenseResponse.json();
      
      // 2. Create the splits
      const splitPromises = data.splitWith.map(userId => {
        let splitAmount;
        
        if (data.splitType === "equal") {
          splitAmount = amount / data.splitWith.length;
        } else {
          // Use custom split amounts if provided
          const customAmount = data.customSplits?.[userId.toString()];
          splitAmount = customAmount ? parseFloat(customAmount) : amount / data.splitWith.length;
        }
        
        return apiRequest("POST", "/api/splits", {
          expenseId: expense.id,
          userId,
          amount: parseFloat(splitAmount.toFixed(2)),
          isPaid: userId === 1, // Current user's split is auto-paid
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
        });
      });
      
      await Promise.all(splitPromises);
      
      return expense;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users/1/splits'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users/1/dashboard'] });
      toast({
        title: "Split bill created",
        description: "Your split bill has been successfully created",
      });
      reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Failed to create split bill",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (data: SplitFormValues) => {
    createSplitMutation.mutate(data);
  };
  
  const handleRoommateSelection = (roommateId: number, checked: boolean) => {
    if (checked) {
      setValue("splitWith", [...selectedRoommates, roommateId]);
    } else {
      setValue("splitWith", selectedRoommates.filter(id => id !== roommateId));
    }
  };
  
  const handleCustomSplitChange = (userId: number, value: string) => {
    setValue(`customSplits.${userId}`, value);
  };
  
  useEffect(() => {
    if (isOpen) {
      reset({
        name: "",
        amount: "",
        categoryId: "",
        date: new Date().toISOString().split('T')[0],
        dueDate: "",
        notes: "",
        splitType: "equal",
        splitWith: [1], // Reset to just current user
        customSplits: {},
      });
      setSplitType("equal");
    }
  }, [isOpen, reset]);
  
  const getTotalCustomSplits = () => {
    if (!watch("customSplits")) return 0;
    
    return Object.values(watch("customSplits"))
      .reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  };
  
  const customSplitsTotal = getTotalCustomSplits();
  const isCustomSplitsValid = Math.abs(customSplitsTotal - totalAmount) < 0.01; // Allow small rounding errors
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md px-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-800">Create New Split</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-3 max-h-[60vh] overflow-y-auto pr-3 pl-1">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Split Name</Label>
              <Input 
                id="name" 
                placeholder="e.g., May Rent" 
                {...register("name")} 
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="amount">Total Amount</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-500">₹</span>
                </div>
                <Input 
                  id="amount" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  placeholder="0.00" 
                  className="pl-7" 
                  {...register("amount")} 
                />
              </div>
              {errors.amount && (
                <p className="text-xs text-red-500">{errors.amount.message}</p>
              )}
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="category">Category</Label>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && (
                <p className="text-xs text-red-500">{errors.categoryId.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  {...register("date")} 
                />
                {errors.date && (
                  <p className="text-xs text-red-500">{errors.date.message}</p>
                )}
              </div>
              
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="dueDate">Due Date (Optional)</Label>
                <Input 
                  id="dueDate" 
                  type="date" 
                  {...register("dueDate")} 
                />
              </div>
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label>Split Type</Label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="splitEqual" 
                    value="equal"
                    className="h-4 w-4 text-primary focus:ring-primary border-slate-300" 
                    checked={splitType === "equal"}
                    onChange={() => {
                      setSplitType("equal");
                      setValue("splitType", "equal");
                    }}
                  />
                  <label htmlFor="splitEqual" className="ml-2 block text-sm text-slate-700">
                    Split Equally
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="splitCustom" 
                    value="custom"
                    className="h-4 w-4 text-primary focus:ring-primary border-slate-300" 
                    checked={splitType === "custom"}
                    onChange={() => {
                      setSplitType("custom");
                      setValue("splitType", "custom");
                    }}
                  />
                  <label htmlFor="splitCustom" className="ml-2 block text-sm text-slate-700">
                    Custom Split
                  </label>
                </div>
              </div>
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label>Split with</Label>
              <div className="space-y-2 mt-1">
                {roommates?.map(roommate => {
                  const isCurrentUser = roommate.user.id === 1;
                  
                  return (
                    <div key={roommate.user.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`split-${roommate.user.id}`}
                        checked={selectedRoommates.includes(roommate.user.id)}
                        disabled={isCurrentUser} // Current user is always included
                        onCheckedChange={(checked) => 
                          handleRoommateSelection(roommate.user.id, checked as boolean)
                        }
                      />
                      <label htmlFor={`split-${roommate.user.id}`} className="text-sm text-slate-700">
                        {roommate.user.displayName} {isCurrentUser && "(You)"}
                      </label>
                      
                      {splitType === "custom" && selectedRoommates.includes(roommate.user.id) && (
                        <div className="relative ml-auto">
                          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                            <span className="text-xs text-slate-500">₹</span>
                          </div>
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            className="w-24 h-7 pl-6 py-1 text-xs"
                            placeholder="0.00"
                            value={watch(`customSplits.${roommate.user.id}`) || ""}
                            onChange={(e) => handleCustomSplitChange(roommate.user.id, e.target.value)}
                          />
                        </div>
                      )}
                      
                      {splitType === "equal" && selectedRoommates.includes(roommate.user.id) && (
                        <span className="ml-auto text-xs font-medium text-slate-600">
                          ₹{equalSplitAmount}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Validation for custom splits */}
              {splitType === "custom" && totalAmount > 0 && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-slate-600">
                    Total: ₹{customSplitsTotal.toFixed(2)} / ₹{totalAmount.toFixed(2)}
                  </span>
                  {!isCustomSplitsValid && (
                    <span className="text-xs text-red-500">
                      The total of all splits must equal the total amount
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea 
                id="notes" 
                placeholder="Add any details about this split..." 
                {...register("notes")} 
              />
            </div>
          </div>
          
          <DialogFooter className="mt-5 pt-3 pb-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-primary hover:bg-primary/90 ml-2 px-6"
              disabled={
                createSplitMutation.isPending || 
                (splitType === "custom" && !isCustomSplitsValid)
              }
            >
              {createSplitMutation.isPending ? "Adding..." : "Add Split"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
