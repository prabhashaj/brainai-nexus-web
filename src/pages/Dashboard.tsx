
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Play, Brain, MessageSquare, Bell, Calendar, Settings, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [voiceCommand, setVoiceCommand] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [memories, setMemories] = useState([
    {
      id: 1,
      type: "reminder",
      content: "Call Rohan at 4 PM tomorrow",
      timestamp: "Tomorrow, 4:00 PM",
    },
    {
      id: 2,
      type: "note",
      content: "Working on a startup idea called BrainFuel",
      timestamp: "Added 3 days ago",
    },
    {
      id: 3, 
      type: "conversation",
      content: "Meeting with Ravi about Q4 planning",
      timestamp: "Today, 10:30 AM",
    }
  ]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate("/auth");
      }
      setLoading(false);
    };
    
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleVoiceCommand = () => {
    if (isRecording) {
      // Simulate stopping recording
      setIsRecording(false);
      toast({
        title: "Voice captured",
        description: "Processing your request...",
      });
      
      // Simulate processing delay
      setTimeout(() => {
        setMemories([
          {
            id: memories.length + 1,
            type: "reminder",
            content: voiceCommand,
            timestamp: "Just now",
          },
          ...memories,
        ]);
        setVoiceCommand("");
      }, 1500);
    } else {
      setIsRecording(true);
    }
  };

  const handleSubmitCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voiceCommand.trim()) return;
    
    setMemories([
      {
        id: memories.length + 1,
        type: "note",
        content: voiceCommand,
        timestamp: "Just now",
      },
      ...memories,
    ]);
    setVoiceCommand("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-brainai-electric-blue">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-brainai-electric-blue"></div>
            <span className="font-bold text-gray-800">BrainAi</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/settings")}>
              <Settings size={18} />
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Hello, {user?.email?.split('@')[0] || 'User'}</h1>
          
          {/* Voice Command Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">What's on your mind?</h2>
            
            <form onSubmit={handleSubmitCommand} className="flex items-center space-x-4 mb-2">
              <Input
                placeholder="Type or speak a command..."
                value={voiceCommand}
                onChange={(e) => setVoiceCommand(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={handleVoiceCommand} 
                className={`rounded-full w-12 h-12 flex items-center justify-center ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-brainai-electric-blue hover:bg-brainai-soft-blue'}`}
              >
                {isRecording ? <Play size={20} /> : <Mic size={20} />}
              </Button>
              <Button type="submit">Save</Button>
            </form>
            
            <p className="text-sm text-gray-500">Try saying: "Remind me to call Rohan at 4 PM tomorrow"</p>
          </div>
          
          {/* Memory Tabs */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button className="px-6 py-3 text-sm font-medium text-brainai-electric-blue border-b-2 border-brainai-electric-blue">
                Recent Memories
              </button>
              <button className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
                Reminders
              </button>
              <button className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
                Notes
              </button>
              <button className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
                Conversations
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {memories.map((memory) => (
                  <div key={memory.id} className="flex items-start p-4 bg-gray-50 rounded-lg">
                    <div className="mr-4 mt-1">
                      {memory.type === "reminder" && <Calendar size={20} className="text-amber-500" />}
                      {memory.type === "note" && <Brain size={20} className="text-blue-500" />}
                      {memory.type === "conversation" && <MessageSquare size={20} className="text-green-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">{memory.content}</p>
                      <p className="text-sm text-gray-500 mt-1">{memory.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-6">
                <Plus size={16} className="mr-2" />
                Load More Memories
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
