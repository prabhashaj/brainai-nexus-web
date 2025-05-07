
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  created_at: string;
  updated_at: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [currentEvent, setCurrentEvent] = useState<Event>({
    id: '',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    time: '',
    location: '',
    status: 'upcoming',
    created_at: '',
    updated_at: ''
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      if (data) {
        setEvents(data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentEvent.title.trim() || !currentEvent.date) {
      toast({
        title: "Error",
        description: "Title and date are required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      if (formMode === 'create') {
        const { data, error } = await supabase
          .from('events')
          .insert([{
            title: currentEvent.title,
            description: currentEvent.description,
            date: currentEvent.date,
            time: currentEvent.time,
            location: currentEvent.location,
            status: currentEvent.status,
            user_id: session.user.id
          }]);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Event created successfully",
        });
      } else {
        const { data, error } = await supabase
          .from('events')
          .update({
            title: currentEvent.title,
            description: currentEvent.description,
            date: currentEvent.date,
            time: currentEvent.time,
            location: currentEvent.location,
            status: currentEvent.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentEvent.id);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Event updated successfully",
        });
      }
      
      setIsFormOpen(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error("Error saving event:", error);
      toast({
        title: "Error",
        description: `Failed to ${formMode === 'create' ? 'create' : 'update'} event`,
        variant: "destructive"
      });
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setEvents(events.filter(event => event.id !== id));
      
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive"
      });
    }
  };
  
  const handleEdit = (event: Event) => {
    setFormMode('edit');
    setCurrentEvent({...event});
    setIsFormOpen(true);
  };
  
  const resetForm = () => {
    setCurrentEvent({
      id: '',
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      location: '',
      status: 'upcoming',
      created_at: '',
      updated_at: ''
    });
    setFormMode('create');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Group events by date
  const groupedEvents = events.reduce((groups: Record<string, Event[]>, event) => {
    const date = new Date(event.date).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {});

  return (
    <DashboardLayout>
      <div className="animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Events</h1>
          <Button 
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="bg-brainai-electric-blue hover:bg-brainai-soft-blue transition-all"
          >
            <Plus size={16} className="mr-2" />
            New Event
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-brainai-electric-blue border-t-transparent rounded-full"></div>
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedEvents).map(([date, dateEvents]) => (
              <div key={date} className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-700 flex items-center">
                  <Calendar size={18} className="mr-2 text-brainai-electric-blue" />
                  {date}
                </h2>
                
                <div className="space-y-4">
                  {dateEvents.map((event) => (
                    <div key={event.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{event.title}</h3>
                          <p className="text-gray-600 mt-1">{event.description || "No description"}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        {event.time && (
                          <div className="flex items-center">
                            <Clock size={16} className="mr-2" />
                            {event.time}
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin size={16} className="mr-2" />
                            {event.location}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-end mt-4 space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8"
                          onClick={() => handleEdit(event)}
                        >
                          <Pencil size={14} className="mr-1" /> Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                          onClick={() => handleDelete(event.id)}
                        >
                          <Trash2 size={14} className="mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No events found</h3>
            <p className="text-gray-500 mt-2">Schedule your first event to get started</p>
            <Button 
              className="mt-4 bg-brainai-electric-blue hover:bg-brainai-soft-blue"
              onClick={() => {
                resetForm();
                setIsFormOpen(true);
              }}
            >
              <Plus size={16} className="mr-2" />
              Create Event
            </Button>
          </div>
        )}
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{formMode === 'create' ? 'Create New Event' : 'Edit Event'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={currentEvent.title}
                onChange={(e) => setCurrentEvent({...currentEvent, title: e.target.value})}
                placeholder="Event title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="w-full border rounded-md p-3 h-24 focus:ring-2 focus:ring-brainai-electric-blue focus:ring-opacity-50 outline-none"
                value={currentEvent.description}
                onChange={(e) => setCurrentEvent({...currentEvent, description: e.target.value})}
                placeholder="Event description"
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={currentEvent.date}
                  onChange={(e) => setCurrentEvent({...currentEvent, date: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <Input
                  type="time"
                  value={currentEvent.time}
                  onChange={(e) => setCurrentEvent({...currentEvent, time: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                value={currentEvent.location}
                onChange={(e) => setCurrentEvent({...currentEvent, location: e.target.value})}
                placeholder="Event location"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select 
                value={currentEvent.status} 
                onValueChange={(value: 'upcoming' | 'ongoing' | 'completed') => 
                  setCurrentEvent({...currentEvent, status: value})
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-brainai-electric-blue hover:bg-brainai-soft-blue"
              >
                {formMode === 'create' ? 'Create Event' : 'Update Event'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Events;
