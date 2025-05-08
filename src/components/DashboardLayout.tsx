
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Brain, 
  Calendar, 
  MessageSquare, 
  User, 
  Settings, 
  LogOut,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        navigate("/auth");
      }
    };

    fetchUser();

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && !isSidebarCollapsed) {
        setIsSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) {
      setProfile(data);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
    navigate("/auth");
  };

  const navItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/dashboard",
    },
    {
      title: "Notes",
      icon: <Brain className="h-5 w-5" />,
      href: "/notes",
    },
    {
      title: "Events",
      icon: <Calendar className="h-5 w-5" />,
      href: "/events",
    },
    {
      title: "Conversations",
      icon: <MessageSquare className="h-5 w-5" />,
      href: "/conversations",
    },
    {
      title: "Profile",
      icon: <User className="h-5 w-5" />,
      href: "/profile",
    },
  ];

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-black text-white transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "w-16" : "w-64",
          "border-r border-gray-800 shadow-lg"
        )}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          <div className={cn("flex items-center", isSidebarCollapsed ? "justify-center w-full" : "gap-2")}>
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-brainai-electric-blue to-brainai-neon-purple shadow-[0_0_15px_rgba(139,92,246,0.5)]"></div>
            {!isSidebarCollapsed && (
              <span className="font-bold text-lg tracking-tight">BrainAi</span>
            )}
          </div>
          {!isSidebarCollapsed && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="text-white hover:bg-gray-800"
            >
              <ChevronLeft size={20} />
            </Button>
          )}
        </div>

        {/* User Info */}
        <div className={cn("p-4 border-b border-gray-800", isSidebarCollapsed ? "flex justify-center" : "")}>
          <div className={cn("flex items-center", isSidebarCollapsed ? "flex-col" : "space-x-3")}>
            <Avatar className="h-10 w-10 border-2 border-gray-700 shadow-md">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-r from-brainai-electric-blue to-brainai-neon-purple text-white">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {profile?.full_name || (user?.email?.split('@')[0]) || 'User'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-3 my-1 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gray-800 text-brainai-electric-blue shadow-[0_0_10px_rgba(30,174,219,0.3)]"
                    : "text-gray-400 hover:bg-gray-800/50 hover:text-white",
                  isSidebarCollapsed ? "justify-center" : ""
                )}
              >
                <span className="flex-shrink-0">
                  {item.icon}
                </span>
                {!isSidebarCollapsed && <span className="ml-3">{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out Button */}
        <div className={cn("p-4 border-t border-gray-800", isSidebarCollapsed ? "flex justify-center" : "")}>
          <Button 
            variant="ghost"
            className={cn(
              "flex items-center text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors",
              isSidebarCollapsed ? "p-2" : "w-full justify-start"
            )}
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            {!isSidebarCollapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300",
        isSidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        {/* Top Header Bar */}
        <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center">
            {/* Toggle button - always visible */}
            <Button 
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-black hover:bg-gray-100 mr-4"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </Button>
            
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Welcome back, {profile?.full_name || (user?.email?.split('@')[0]) || 'User'}
              </h1>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
