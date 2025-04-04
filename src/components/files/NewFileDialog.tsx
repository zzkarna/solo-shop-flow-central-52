
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Plus, X } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { toast } from '@/hooks/use-toast';

interface NewFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFolder?: string; // The current folder ID
}

export function NewFileDialog({ open, onOpenChange, currentFolder }: NewFileDialogProps) {
  const { addFile } = useAppContext();
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('pdf');
  const [fileCategory, setFileCategory] = useState('');
  const [fileDescription, setFileDescription] = useState('');
  const [fileSize, setFileSize] = useState('0 KB');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const fileCategories = [
    'Invoices', 
    'Contracts', 
    'Marketing', 
    'Legal', 
    'Finances', 
    'Products', 
    'Other'
  ];
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
      
      // Calculate file size
      const size = file.size;
      let fileSize = '';
      if (size < 1024) {
        fileSize = `${size} B`;
      } else if (size < 1024 * 1024) {
        fileSize = `${(size / 1024).toFixed(1)} KB`;
      } else {
        fileSize = `${(size / (1024 * 1024)).toFixed(1)} MB`;
      }
      setFileSize(fileSize);
      
      // Get file extension
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      setFileType(ext);
    }
  };
  
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
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fileName.trim()) {
      toast({
        title: "Error",
        description: "Please select a file or enter a file name",
        variant: "destructive"
      });
      return;
    }

    addFile({
      name: fileName,
      type: fileType,
      size: fileSize,
      modified: 'Just now',
      category: fileCategory || undefined,
      description: fileDescription || undefined,
      tags: tags.length > 0 ? tags : undefined,
      path: currentFolder // Store the parent folder ID
    });

    toast({
      title: "Success",
      description: "File uploaded successfully",
    });

    // Reset form
    setFileName('');
    setFileType('pdf');
    setFileCategory('');
    setFileDescription('');
    setFileSize('0 KB');
    setTags([]);
    setNewTag('');
    setSelectedFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload New File</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
            />
            <Label 
              htmlFor="file-upload" 
              className="cursor-pointer flex flex-col items-center justify-center gap-2"
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="font-medium">Click to upload a file</span>
              <span className="text-xs text-gray-500">or drag and drop</span>
            </Label>
            {selectedFile && (
              <div className="mt-4 text-sm">
                Selected: {selectedFile.name} ({fileSize})
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filename">File Name</Label>
              <Input
                id="filename"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter file name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Select
                value={fileCategory}
                onValueChange={setFileCategory}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {fileCategories.map(category => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={fileDescription}
              onChange={(e) => setFileDescription(e.target.value)}
              placeholder="Enter a brief description of this file"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="newTag">Tags (Optional)</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addTag} disabled={!newTag}>
                <Plus className="h-3 w-3 mr-1" /> Add
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                id="newTag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter tag and press Enter"
                className="flex-1"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2 min-h-[36px]">
              {tags.map(tag => (
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
              ))}
            </div>
          </div>
          
          {currentFolder && currentFolder !== 'root' && (
            <div className="bg-muted/50 p-2 rounded text-sm">
              This file will be uploaded to the current folder.
            </div>
          )}
          
          <DialogFooter>
            <Button type="submit">Upload File</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
