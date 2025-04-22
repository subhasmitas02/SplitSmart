import React from 'react';
import { Github, Linkedin, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 py-6 mt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-slate-500">
              &copy; {currentYear} SplitSmart. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-primary transition-colors"
            >
              <Github size={20} />
              <span className="sr-only">GitHub</span>
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-[#0077B5] transition-colors"
            >
              <Linkedin size={20} />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a 
              href="https://leetcode.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-[#FFA116] transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M16.5 11.5h-9v1h9v-1z" />
                <path d="M18.28 9.28l-1.06 1.06L19.5 12.5l-2.28 2.28 1.06 1.06L21.5 12.5l-3.22-3.22z" />
                <path d="M5.72 9.28l1.06 1.06L4.5 12.5l2.28 2.28-1.06 1.06L2.5 12.5l3.22-3.22z" />
                <path d="M9.25 7.75l5.5 8.5" />
              </svg>
              <span className="sr-only">LeetCode</span>
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-[#E4405F] transition-colors"
            >
              <Instagram size={20} />
              <span className="sr-only">Instagram</span>
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-[#FF0000] transition-colors"
            >
              <Youtube size={20} />
              <span className="sr-only">YouTube</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}