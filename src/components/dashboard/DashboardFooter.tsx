import React from "react";
import { LayoutDashboard, Brain, Calendar, MessageSquare, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const DashboardFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      title: "Home",
      icon: <LayoutDashboard className="h-6 w-6" />,
      href: "/dashboard",
    },
    {
      title: "Notes",
      icon: <Brain className="h-6 w-6" />,
      href: "/notes",
    },
    {
      title: "Events",
      icon: <Calendar className="h-6 w-6" />,
      href: "/events",
    },
    {
      title: "Conversations",
      icon: <MessageSquare className="h-6 w-6" />,
      href: "/conversations",
    },
    {
      title: "Profile",
      icon: <User className="h-6 w-6" />,
      href: "/profile",
    },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-md border-t border-gray-200">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <button
            key={item.href}
            onClick={() => navigate(item.href)}
            className={`flex flex-col items-center text-xs transition-colors ${
              location.pathname === item.href ? "text-blue-500" : "text-gray-500 hover:text-blue-500"
            }`}
          >
            <div className="h-5 w-5">{item.icon}</div>
            <span className="mt-0.5">{item.title}</span>
          </button>
        ))}
      </div>
    </footer>
  );
};

export default DashboardFooter;