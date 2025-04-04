
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppContext } from '@/context/AppContext';
import { toast } from '@/hooks/use-toast';

interface NewNotebookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewNotebookDialog({ open, onOpenChange }: NewNotebookDialogProps) {
  const { addNotebook } = useAppContext();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a notebook name",
        variant: "destructive"
      });
      return;
    }

    addNotebook(name);

    toast({
      title: "Success",
      description: "Notebook created successfully",
    });

    // Reset form
    setName('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Notebook</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Notebook Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter notebook name"
            />
          </div>
          
          <DialogFooter>
            <Button type="submit">Create Notebook</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
