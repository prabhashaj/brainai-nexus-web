
import React from 'react';
import { Button } from "@/components/ui/button";
import { LinkedinIcon, GithubIcon, TwitterIcon, HomeIcon, CalendarIcon, BookIcon, MessageSquareIcon, UserIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from '@/components/Logo';

const DashboardFooter = () => {
  const location = useLocation();

  const navItems = [
    { icon: <HomeIcon className="h-6 w-6" />, label: "Home", path: "/dashboard" },
    { icon: <BookIcon className="h-6 w-6" />, label: "Notes", path: "/notes" },
    { icon: <CalendarIcon className="h-6 w-6" />, label: "Events", path: "/events" },
    { icon: <MessageSquareIcon className="h-6 w-6" />, label: "Convos", path: "/conversations" },
    { icon: <UserIcon className="h-6 w-6" />, label: "Profile", path: "/profile" },
  ];

  return (
    <>
      {/* Mobile Navigation Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <Link to={item.path} key={item.path}>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`flex flex-col items-center justify-center h-16 w-16 rounded-lg ${location.pathname === item.path ? 'text-brainai-electric-blue' : 'text-gray-400'}`}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop Footer */}
      <footer className="hidden lg:block bg-white border-t border-gray-200 py-6 mt-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <Logo />
              <span className="ml-2 text-xl font-bold text-gray-800">BrainAi</span>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon">
                  <TwitterIcon className="h-5 w-5 text-gray-600" />
                </Button>
                <Button variant="ghost" size="icon">
                  <LinkedinIcon className="h-5 w-5 text-gray-600" />
                </Button>
                <Button variant="ghost" size="icon">
                  <GithubIcon className="h-5 w-5 text-gray-600" />
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-gray-500">
            &copy; 2025 BrainAi. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default DashboardFooter;
