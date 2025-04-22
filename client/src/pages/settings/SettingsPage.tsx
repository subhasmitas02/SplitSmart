import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // In a real app, these would come from API or context
  const [user, setUser] = useState({
    id: 1,
    displayName: "Jamie Smith",
    email: "jamie@remote.co",
    username: "jamie",
    avatarInitials: "JS"
  });
  
  const [household, setHousehold] = useState({
    id: 1,
    name: "Our Apartment",
    createdById: 1
  });
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    expenseReminders: true,
    paymentReminders: true,
    weeklyReport: true,
    newRoommateJoined: true
  });
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    displayName: user.displayName,
    email: user.email,
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [householdForm, setHouseholdForm] = useState({
    name: household.name
  });
  
  // Handle form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleHouseholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHouseholdForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationChange = (setting: string, checked: boolean) => {
    setNotifications(prev => ({ ...prev, [setting]: checked }));
  };
  
  // Form submissions
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would make an API call to update the profile
    setUser(prev => ({
      ...prev,
      displayName: profileForm.displayName,
      email: profileForm.email
    }));
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully",
    });
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match",
        variant: "destructive"
      });
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would make an API call to update the password
    
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully",
    });
    
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };
  
  const handleHouseholdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would make an API call to update the household name
    setHousehold(prev => ({
      ...prev,
      name: householdForm.name
    }));
    
    toast({
      title: "Household updated",
      description: "Your household information has been updated successfully",
    });
  };
  
  const handleSaveNotifications = () => {
    // In a real app, you would make an API call to update notification settings
    
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated",
    });
  };
  
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your account and preferences</p>
        </div>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="household">Household</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 text-xl font-bold">
                    {user.avatarInitials}
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800">{user.displayName}</h3>
                    <p className="text-sm text-slate-500">@{user.username}</p>
                  </div>
                </div>
                
                <div className="grid gap-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="displayName">Full Name</Label>
                    <Input 
                      id="displayName" 
                      name="displayName"
                      value={profileForm.displayName} 
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      value={profileForm.email} 
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      value={user.username} 
                      disabled
                      className="bg-slate-50"
                    />
                    <p className="text-xs text-slate-500">Username cannot be changed</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>Manage linked accounts and services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-[#1877f2] flex items-center justify-center mr-3">
                      <i className="fab fa-facebook-f text-white"></i>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Facebook</p>
                      <p className="text-sm text-slate-500">Share expense reports</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-[#1da1f2] flex items-center justify-center mr-3">
                      <i className="fab fa-twitter text-white"></i>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Twitter</p>
                      <p className="text-sm text-slate-500">Share expense reports</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-[#25D366] flex items-center justify-center mr-3">
                      <i className="fab fa-whatsapp text-white"></i>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">WhatsApp</p>
                      <p className="text-sm text-slate-500">Share bills with contacts</p>
                    </div>
                  </div>
                  <Badge variant="success" className="mr-2">Connected</Badge>
                  <Button variant="outline" size="sm">Disconnect</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      name="currentPassword"
                      type="password" 
                      value={passwordForm.currentPassword} 
                      onChange={handlePasswordChange}
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      name="newPassword"
                      type="password" 
                      value={passwordForm.newPassword} 
                      onChange={handlePasswordChange}
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword"
                      type="password" 
                      value={passwordForm.confirmPassword} 
                      onChange={handlePasswordChange}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">Update Password</Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">Two-Factor Authentication</p>
                    <p className="text-sm text-slate-500">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">Active Sessions</p>
                    <p className="text-sm text-slate-500">Manage and log out from other devices</p>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800 text-red-500">Delete Account</p>
                    <p className="text-sm text-slate-500">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive">Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="household" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Household Settings</CardTitle>
              <CardDescription>Manage your household information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleHouseholdSubmit} className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="householdName">Household Name</Label>
                    <Input 
                      id="householdName" 
                      name="name"
                      value={householdForm.name} 
                      onChange={handleHouseholdChange}
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-1.5">
                    <Label>Role</Label>
                    <div className="flex items-center space-x-2">
                      <Badge variant="primary">Admin</Badge>
                      <p className="text-sm text-slate-600">You created this household</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Manage how you pay and receive money</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">Default Currency</p>
                    <p className="text-sm text-slate-500">Set your preferred currency for transactions</p>
                  </div>
                  <div className="flex items-center">
                    <Badge className="mr-2">USD ($)</Badge>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">Payment Methods</p>
                    <p className="text-sm text-slate-500">Add or remove payment methods</p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">Invite Links</p>
                    <p className="text-sm text-slate-500">Create and manage links to invite new roommates</p>
                  </div>
                  <Button variant="outline" size="sm">Create Link</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">Email Notifications</p>
                    <p className="text-sm text-slate-500">Receive notifications to your email address</p>
                  </div>
                  <Switch 
                    checked={notifications.emailNotifications} 
                    onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)} 
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">Expense Reminders</p>
                    <p className="text-sm text-slate-500">Get reminded about upcoming or due expenses</p>
                  </div>
                  <Switch 
                    checked={notifications.expenseReminders} 
                    onCheckedChange={(checked) => handleNotificationChange('expenseReminders', checked)} 
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">Payment Reminders</p>
                    <p className="text-sm text-slate-500">Get reminded when payments are due</p>
                  </div>
                  <Switch 
                    checked={notifications.paymentReminders} 
                    onCheckedChange={(checked) => handleNotificationChange('paymentReminders', checked)} 
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">Weekly Reports</p>
                    <p className="text-sm text-slate-500">Receive a summary of your weekly expenses</p>
                  </div>
                  <Switch 
                    checked={notifications.weeklyReport} 
                    onCheckedChange={(checked) => handleNotificationChange('weeklyReport', checked)} 
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">New Roommate Joined</p>
                    <p className="text-sm text-slate-500">Get notified when someone joins your household</p>
                  </div>
                  <Switch 
                    checked={notifications.newRoommateJoined} 
                    onCheckedChange={(checked) => handleNotificationChange('newRoommateJoined', checked)} 
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button onClick={handleSaveNotifications}>Save Notification Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
