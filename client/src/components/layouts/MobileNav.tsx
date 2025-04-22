import { useState, useEffect } from "react";

interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  avatarInitials: string;
}

interface MobileNavProps {
  user: User;
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export default function MobileNav({ user, isMenuOpen, toggleMenu }: MobileNavProps) {
  // When the mobile menu is open, prevent background scrolling
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);
  
  return (
    <>
      <header className="md:hidden bg-white p-4 border-b border-slate-200 flex items-center justify-between">
        <button onClick={toggleMenu} className="text-slate-700">
          <i className="fas fa-bars text-xl"></i>
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800">SplitSmart</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
          <span className="text-slate-600 font-bold text-sm">{user.avatarInitials}</span>
        </div>
      </header>

      {/* Mobile Slide Menu - Hidden by default */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="bg-white w-64 h-full overflow-y-auto">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <h1 className="text-xl font-bold text-slate-800">SplitSmart</h1>
              </div>
              <button onClick={toggleMenu} className="text-slate-700">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <nav className="p-4 space-y-1">
              <a href="/" className="flex items-center space-x-3 px-3 py-2 rounded-md bg-slate-100 text-primary font-medium">
                <i className="fas fa-home"></i>
                <span>Dashboard</span>
              </a>
              <a href="/expenses" className="flex items-center space-x-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors">
                <i className="fas fa-receipt"></i>
                <span>Expenses</span>
              </a>
              <a href="/roommates" className="flex items-center space-x-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors">
                <i className="fas fa-users"></i>
                <span>Roommates</span>
              </a>
              <a href="/split-bills" className="flex items-center space-x-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors">
                <i className="fas fa-calculator"></i>
                <span>Split Bills</span>
              </a>
              <a href="/reports" className="flex items-center space-x-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors">
                <i className="fas fa-chart-pie"></i>
                <span>Reports</span>
              </a>
              <a href="/settings" className="flex items-center space-x-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors">
                <i className="fas fa-cog"></i>
                <span>Settings</span>
              </a>
            </nav>
            <div className="p-4 border-t border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center">
                  <span className="text-slate-600 font-bold">{user.avatarInitials}</span>
                </div>
                <div>
                  <p className="font-medium text-sm">{user.displayName}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
