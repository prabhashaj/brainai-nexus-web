
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Search, Tag, Plus, Pencil, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [currentNote, setCurrentNote] = useState<Note>({
    id: '',
    title: '',
    content: '',
    tags: [],
    created_at: '',
    updated_at: ''
  });
  const [tagInput, setTagInput] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setNotes(data as Note[]);
        
        // Extract all unique tags
        const tags = data.flatMap(note => note.tags || []);
        setAllTags([...new Set(tags)]);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast({
        title: "Error",
        description: "Failed to load notes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentNote.title.trim()) {
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
          .from('notes')
          .insert([
            {
              title: currentNote.title,
              content: currentNote.content,
              tags: currentNote.tags,
              user_id: session.user.id
            }
          ]);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Note created successfully",
        });
      } else {
        const { data, error } = await supabase
          .from('notes')
          .update({
            title: currentNote.title,
            content: currentNote.content,
            tags: currentNote.tags,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentNote.id);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Note updated successfully",
        });
      }
      
      setIsFormOpen(false);
      resetForm();
      fetchNotes();
    } catch (error) {
      console.error("Error saving note:", error);
      toast({
        title: "Error",
        description: `Failed to ${formMode === 'create' ? 'create' : 'update'} note`,
        variant: "destructive"
      });
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setNotes(notes.filter(note => note.id !== id));
      
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive"
      });
    }
  };
  
  const handleEdit = (note: Note) => {
    setFormMode('edit');
    setCurrentNote({...note});
    setIsFormOpen(true);
  };
  
  const resetForm = () => {
    setCurrentNote({
      id: '',
      title: '',
      content: '',
      tags: [],
      created_at: '',
      updated_at: ''
    });
    setFormMode('create');
  };
  
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (!currentNote.tags.includes(tagInput.trim())) {
      setCurrentNote({
        ...currentNote,
        tags: [...currentNote.tags, tagInput.trim()]
      });
    }
    setTagInput('');
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setCurrentNote({
      ...currentNote,
      tags: currentNote.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  const handleTagFilter = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => note.tags?.includes(tag));
    return matchesSearch && matchesTags;
  });

  return (
    <DashboardLayout>
      <div className="animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Notes</h1>
          <Button 
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="bg-brainai-electric-blue hover:bg-brainai-soft-blue transition-all"
          >
            <Plus size={16} className="mr-2" />
            New Note
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <Button 
                variant="outline" 
                className="w-full md:w-auto" 
                onClick={() => setShowTagsDropdown(!showTagsDropdown)}
              >
                <Tag size={16} className="mr-2" />
                Filter by Tags
              </Button>
              
              {showTagsDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-md shadow-lg z-10 p-2">
                  {allTags.length > 0 ? (
                    <div className="max-h-48 overflow-y-auto">
                      {allTags.map((tag) => (
                        <div key={tag} className="flex items-center p-2 hover:bg-gray-50">
                          <input
                            type="checkbox"
                            id={`tag-${tag}`}
                            checked={selectedTags.includes(tag)}
                            onChange={() => handleTagFilter(tag)}
                            className="mr-2"
                          />
                          <label htmlFor={`tag-${tag}`}>{tag}</label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 p-2">No tags found</p>
                  )}
                  <div className="border-t mt-2 pt-2 flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowTagsDropdown(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedTags.map(tag => (
                <div 
                  key={tag}
                  className="bg-brainai-electric-blue bg-opacity-10 text-brainai-electric-blue px-2 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button 
                    onClick={() => handleTagFilter(tag)}
                    className="ml-2 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setSelectedTags([])}
                className="text-gray-500 text-sm hover:text-gray-700"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-brainai-electric-blue border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <Card key={note.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{note.content}</p>
                    
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {note.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600 cursor-pointer hover:bg-brainai-electric-blue hover:text-white transition-colors"
                            onClick={() => handleTagFilter(tag)}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Updated {new Date(note.updated_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleEdit(note)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50" 
                          onClick={() => handleDelete(note.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Brain size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600">No notes found</h3>
                <p className="text-gray-500 mt-2">Create your first note to get started</p>
                <Button 
                  className="mt-4 bg-brainai-electric-blue hover:bg-brainai-soft-blue"
                  onClick={() => {
                    resetForm();
                    setIsFormOpen(true);
                  }}
                >
                  <Plus size={16} className="mr-2" />
                  Create Note
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{formMode === 'create' ? 'Create New Note' : 'Edit Note'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={currentNote.title}
                onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
                placeholder="Note title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <textarea
                className="w-full border rounded-md p-3 h-36 focus:ring-2 focus:ring-brainai-electric-blue focus:ring-opacity-50 outline-none"
                value={currentNote.content}
                onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})}
                placeholder="Type your note content here..."
              ></textarea>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              <div className="flex items-center space-x-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                >
                  Add
                </Button>
              </div>
              
              {currentNote.tags && currentNote.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {currentNote.tags.map((tag, index) => (
                    <div 
                      key={index}
                      className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center"
                    >
                      {tag}
                      <button 
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 focus:outline-none text-gray-500 hover:text-gray-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                {formMode === 'create' ? 'Create Note' : 'Update Note'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Notes;
