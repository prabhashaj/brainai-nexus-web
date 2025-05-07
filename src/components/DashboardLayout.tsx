
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
  X,
  ChevronLeft,
  ChevronRight
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
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
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else if (mobile) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
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
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/settings",
    },
  ];

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Design inspired by the reference image
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Modern Sidebar with slide animation */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out transform",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:relative lg:translate-x-0",
          isMobile && isSidebarOpen ? "translate-x-0" : ""
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo and Collapse Button */}
          <div className="p-4 flex items-center justify-between border-b">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-brainai-electric-blue to-brainai-neon-purple"></div>
              <span className="font-bold text-lg text-gray-800 tracking-tight">BrainAi</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="lg:flex hidden"
            >
              {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden flex"
            >
              <X size={20} />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border border-gray-200">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-r from-brainai-electric-blue to-brainai-neon-purple text-white">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === import.meta.env.BASE_URL + item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all",
                    isActive
                      ? "bg-gradient-to-r from-brainai-electric-blue/10 to-brainai-neon-purple/10 text-brainai-electric-blue"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <span className={cn("mr-3", isActive ? "text-brainai-electric-blue" : "")}>
                    {item.icon}
                  </span>
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t">
            <Button 
              variant="outline" 
              className="flex items-center w-full justify-start hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors" 
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">
        {/* Top Header Bar */}
        <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              <Menu size={24} />
            </Button>
            
            <div className="ml-4 lg:ml-0">
              <h1 className="text-xl font-semibold text-gray-800">
                Welcome back, {profile?.full_name || 'User'}
              </h1>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
