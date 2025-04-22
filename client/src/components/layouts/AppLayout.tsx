import { useState, ReactNode } from "react";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import Footer from "./Footer";

interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  avatarInitials: string;
}

interface AppLayoutProps {
  children: ReactNode;
  user: User;
}

export default function AppLayout({ children, user }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Hidden on mobile */}
      <Sidebar user={user} className="hidden md:flex md:w-64 flex-col" />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen">
        {/* Top Navigation - Mobile */}
        <MobileNav 
          user={user} 
          isMenuOpen={mobileMenuOpen} 
          toggleMenu={toggleMobileMenu} 
        />
        
        {/* Page Content */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto pb-16 md:pb-6">
          {children}
          <Footer />
        </div>
        
        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 flex justify-around">
          <a href="/" className="flex flex-col items-center p-2 text-primary">
            <i className="fas fa-home text-lg"></i>
            <span className="text-xs mt-1">Home</span>
          </a>
          <a href="/expenses" className="flex flex-col items-center p-2 text-slate-500">
            <i className="fas fa-receipt text-lg"></i>
            <span className="text-xs mt-1">Expenses</span>
          </a>
          <a href="/split-bills" className="flex flex-col items-center p-2 text-slate-500">
            <i className="fas fa-calculator text-lg"></i>
            <span className="text-xs mt-1">Split</span>
          </a>
          <a href="/roommates" className="flex flex-col items-center p-2 text-slate-500">
            <i className="fas fa-users text-lg"></i>
            <span className="text-xs mt-1">Roommates</span>
          </a>
        </div>
      </main>
    </div>
  );
}
