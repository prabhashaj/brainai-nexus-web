
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Trash2, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

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
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin h-10 w-10 border-4 border-brainai-electric-blue border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Events</h1>
            <p className="text-gray-600">Manage your upcoming and past events</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0 bg-brainai-electric-blue hover:bg-brainai-electric-blue/90">
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
                <Button type="submit" onClick={handleCreateEvent} className="bg-brainai-electric-blue hover:bg-brainai-electric-blue/90">
                  Create Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-gray-100">
            <Calendar className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-medium text-gray-600 mb-2">No events yet</h2>
            <p className="text-gray-500 mb-6">Create your first event to get started</p>
            <Button 
              onClick={() => setOpen(true)}
              className="bg-brainai-electric-blue hover:bg-brainai-electric-blue/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden transition-shadow hover:shadow-lg border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold line-clamp-2">{event.title}</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-500 hover:text-red-500"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="mt-2">
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {event.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3">{event.description}</p>
                  )}
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    {event.date && format(new Date(event.date), 'MMM dd, yyyy')}
                  </div>
                  {event.time && (
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Clock className="h-4 w-4 mr-2" />
                      {event.time}
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EventsPage;
