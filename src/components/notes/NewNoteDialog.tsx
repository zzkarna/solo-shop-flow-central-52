
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/context/AppContext';
import { toast } from '@/hooks/use-toast';

interface NewNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewNoteDialog({ open, onOpenChange }: NewNoteDialogProps) {
  const { notebooks, addNote } = useAppContext();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notebookId, setNotebookId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a note title",
        variant: "destructive"
      });
      return;
    }
    
    if (!notebookId) {
      toast({
        title: "Error",
        description: "Please select a notebook",
        variant: "destructive"
      });
      return;
    }

    const selectedNotebook = notebooks.find(nb => nb.id === notebookId);
    
    if (!selectedNotebook) {
      toast({
        title: "Error",
        description: "Selected notebook not found",
        variant: "destructive"
      });
      return;
    }

    addNote(notebookId, {
      title,
      excerpt: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
      content,
      date: 'Just now',
      category: selectedNotebook.name
    });

    toast({
      title: "Success",
      description: "Note created successfully",
    });

    // Reset form
    setTitle('');
    setContent('');
    setNotebookId('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Note Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notebook">Notebook</Label>
            <Select
              value={notebookId}
              onValueChange={setNotebookId}
            >
              <SelectTrigger id="notebook">
                <SelectValue placeholder="Select notebook" />
              </SelectTrigger>
              <SelectContent>
                {notebooks.map(notebook => (
                  <SelectItem key={notebook.id} value={notebook.id}>
                    {notebook.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter note content"
              rows={6}
            />
          </div>
          
          <DialogFooter>
            <Button type="submit">Create Note</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
