
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Trash2, Clock, MapPin, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

// Define the Event type
type EventStatus = "upcoming" | "ongoing" | "completed";

interface Event {
  id: string;
  user_id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: EventStatus;
  created_at: string;
  updated_at: string;
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    status: "upcoming" as EventStatus
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;

      // Explicitly type the data as Event[]
      setEvents(data as Event[]);
    } catch (error: any) {
      console.error("Error fetching events:", error.message);
      toast({
        title: "Error",
        description: "Could not fetch events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    try {
      if (!newEvent.title || !newEvent.date) {
        toast({
          title: "Error",
          description: "Title and date are required",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from("events")
        .insert([{
          ...newEvent,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        }])
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event created successfully",
      });

      // Reset form and close dialog
      setNewEvent({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        status: "upcoming"
      });
      setOpen(false);
      
      // Refresh events list
      fetchEvents();
    } catch (error: any) {
      console.error("Error creating event:", error.message);
      toast({
        title: "Error",
        description: error.message || "Could not create event",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      
      // Update events list after deletion
      fetchEvents();
    } catch (error: any) {
      console.error("Error deleting event:", error.message);
      toast({
        title: "Error",
        description: "Could not delete event",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-50 text-blue-600 border border-blue-200";
      case "ongoing":
        return "bg-green-50 text-green-600 border border-green-200";
      case "completed":
        return "bg-gray-50 text-gray-600 border border-gray-200";
      default:
        return "bg-blue-50 text-blue-600 border border-blue-200";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin h-10 w-10 border-4 border-brainai-electric-blue border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2" 
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-3xl font-display font-semibold text-gray-800">Events</h1>
            </div>
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-brainai-electric-blue hover:bg-brainai-soft-blue transition-all shadow-md hover:shadow-lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white text-black">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Title</Label>
                    <Input 
                      id="title" 
                      value={newEvent.title} 
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} 
                      className="col-span-3 bg-white text-black" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Textarea 
                      id="description" 
                      value={newEvent.description} 
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} 
                      className="col-span-3 bg-white text-black" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">Date</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      value={newEvent.date} 
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} 
                      className="col-span-3 bg-white text-black" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="time" className="text-right">Time</Label>
                    <Input 
                      id="time" 
                      type="time" 
                      value={newEvent.time} 
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})} 
                      className="col-span-3 bg-white text-black" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">Location</Label>
                    <Input 
                      id="location" 
                      value={newEvent.location} 
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} 
                      className="col-span-3 bg-white text-black" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">Status</Label>
                    <Select 
                      value={newEvent.status} 
                      onValueChange={(value) => setNewEvent({...newEvent, status: value as EventStatus})}
                    >
                      <SelectTrigger className="col-span-3 bg-white text-black">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" onClick={handleCreateEvent} className="bg-brainai-electric-blue hover:bg-brainai-soft-blue transition-all">
                    Create Event
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border-0 shadow-lg">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Calendar className="h-10 w-10 text-gray-300" />
              </div>
              <h2 className="text-2xl font-display font-medium text-gray-600 mb-2">No events yet</h2>
              <p className="text-gray-500 mb-6">Create your first event to get started</p>
              <Button 
                onClick={() => setOpen(true)}
                className="bg-brainai-electric-blue hover:bg-brainai-soft-blue transition-all shadow-md hover:shadow-lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div 
                  key={event.id}
                  className="group relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg hover:shadow-xl"
                >
                  <div className="absolute top-0 right-0 p-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-50"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-display font-semibold line-clamp-2 pr-6">{event.title}</h3>
                    </div>
                    
                    <Badge className={`mb-4 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status}
                    </Badge>
                    
                    {event.description && (
                      <p className="text-gray-600 mb-5 line-clamp-2">{event.description}</p>
                    )}
                    
                    <div className="space-y-3 border-t border-gray-100 pt-4 mt-auto">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-brainai-electric-blue opacity-80" />
                        {event.date && format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                      </div>
                      
                      {event.time && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-brainai-electric-blue opacity-80" />
                          {event.time}
                        </div>
                      )}
                      
                      {event.location && (
                        <div className="flex items-start text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5 text-brainai-electric-blue opacity-80" />
                          <span className="flex-1">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EventsPage;
