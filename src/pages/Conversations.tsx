
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Plus, Pencil, Trash2, Search, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Conversation {
  id: string;
  title: string;
  content: string;
  with_person: string;
  created_at: string;
  updated_at: string;
}

const Conversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [currentConversation, setCurrentConversation] = useState<Conversation>({
    id: '',
    title: '',
    content: '',
    with_person: '',
    created_at: '',
    updated_at: ''
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setConversations(data);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentConversation.title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      if (formMode === 'create') {
        const { data, error } = await supabase
          .from('conversations')
          .insert([{
            title: currentConversation.title,
            content: currentConversation.content,
            with_person: currentConversation.with_person,
            user_id: session.user.id
          }]);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Conversation created successfully",
        });
      } else {
        const { data, error } = await supabase
          .from('conversations')
          .update({
            title: currentConversation.title,
            content: currentConversation.content,
            with_person: currentConversation.with_person,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentConversation.id);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Conversation updated successfully",
        });
      }
      
      setIsFormOpen(false);
      resetForm();
      fetchConversations();
    } catch (error) {
      console.error("Error saving conversation:", error);
      toast({
        title: "Error",
        description: `Failed to ${formMode === 'create' ? 'create' : 'update'} conversation`,
        variant: "destructive"
      });
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setConversations(conversations.filter(conversation => conversation.id !== id));
      
      toast({
        title: "Success",
        description: "Conversation deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive"
      });
    }
  };
  
  const handleEdit = (conversation: Conversation) => {
    setFormMode('edit');
    setCurrentConversation({...conversation});
    setIsFormOpen(true);
  };
  
  const resetForm = () => {
    setCurrentConversation({
      id: '',
      title: '',
      content: '',
      with_person: '',
      created_at: '',
      updated_at: ''
    });
    setFormMode('create');
  };

  const filteredConversations = conversations.filter(conversation => {
    return (
      conversation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.with_person.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <DashboardLayout>
      <div className="animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Conversations</h1>
          <Button 
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="bg-brainai-electric-blue hover:bg-brainai-soft-blue transition-all"
          >
            <Plus size={16} className="mr-2" />
            New Conversation
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-brainai-electric-blue border-t-transparent rounded-full"></div>
          </div>
        ) : filteredConversations.length > 0 ? (
          <div className="space-y-4">
            {filteredConversations.map((conversation) => (
              <div key={conversation.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start">
                    <Avatar className="mr-4 h-10 w-10">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-green-100 text-green-700">
                        {conversation.with_person?.charAt(0) || 'C'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold truncate">{conversation.title}</h3>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0" 
                            onClick={() => handleEdit(conversation)}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50" 
                            onClick={() => handleDelete(conversation.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                      
                      {conversation.with_person && (
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                          <User size={14} className="mr-1" />
                          <span>{conversation.with_person}</span>
                        </div>
                      )}
                      
                      <p className="mt-3 text-gray-600 line-clamp-3">{conversation.content}</p>
                      
                      <div className="mt-4 text-xs text-gray-500">
                        {new Date(conversation.updated_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No conversations found</h3>
            <p className="text-gray-500 mt-2">Create your first conversation to get started</p>
            <Button 
              className="mt-4 bg-brainai-electric-blue hover:bg-brainai-soft-blue"
              onClick={() => {
                resetForm();
                setIsFormOpen(true);
              }}
            >
              <Plus size={16} className="mr-2" />
              Create Conversation
            </Button>
          </div>
        )}
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{formMode === 'create' ? 'Create New Conversation' : 'Edit Conversation'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={currentConversation.title}
                onChange={(e) => setCurrentConversation({...currentConversation, title: e.target.value})}
                placeholder="Conversation title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">With Person</label>
              <Input
                value={currentConversation.with_person}
                onChange={(e) => setCurrentConversation({...currentConversation, with_person: e.target.value})}
                placeholder="Person's name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <textarea
                className="w-full border rounded-md p-3 h-36 focus:ring-2 focus:ring-brainai-electric-blue focus:ring-opacity-50 outline-none"
                value={currentConversation.content}
                onChange={(e) => setCurrentConversation({...currentConversation, content: e.target.value})}
                placeholder="Conversation content or notes"
              ></textarea>
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
                {formMode === 'create' ? 'Create Conversation' : 'Update Conversation'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Conversations;
