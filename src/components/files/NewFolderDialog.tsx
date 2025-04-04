
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Folder } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { toast } from '@/hooks/use-toast';

interface NewFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentFolder?: string;
}

export function NewFolderDialog({ open, onOpenChange, parentFolder }: NewFolderDialogProps) {
  const { addFolder } = useAppContext();
  const [folderName, setFolderName] = useState('');
  const [folderDescription, setFolderDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!folderName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a folder name",
        variant: "destructive"
      });
      return;
    }

    addFolder({
      name: folderName,
      type: 'folder',
      size: '--',
      modified: 'Just now',
      description: folderDescription || undefined,
      path: parentFolder // Store the parent folder ID
    });

    toast({
      title: "Success",
      description: "Folder created successfully",
    });

    // Reset form
    setFolderName('');
    setFolderDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            Enter a name for your new folder
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <div className="flex items-center space-x-2">
              <Folder className="h-5 w-5 text-muted-foreground" />
              <Input
                id="folder-name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="My Folder"
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="folder-description">Description (Optional)</Label>
            <Input
              id="folder-description"
              value={folderDescription}
              onChange={(e) => setFolderDescription(e.target.value)}
              placeholder="What's this folder for?"
              className="flex-1"
            />
          </div>
          
          {parentFolder && parentFolder !== 'root' && (
            <div className="bg-muted/50 p-2 rounded text-sm">
              This folder will be created inside the current folder.
            </div>
          )}
          
          <DialogFooter>
            <Button type="submit">Create Folder</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
