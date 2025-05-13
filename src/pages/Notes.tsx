
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNote as createNoteAction,
  getNotes as getNotesAction,
  updateNote as updateNoteAction,
  deleteNote as deleteNoteAction,
} from "@/actions/notes";
import { Note } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from '@/hooks/useUser';
import DashboardLayout from "@/components/DashboardLayout";
import { ArrowLeft, Plus, PenLine } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Notes = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data: notes, isLoading, isError } = useQuery({
    queryKey: ['notes', user?.id],
    queryFn: () => getNotesAction(user?.id),
  });

  const createNoteMutation = useMutation({
    mutationFn: createNoteAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
      setTitle('');
      setContent('');
      toast({
        title: "Success!",
        description: "Note created successfully.",
      })
    },
    onError: () => {
      toast({
        title: "Error!",
        description: "Failed to create note.",
        variant: "destructive",
      })
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: updateNoteAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
      setSelectedNoteId(null);
      toast({
        title: "Success!",
        description: "Note updated successfully.",
      })
    },
    onError: () => {
      toast({
        title: "Error!",
        description: "Failed to update note.",
        variant: "destructive",
      })
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNoteAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
      setSelectedNoteId(null);
      toast({
        title: "Success!",
        description: "Note deleted successfully.",
      })
    },
    onError: () => {
      toast({
        title: "Error!",
        description: "Failed to delete note.",
        variant: "destructive",
      })
    },
  });

  const handleNoteClick = (note: Note) => {
    setSelectedNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleCreateNote = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Warning!",
        description: "Title and content cannot be empty.",
      });
      return;
    }

    if (user?.id) {
      createNoteMutation.mutate({
        userId: user.id,
        title: title,
        content: content,
      });
    } else {
      toast({
        title: "Error!",
        description: "User ID is missing.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateNote = async () => {
    if (!selectedNoteId) {
      toast({
        title: "Warning!",
        description: "No note selected to update.",
      });
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Warning!",
        description: "Title and content cannot be empty.",
      });
      return;
    }

    updateNoteMutation.mutate({
      id: selectedNoteId,
      title: title,
      content: content,
    });
  };

  const handleDeleteNote = async () => {
    if (!selectedNoteId) {
      toast({
        title: "Warning!",
        description: "No note selected to delete.",
      });
      return;
    }

    deleteNoteMutation.mutate(selectedNoteId);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
      if (isAtBottom) {
        // console.log("Reached the bottom of the scroll area!");
      }
    }
  };

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
              <h1 className="text-3xl font-display font-semibold text-gray-800">Your Notes</h1>
            </div>
            <Button 
              onClick={() => {
                setSelectedNoteId(null);
                setTitle('');
                setContent('');
              }}
              className="bg-brainai-electric-blue hover:bg-brainai-soft-blue transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="mr-2 h-4 w-4" /> New Note
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Notes List */}
            <div className="md:col-span-1">
              <Card className="h-[500px] border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-800">All Notes</h2>
                </CardHeader>
                <CardContent className="overflow-hidden">
                  <ScrollArea ref={scrollAreaRef} className="h-[400px] w-full rounded-md" onScroll={handleScroll}>
                    <div className="p-4 space-y-3">
                      {isLoading && <p className="text-center text-gray-500">Loading notes...</p>}
                      {isError && <p className="text-center text-red-500">Error fetching notes.</p>}
                      {notes && notes.length === 0 && !isLoading && (
                        <div className="flex flex-col items-center justify-center h-[300px] text-center">
                          <PenLine className="h-12 w-12 text-gray-300 mb-3" />
                          <p className="text-gray-500">No notes yet. Create your first note!</p>
                        </div>
                      )}
                      {notes && notes.map((note) => (
                        <div
                          key={note.id}
                          className={`p-4 rounded-xl cursor-pointer transition-all duration-300 
                            ${selectedNoteId === note.id 
                              ? 'bg-brainai-electric-blue/10 shadow-md border border-brainai-electric-blue/20' 
                              : 'hover:bg-gray-50 border border-gray-100 shadow-sm'}`}
                          onClick={() => handleNoteClick(note)}
                        >
                          <h3 className="font-medium text-gray-900">{note.title}</h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{note.content}</p>
                          {note.updated_at && (
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(note.updated_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Note Editor */}
            <div className="md:col-span-2">
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {selectedNoteId ? 'Edit Note' : 'Create Note'}
                  </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-gray-200 focus:ring-brainai-electric-blue focus:border-brainai-electric-blue text-lg font-medium"
                  />
                  <Textarea
                    placeholder="Start writing..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[250px] border-gray-200 focus:ring-brainai-electric-blue focus:border-brainai-electric-blue"
                  />
                </CardContent>
                <CardFooter className="justify-between border-t pt-4">
                  {selectedNoteId ? (
                    <>
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteNote} 
                        disabled={deleteNoteMutation.isPending}
                        className="shadow-md hover:shadow-lg"
                      >
                        {deleteNoteMutation.isPending ? "Deleting..." : "Delete"}
                      </Button>
                      <Button 
                        onClick={handleUpdateNote} 
                        disabled={updateNoteMutation.isPending}
                        className="bg-brainai-electric-blue hover:bg-brainai-soft-blue transition-all shadow-md hover:shadow-lg"
                      >
                        {updateNoteMutation.isPending ? "Updating..." : "Save Changes"}
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={handleCreateNote} 
                      disabled={createNoteMutation.isPending} 
                      className="ml-auto bg-brainai-electric-blue hover:bg-brainai-soft-blue transition-all shadow-md hover:shadow-lg"
                    >
                      {createNoteMutation.isPending ? "Creating..." : "Create Note"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notes;
