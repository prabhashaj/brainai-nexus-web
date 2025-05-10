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

  const handleFormSubmit = async (e: React.Event) => {
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

  const getTagColor = (tag: string) => {
    const colors = [
      'bg-amber-100 text-amber-800',
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-rose-100 text-rose-800',
      'bg-teal-100 text-teal-800',
    ];
    
    // Generate consistent color based on tag string
    const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in-up px-4 md:px-8 lg:px-12 mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-4xl font-serif font-extrabold text-gray-900">Notes</h1>
          <Button 
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="w-full sm:w-auto bg-brainai-electric-blue hover:bg-brainai-soft-blue transition-all px-6 py-3 text-lg shadow-[0_4px_14px_rgba(0,118,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)] hover:-translate-y-1"
          >
            <Plus size={20} className="mr-2" />
            New Note
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-4 sm:p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-12 py-3 text-lg bg-white text-gray-900 border-gray-200 rounded-xl focus:border-brainai-electric-blue focus:ring-brainai-electric-blue/20"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative w-full md:w-auto">
              <Button 
                variant="outline" 
                className="w-full md:w-auto px-6 py-3 text-lg rounded-xl border-gray-200 hover:border-brainai-electric-blue hover:bg-brainai-electric-blue/5" 
                onClick={() => setShowTagsDropdown(!showTagsDropdown)}
              >
                <Tag size={20} className="mr-2" />
                Filter by Tags
              </Button>
              {showTagsDropdown && (
                <div className="absolute right-0 mt-2 w-full md:w-64 bg-white border rounded-md shadow-lg z-10 p-4">
                  {allTags.length > 0 ? (
                    <div className="max-h-48 overflow-y-auto">
                      {allTags.map((tag) => (
                        <div key={tag} className="flex items-center p-2 hover:bg-gray-50">
                          <input
                            type="checkbox"
                            id={`tag-${tag}`}
                            checked={selectedTags.includes(tag)}
                            onChange={() => handleTagFilter(tag)}
                            className="mr-3"
                          />
                          <label htmlFor={`tag-${tag}`} className="text-lg">{tag}</label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-lg">No tags found</p>
                  )}
                  <div className="border-t mt-4 pt-4 flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowTagsDropdown(false)}
                      className="px-4 py-2"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-6">
              {selectedTags.map(tag => (
                <div 
                  key={tag}
                  className="bg-brainai-electric-blue bg-opacity-10 text-brainai-electric-blue px-3 py-2 rounded-full text-lg flex items-center"
                >
                  {tag}
                  <button 
                    onClick={() => handleTagFilter(tag)}
                    className="ml-3 focus:outline-none"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setSelectedTags([])}
                className="text-gray-500 text-lg hover:text-gray-700"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-10 w-10 border-4 border-brainai-electric-blue border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <div 
                  key={note.id} 
                  className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-brainai-electric-blue to-brainai-neon-purple opacity-80"></div>
                  
                  <h3 className="text-xl font-serif font-bold mb-3 text-gray-800 line-clamp-2 pl-3">{note.title}</h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 text-base pl-3 leading-relaxed">{note.content}</p>
                  
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 pl-3">
                      {note.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index} 
                          className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${getTagColor(tag)}`}
                          onClick={() => handleTagFilter(tag)}
                        >
                          {tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">
                          +{note.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-4 pl-3">
                    <div className="text-sm text-gray-500 font-medium">
                      {new Date(note.updated_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 rounded-full bg-gray-100/80 hover:bg-gray-200/80" 
                        onClick={() => handleEdit(note)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 rounded-full bg-gray-100/80 hover:bg-red-100 text-gray-600 hover:text-red-600" 
                        onClick={() => handleDelete(note.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Brain size={32} className="text-gray-300" />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-gray-600">No notes found</h3>
                <p className="text-gray-500 mt-3 text-lg">Create your first note to get started</p>
                <Button 
                  className="mt-6 w-full sm:w-auto bg-brainai-electric-blue hover:bg-brainai-soft-blue px-6 py-3 text-lg shadow-[0_4px_14px_rgba(0,118,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)] hover:-translate-y-1 transition-all"
                  onClick={() => {
                    resetForm();
                    setIsFormOpen(true);
                  }}
                >
                  <Plus size={20} className="mr-2" />
                  Create Note
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {formMode === 'create' ? 'Create New Note' : 'Edit Note'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-6 pt-6">
            <div className="space-y-3">
              <label className="text-lg font-medium text-gray-900">Title</label>
              <Input
                value={currentNote.title}
                onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
                placeholder="Note title"
                required
                className="py-3 text-lg bg-white text-gray-900"
              />
            </div>
            <div className="space-y-3">
              <label className="text-lg font-medium text-gray-900">Content</label>
              <textarea
                className="w-full border rounded-md p-4 h-40 focus:ring-2 focus:ring-brainai-electric-blue focus:ring-opacity-50 outline-none text-lg bg-white text-gray-900"
                value={currentNote.content}
                onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})}
                placeholder="Type your note content here..."
              ></textarea>
            </div>
            <div className="space-y-3">
              <label className="text-lg font-medium text-gray-900">Tags</label>
              <div className="flex flex-col sm:flex-row gap-3">
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
                  className="py-3 text-lg bg-white text-gray-900"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                  className="px-4 py-3 whitespace-nowrap"
                >
                  Add
                </Button>
              </div>
              {currentNote.tags && currentNote.tags.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {currentNote.tags.map((tag, index) => (
                    <div 
                      key={index}
                      className="bg-gray-100 px-3 py-2 rounded-full text-lg flex items-center"
                    >
                      {tag}
                      <button 
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-3 focus:outline-none text-gray-500 hover:text-gray-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsFormOpen(false)}
                className="w-full sm:w-auto px-6 py-3 text-lg"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-brainai-electric-blue hover:bg-brainai-soft-blue px-6 py-3 text-lg"
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
