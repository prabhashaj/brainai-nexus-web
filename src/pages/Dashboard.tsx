import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Brain, Calendar, MessageSquare, Plus } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import CommandInput from "@/components/dashboard/CommandInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import DashboardFooter from "@/components/dashboard/DashboardFooter";

interface DashboardStats {
  notes: number;
  events: number;
  conversations: number;
}

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    notes: 0,
    events: 0,
    conversations: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("recent");
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [newEvent, setNewEvent] = useState({ title: "", description: "", date: "", time: "", location: "" });
  const [newConversation, setNewConversation] = useState({ title: "", content: "", with_person: "" });
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isConversationModalOpen, setIsConversationModalOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const fetchUserAndData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        setUser(session.user);
        await fetchProfile(session.user.id);
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

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) {
      setProfile(data);
    }
  };

  const fetchStats = async (userId: string) => {
    try {
      // Get notes count
      const { count: notesCount } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get events count
      const { count: eventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get conversations count
      const { count: conversationsCount } = await supabase
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
      const { data: notes } = await supabase
        .from('notes')
        .select('id, title, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(2);

      // Fetch recent events
      const { data: events } = await supabase
        .from('events')
        .select('id, title, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(2);

      // Fetch recent conversations
      const { data: conversations } = await supabase
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

  // Create new note
  const handleCreateNote = async () => {
    try {
      if (!newNote.title) {
        toast({
          title: "Error",
          description: "Please provide a title for your note",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('notes')
        .insert([{
          user_id: user.id,
          title: newNote.title,
          content: newNote.content
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note created successfully",
      });

      // Reset form and close dialog
      setNewNote({ title: "", content: "" });
      setIsNoteModalOpen(false);

      // Refresh data
      await fetchStats(user.id);
      await fetchRecentActivity(user.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create note",
        variant: "destructive"
      });
    }
  };

  // Create new event
  const handleCreateEvent = async () => {
    try {
      if (!newEvent.title || !newEvent.date) {
        toast({
          title: "Error",
          description: "Please provide a title and date for your event",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('events')
        .insert([{
          user_id: user.id,
          title: newEvent.title,
          description: newEvent.description,
          date: newEvent.date,
          time: newEvent.time,
          location: newEvent.location,
          status: "upcoming"
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event created successfully",
      });

      // Reset form and close dialog
      setNewEvent({ title: "", description: "", date: "", time: "", location: "" });
      setIsEventModalOpen(false);

      // Refresh data
      await fetchStats(user.id);
      await fetchRecentActivity(user.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
        variant: "destructive"
      });
    }
  };

  // Create new conversation
  const handleCreateConversation = async () => {
    try {
      if (!newConversation.title) {
        toast({
          title: "Error",
          description: "Please provide a title for your conversation",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('conversations')
        .insert([{
          user_id: user.id,
          title: newConversation.title,
          content: newConversation.content,
          with_person: newConversation.with_person
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Conversation created successfully",
      });

      // Reset form and close dialog
      setNewConversation({ title: "", content: "", with_person: "" });
      setIsConversationModalOpen(false);

      // Refresh data
      await fetchStats(user.id);
      await fetchRecentActivity(user.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create conversation",
        variant: "destructive"
      });
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
      <div className="animate-fade-in-up p-4 md:p-6 mt-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
        
        {/* Command Input Card */}
        <CommandInput />
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatsCard 
            title="Notes" 
            value={stats.notes} 
            icon={<Brain className="h-6 w-6 text-blue-500" />}
            className="bg-gradient-to-br from-blue-50 to-white"
            iconClassName="bg-blue-50"
          />
          <StatsCard 
            title="Events" 
            value={stats.events} 
            icon={<Calendar className="h-6 w-6 text-amber-500" />}
            className="bg-gradient-to-br from-amber-50 to-white"
            iconClassName="bg-amber-50"
          />
          <StatsCard 
            title="Conversations" 
            value={stats.conversations} 
            icon={<MessageSquare className="h-6 w-6 text-green-500" />}
            className="bg-gradient-to-br from-green-50 to-white"
            iconClassName="bg-green-50"
          />
        </div>
        
        {/* Quick Add Buttons */}
        <div className="flex flex-wrap gap-4 mb-12">
          {/* Note Dialog */}
          <Dialog open={isNoteModalOpen} onOpenChange={setIsNoteModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white border-blue-200 text-blue-600 hover:bg-blue-50">
                <Plus className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium">Title</label>
                  <Input 
                    id="title" 
                    value={newNote.title}
                    onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                    className="bg-white text-black" 
                    placeholder="Note title"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="content" className="text-sm font-medium">Content</label>
                  <Textarea 
                    id="content" 
                    value={newNote.content}
                    onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                    className="bg-white text-black min-h-[100px]" 
                    placeholder="Write your note here..."
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleCreateNote} className="bg-blue-500 hover:bg-blue-600 text-white">
                  Create Note
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Event Dialog */}
          <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white border-amber-200 text-amber-600 hover:bg-amber-50">
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="eventTitle" className="text-sm font-medium">Title</label>
                  <Input 
                    id="eventTitle" 
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="bg-white text-black" 
                    placeholder="Event title"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="eventDescription" className="text-sm font-medium">Description</label>
                  <Textarea 
                    id="eventDescription" 
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    className="bg-white text-black" 
                    placeholder="Event description"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="eventDate" className="text-sm font-medium">Date</label>
                  <Input 
                    id="eventDate" 
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="bg-white text-black" 
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="eventTime" className="text-sm font-medium">Time</label>
                  <Input 
                    id="eventTime" 
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="bg-white text-black" 
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="eventLocation" className="text-sm font-medium">Location</label>
                  <Input 
                    id="eventLocation" 
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    className="bg-white text-black" 
                    placeholder="Location"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleCreateEvent} className="bg-blue-500 hover:bg-blue-600 text-white">
                  Create Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Conversation Dialog */}
          <Dialog open={isConversationModalOpen} onOpenChange={setIsConversationModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white border-green-200 text-green-600 hover:bg-green-50">
                <Plus className="mr-2 h-4 w-4" />
                Add Conversation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
              <DialogHeader>
                <DialogTitle>Create New Conversation</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="conversationTitle" className="text-sm font-medium">Title</label>
                  <Input 
                    id="conversationTitle" 
                    value={newConversation.title}
                    onChange={(e) => setNewConversation({...newConversation, title: e.target.value})}
                    className="bg-white text-black" 
                    placeholder="Conversation title"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="conversationWithPerson" className="text-sm font-medium">With Person</label>
                  <Input 
                    id="conversationWithPerson" 
                    value={newConversation.with_person}
                    onChange={(e) => setNewConversation({...newConversation, with_person: e.target.value})}
                    className="bg-white text-black" 
                    placeholder="Person name"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="conversationContent" className="text-sm font-medium">Content</label>
                  <Textarea 
                    id="conversationContent" 
                    value={newConversation.content}
                    onChange={(e) => setNewConversation({...newConversation, content: e.target.value})}
                    className="bg-white text-black min-h-[100px]" 
                    placeholder="Write your conversation notes here..."
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleCreateConversation} className="bg-blue-500 hover:bg-blue-600 text-white">
                  Create Conversation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Tab Section with Recent/Notes/Events/Conversations */}
        <div className="mb-12 bg-white rounded-xl shadow-md p-4">
          <Tabs defaultValue="recent" value={activeTab} onValueChange={setActiveTab} 
                className="w-full">
            <TabsList className="mb-3 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="recent" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">Recent</TabsTrigger>
              <TabsTrigger value="reminders" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">Reminders</TabsTrigger>
              <TabsTrigger value="notes" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">Notes</TabsTrigger>
              <TabsTrigger value="conversations" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">Convos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recent">
              <div className="mb-4">
                {recentActivity.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No recent activities</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((item) => (
                      <div key={item.id} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            item.type === 'note' ? 'bg-blue-100 text-blue-600' :
                            item.type === 'event' ? 'bg-amber-100 text-amber-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {item.type === 'note' ? (
                              <Brain className="h-4 w-4" />
                            ) : item.type === 'event' ? (
                              <Calendar className="h-4 w-4" />
                            ) : (
                              <MessageSquare className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{item.title}</h3>
                            <div className="flex items-center text-xs text-gray-500">
                              <span className="capitalize">{item.type}</span>
                              <span className="mx-1">•</span>
                              <span>{item.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-center">
                      <Button variant="outline" className="w-full max-w-md flex items-center justify-center gap-2 bg-gray-900 text-white hover:bg-gray-800 border-none">
                        <Plus size={16} className="opacity-70" />
                        <span>Load More Memories</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="reminders">
              <div className="space-y-4 py-4">
                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Remain me to call Rohan at 4 PM tomorrow</h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>Just now</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button variant="outline" className="w-full max-w-md flex items-center justify-center gap-2 bg-gray-900 text-white hover:bg-gray-800 border-none">
                    <Plus size={16} className="opacity-70" />
                    <span>Load More Memories</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notes">
              <div className="text-center py-8">
                <Button 
                  onClick={() => setIsNoteModalOpen(true)} 
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create a New Note
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="conversations">
              <div className="text-center py-8">
                <Button 
                  onClick={() => setIsConversationModalOpen(true)} 
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create a New Conversation
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <DashboardFooter />
    </DashboardLayout>
  );
};

export default Dashboard;
