import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { createUserInitials } from "@/lib/utils";

interface AddRoommateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const roommateSchema = z.object({
  displayName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RoommateFormValues = z.infer<typeof roommateSchema>;

export default function AddRoommateModal({ isOpen, onClose }: AddRoommateModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // In a real app, householdId would come from context/state
  const householdId = 1;
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RoommateFormValues>({
    resolver: zodResolver(roommateSchema),
    defaultValues: {
      displayName: "",
      email: "",
      username: "",
      password: "",
    }
  });
  
  const createRoommateMutation = useMutation({
    mutationFn: async (data: RoommateFormValues) => {
      // 1. Create a new user
      const userResponse = await apiRequest("POST", "/api/users", {
        username: data.username,
        password: data.password,
        email: data.email,
        displayName: data.displayName,
        avatarInitials: createUserInitials(data.displayName),
      });
      
      const user = await userResponse.json();
      
      // 2. Add the user as a roommate to the household
      const roommateResponse = await apiRequest("POST", "/api/roommates", {
        userId: user.id,
        householdId,
      });
      
      return await roommateResponse.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/households/${householdId}/roommates`] });
      toast({
        title: "Roommate added",
        description: "Your roommate has been successfully added to your household",
      });
      reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Failed to add roommate",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (data: RoommateFormValues) => {
    createRoommateMutation.mutate(data);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-800">Add New Roommate</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-2">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="displayName">Full Name</Label>
              <Input 
                id="displayName" 
                placeholder="e.g., John Doe" 
                {...register("displayName")} 
              />
              {errors.displayName && (
                <p className="text-xs text-red-500">{errors.displayName.message}</p>
              )}
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="e.g., john@example.com" 
                {...register("email")} 
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                placeholder="e.g., johndoe" 
                {...register("username")} 
              />
              {errors.username && (
                <p className="text-xs text-red-500">{errors.username.message}</p>
              )}
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password">Temporary Password</Label>
              <Input 
                id="password" 
                type="password"
                placeholder="Minimum 6 characters" 
                {...register("password")} 
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
              <p className="text-xs text-slate-500">
                Your roommate will be able to change this after logging in
              </p>
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
              disabled={createRoommateMutation.isPending}
            >
              {createRoommateMutation.isPending ? "Adding..." : "Add Roommate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
