import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AppLayout from "@/components/layouts/AppLayout";
import Dashboard from "@/pages/dashboard/Dashboard";
import ExpensesPage from "@/pages/expenses/ExpensesPage";
import RoommatesPage from "@/pages/roommates/RoommatesPage";
import SplitBillsPage from "@/pages/split-bills/SplitBillsPage";
import ReportsPage from "@/pages/reports/ReportsPage";
import SettingsPage from "@/pages/settings/SettingsPage";
import { useState, useEffect } from "react";

function Router() {
  // In a real app, this would come from auth
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    username: "jamie",
    email: "jamie@remote.co",
    displayName: "Jamie Smith",
    avatarInitials: "JS"
  });

  return (
    <AppLayout user={currentUser}>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/expenses" component={ExpensesPage} />
        <Route path="/roommates" component={RoommatesPage} />
        <Route path="/split-bills" component={SplitBillsPage} />
        <Route path="/reports" component={ReportsPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
