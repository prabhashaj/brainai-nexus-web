
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
      <div className="animate-fade-in-up px-4 md:px-8 lg:px-12 mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-800">Conversations</h1>
          <Button 
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="w-full sm:w-auto bg-brainai-electric-blue hover:bg-brainai-soft-blue transition-all shadow-[0_4px_14px_rgba(0,118,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)] hover:-translate-y-1"
          >
            <Plus size={16} className="mr-2" />
            New Conversation
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-5 mb-6 border border-gray-100">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-12 bg-white text-gray-900 border-gray-200 rounded-xl focus:border-brainai-electric-blue focus:ring-brainai-electric-blue/20"
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
              <div 
                key={conversation.id} 
                className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex gap-5">
                    <Avatar className="w-12 h-12 shrink-0 rounded-full shadow-md border-2 border-white">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-to-br from-brainai-soft-blue to-brainai-neon-purple text-white font-medium">
                        {conversation.with_person?.charAt(0) || 'C'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                        <h3 className="text-xl font-serif font-semibold truncate">{conversation.title}</h3>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 rounded-full bg-gray-100/80 hover:bg-gray-200/80" 
                            onClick={() => handleEdit(conversation)}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 rounded-full bg-gray-100/80 hover:bg-red-100 text-gray-600 hover:text-red-600" 
                            onClick={() => handleDelete(conversation.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                      
                      {conversation.with_person && (
                        <div className="flex items-center text-sm text-brainai-electric-blue font-medium mb-2">
                          <User size={14} className="mr-1 opacity-70" />
                          <span>{conversation.with_person}</span>
                        </div>
                      )}
                      
                      <p className="text-gray-600 line-clamp-2 mb-3">{conversation.content}</p>
                      
                      <div className="text-xs text-gray-500 font-medium">
                        {new Date(conversation.updated_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <div className="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <MessageSquare size={32} className="text-gray-300" />
            </div>
            <h3 className="text-2xl font-serif font-semibold text-gray-600">No conversations found</h3>
            <p className="text-gray-500 mt-2 mb-6">Create your first conversation to get started</p>
            <Button 
              className="bg-brainai-electric-blue hover:bg-brainai-soft-blue shadow-[0_4px_14px_rgba(0,118,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)] hover:-translate-y-1 transition-all"
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
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {formMode === 'create' ? 'Create New Conversation' : 'Edit Conversation'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Title</label>
              <Input
                value={currentConversation.title}
                onChange={(e) => setCurrentConversation({...currentConversation, title: e.target.value})}
                placeholder="Conversation title"
                required
                className="bg-white text-gray-900"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">With Person</label>
              <Input
                value={currentConversation.with_person}
                onChange={(e) => setCurrentConversation({...currentConversation, with_person: e.target.value})}
                placeholder="Person's name"
                className="bg-white text-gray-900"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Content</label>
              <textarea
                className="w-full border rounded-md p-3 h-36 focus:ring-2 focus:ring-brainai-electric-blue focus:ring-opacity-50 outline-none bg-white text-gray-900"
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
