import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const expenseSchema = z.object({
  name: z.string().min(1, "Expense name is required"),
  amount: z.string().min(1, "Amount is required").refine(val => !isNaN(parseFloat(val)), {
    message: "Amount must be a valid number",
  }),
  categoryId: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
  splitWith: z.array(z.number()),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

export default function AddExpenseModal({ isOpen, onClose }: AddExpenseModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
  });
  
  // Fetch roommates
  const { data: roommates, isLoading: roommatesLoading } = useQuery({
    queryKey: ['/api/households/1/roommates'],
  });
  
  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      name: "",
      amount: "",
      categoryId: "",
      date: new Date().toISOString().split('T')[0],
      notes: "",
      splitWith: [1], // Current user is always included
    }
  });
  
  const selectedRoommates = watch("splitWith");
  
  const createExpenseMutation = useMutation({
    mutationFn: async (data: ExpenseFormValues) => {
      // First create the expense
      const amount = parseFloat(data.amount);
      const categoryId = parseInt(data.categoryId);
      
      const expenseResponse = await apiRequest("POST", "/api/expenses", {
        name: data.name,
        amount,
        date: new Date(data.date),
        notes: data.notes,
        categoryId,
        createdById: 1, // Current user ID
      });
      
      const expense = await expenseResponse.json();
      
      // Then create the splits
      const splitAmount = amount / data.splitWith.length;
      
      const splitPromises = data.splitWith.map(userId => 
        apiRequest("POST", "/api/splits", {
          expenseId: expense.id,
          userId,
          amount: splitAmount,
          isPaid: userId === 1, // Current user's split is auto-paid
          dueDate: new Date(data.date),
        })
      );
      
      await Promise.all(splitPromises);
      
      return expense;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users/1/dashboard'] });
      toast({
        title: "Expense added",
        description: "Your expense has been successfully added",
      });
      reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Failed to add expense",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (data: ExpenseFormValues) => {
    createExpenseMutation.mutate(data);
  };
  
  const handleRoommateSelection = (roommateId: number, checked: boolean) => {
    if (checked) {
      setValue("splitWith", [...selectedRoommates, roommateId]);
    } else {
      setValue("splitWith", selectedRoommates.filter(id => id !== roommateId));
    }
  };
  
  // Set default date to today when modal opens
  useEffect(() => {
    if (isOpen) {
      setValue("date", new Date().toISOString().split('T')[0]);
      setValue("splitWith", [1]); // Reset to just current user
    }
  }, [isOpen, setValue]);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-800">Add New Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-2">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Expense Name</Label>
              <Input 
                id="name" 
                placeholder="e.g., Grocery Shopping" 
                {...register("name")} 
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="amount">Amount</Label>
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
              <Select 
                onValueChange={(value) => setValue("categoryId", value)} 
                defaultValue=""
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesLoading ? (
                    <SelectItem value="" disabled>Loading categories...</SelectItem>
                  ) : categories && categories.length > 0 ? (
                    categories.map(category => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>No categories available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-xs text-red-500">{errors.categoryId.message}</p>
              )}
            </div>
            
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
              <Label>Split with</Label>
              <div className="space-y-2 mt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="splitCurrent" 
                    checked 
                    disabled 
                  />
                  <label htmlFor="splitCurrent" className="text-sm text-slate-700">
                    Jamie Smith (You)
                  </label>
                </div>
                
                {roommatesLoading ? (
                  <p className="text-sm text-slate-500">Loading roommates...</p>
                ) : roommates && roommates.length > 0 ? (
                  roommates
                    .filter(r => r.user.id !== 1) // Filter out current user
                    .map(roommate => (
                      <div key={roommate.user.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`split-${roommate.user.id}`}
                          checked={selectedRoommates.includes(roommate.user.id)}
                          onCheckedChange={(checked) => 
                            handleRoommateSelection(roommate.user.id, checked as boolean)
                          }
                        />
                        <label htmlFor={`split-${roommate.user.id}`} className="text-sm text-slate-700">
                          {roommate.user.displayName}
                        </label>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-slate-500">No other roommates found</p>
                )}
              </div>
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea 
                id="notes" 
                placeholder="Add any details about this expense..." 
                {...register("notes")} 
              />
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={createExpenseMutation.isPending}
            >
              {createExpenseMutation.isPending ? "Adding..." : "Add Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
