import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Brain, 
  Calendar, 
  MessageSquare, 
  User, 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardFooter from "@/components/dashboard/DashboardFooter";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header Bar - reduced padding */}
        <header className="bg-white shadow-sm py-3 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">BrainAi</h1>
          </div>
        </header>
        {/* Content Area - increased top margin for hero section */}
        <main className="flex-1 overflow-x-hidden bg-gray-50">
          {children}
        </main>
      </div>
      <DashboardFooter />
    </div>
  );
};

export default DashboardLayout;
