
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';

interface FileTagsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: {
    id: string;
    name: string;
    tags?: string[];
  } | null;
  onSaveTags: (fileId: string, tags: string[]) => void;
}

export function FileTagsDialog({ open, onOpenChange, file, onSaveTags }: FileTagsDialogProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  // Suggested tags for quick selection
  const suggestedTags = [
    'important', 'tax', 'legal', 'archived', 'draft', 'final', 
    '2024', '2025', 'marketing', 'invoice'
  ];
  
  useEffect(() => {
    if (file && file.tags) {
      setTags([...file.tags]);
    } else {
      setTags([]);
    }
  }, [file]);
  
  const addTag = () => {
    if (!newTag.trim()) return;
    
    // Don't add duplicates
    if (tags.includes(newTag.trim().toLowerCase())) {
      setNewTag('');
      return;
    }
    
    setTags([...tags, newTag.trim().toLowerCase()]);
    setNewTag('');
  };
  
  const addSuggestedTag = (tag: string) => {
    if (tags.includes(tag)) return;
    setTags([...tags, tag]);
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (file) {
      onSaveTags(file.id, tags);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  
  if (!file) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Tags for {file.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newTag">Add Tag</Label>
            <div className="flex gap-2">
              <Input
                id="newTag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter tag name"
                className="flex-1"
              />
              <Button type="button" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Current Tags</Label>
            <div className="min-h-[40px] p-2 border rounded-md flex flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="flex items-center gap-1 py-1"
                  >
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag(tag)} 
                    />
                  </Badge>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No tags added yet</div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Suggested Tags</Label>
            <div className="flex flex-wrap gap-2">
              {suggestedTags
                .filter(tag => !tags.includes(tag))
                .map(tag => (
                  <Badge 
                    key={tag} 
                    variant="outline"
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => addSuggestedTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit">Save Tags</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
