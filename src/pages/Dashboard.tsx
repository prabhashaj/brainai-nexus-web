
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Brain, Calendar, MessageSquare } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import VoiceCommandCard from "@/components/dashboard/VoiceCommandCard";

interface DashboardStats {
  notes: number;
  events: number;
  conversations: number;
}

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    notes: 0,
    events: 0,
    conversations: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserAndData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        setUser(session.user);
        await fetchStats(session.user.id);
        await fetchRecentActivity(session.user.id);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndData();
  }, []);

  const fetchStats = async (userId: string) => {
    try {
      // Get notes count
      const { count: notesCount, error: notesError } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get events count
      const { count: eventsCount, error: eventsError } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get conversations count
      const { count: conversationsCount, error: conversationsError } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      setStats({
        notes: notesCount || 0,
        events: eventsCount || 0,
        conversations: conversationsCount || 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchRecentActivity = async (userId: string) => {
    try {
      // Fetch recent notes
      const { data: notes, error: notesError } = await supabase
        .from('notes')
        .select('id, title, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(2);

      // Fetch recent events
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('id, title, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(2);

      // Fetch recent conversations
      const { data: conversations, error: conversationsError } = await supabase
        .from('conversations')
        .select('id, title, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(2);

      // Combine, transform and sort by date
      const allActivity = [
        ...(notes || []).map(item => ({
          id: item.id,
          type: 'note' as const,
          title: item.title,
          timestamp: new Date(item.created_at).toLocaleDateString()
        })),
        ...(events || []).map(item => ({
          id: item.id,
          type: 'event' as const,
          title: item.title,
          timestamp: new Date(item.created_at).toLocaleDateString()
        })),
        ...(conversations || []).map(item => ({
          id: item.id,
          type: 'conversation' as const,
          title: item.title,
          timestamp: new Date(item.created_at).toLocaleDateString()
        }))
      ].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ).slice(0, 5);

      setRecentActivity(allActivity);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-brainai-electric-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Welcome back, {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}! Here's an overview of your activity.
        </p>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            title="Notes" 
            value={stats.notes} 
            icon={<Brain className="h-6 w-6 text-blue-500" />}
            className="bg-gradient-to-br from-blue-50 to-white"
          />
          <StatsCard 
            title="Events" 
            value={stats.events} 
            icon={<Calendar className="h-6 w-6 text-amber-500" />}
            className="bg-gradient-to-br from-amber-50 to-white"
          />
          <StatsCard 
            title="Conversations" 
            value={stats.conversations} 
            icon={<MessageSquare className="h-6 w-6 text-green-500" />}
            className="bg-gradient-to-br from-green-50 to-white"
          />
        </div>
        
        {/* Voice Command Section */}
        <div className="mb-8">
          <VoiceCommandCard />
        </div>
        
        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <QuickActions />
          <RecentActivity items={recentActivity} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
