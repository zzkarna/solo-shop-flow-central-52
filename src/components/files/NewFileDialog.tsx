
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { toast } from '@/hooks/use-toast';

interface NewFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewFileDialog({ open, onOpenChange }: NewFileDialogProps) {
  const { addFile } = useAppContext();
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('pdf');
  const [fileCategory, setFileCategory] = useState('');
  const [fileSize, setFileSize] = useState('0 KB');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
      category: fileCategory || undefined
    });

    toast({
      title: "Success",
      description: "File uploaded successfully",
    });

    // Reset form
    setFileName('');
    setFileType('pdf');
    setFileCategory('');
    setFileSize('0 KB');
    setSelectedFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
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
          
          <DialogFooter>
            <Button type="submit">Upload File</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
