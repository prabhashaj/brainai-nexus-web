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
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUser } from '@/hooks/useUser';

const Notes = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
      // You can perform actions when the user is near the bottom of the scroll area
      if (isAtBottom) {
        // console.log("Reached the bottom of the scroll area!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Notes List */}
        <div className="md:col-span-1">
          <Card className="h-[500px]">
            <CardHeader>
              <h2 className="text-lg font-semibold">Your Notes</h2>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <ScrollArea ref={scrollAreaRef} className="h-[400px] w-full rounded-md border" onScroll={handleScroll}>
                <div className="p-4">
                  {isLoading && <p>Loading notes...</p>}
                  {isError && <p>Error fetching notes.</p>}
                  {notes && notes.map((note) => (
                    <div
                      key={note.id}
                      className={`mb-2 p-3 rounded-md cursor-pointer hover:bg-gray-200 ${selectedNoteId === note.id ? 'bg-gray-200' : ''}`}
                      onClick={() => handleNoteClick(note)}
                    >
                      <h3 className="font-medium">{note.title}</h3>
                      <p className="text-sm text-gray-500 truncate">{note.content}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Note Editor */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">{selectedNoteId ? 'Edit Note' : 'Create Note'}</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
              />
            </CardContent>
            <CardFooter className="justify-between">
              {selectedNoteId ? (
                <>
                  <Button variant="destructive" onClick={handleDeleteNote} disabled={deleteNoteMutation.isPending}>
                    {deleteNoteMutation.isPending ? "Deleting..." : "Delete"}
                  </Button>
                  <Button onClick={handleUpdateNote} disabled={updateNoteMutation.isPending}>
                    {updateNoteMutation.isPending ? "Updating..." : "Update"}
                  </Button>
                </>
              ) : (
                <Button onClick={handleCreateNote} disabled={createNoteMutation.isPending}>
                  {createNoteMutation.isPending ? "Creating..." : "Create"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notes;
