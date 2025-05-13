
import { supabase } from '@/integrations/supabase/client';
import { Note } from '@/types';

// Get all notes for a specific user
export const getNotes = async (userId?: string) => {
  if (!userId) return [];
  
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
  
  return data as Note[];
};

// Create a new note
export const createNote = async ({ 
  userId, 
  title, 
  content 
}: { 
  userId: string; 
  title: string; 
  content: string;
}) => {
  const { data, error } = await supabase
    .from('notes')
    .insert([
      {
        user_id: userId,
        title,
        content
      }
    ])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating note:', error);
    throw error;
  }
  
  return data;
};

// Update an existing note
export const updateNote = async ({
  id,
  title,
  content
}: {
  id: string;
  title: string;
  content: string;
}) => {
  const { data, error } = await supabase
    .from('notes')
    .update({ title, content, updated_at: new Date() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating note:', error);
    throw error;
  }
  
  return data;
};

// Delete a note
export const deleteNote = async (id: string) => {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
  
  return true;
};
