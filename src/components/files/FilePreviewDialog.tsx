
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileIcon, FileText, Image, FileSpreadsheet, FileArchive } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface FilePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: {
    id: string;
    name: string;
    type: string;
    size: string;
    modified: string;
    category?: string;
    tags?: string[];
    description?: string;
    uploadedBy?: string;
    path?: string;
  } | null;
}

export function FilePreviewDialog({ open, onOpenChange, file }: FilePreviewDialogProps) {
  if (!file) return null;
  
  const getFilePreview = () => {
    switch (file.type) {
      case 'image':
      case 'jpg':
      case 'png':
        // This would be a placeholder. In a real app, you'd use the actual file URL
        return (
          <div className="flex justify-center my-4">
            <div className="bg-gray-100 rounded-md p-12 flex items-center justify-center">
              <Image className="h-20 w-20 text-gray-400" />
              <p className="text-sm text-gray-500">Image preview placeholder</p>
            </div>
          </div>
        );
      case 'pdf':
        return (
          <div className="flex justify-center my-4">
            <div className="bg-gray-100 rounded-md p-12 flex flex-col items-center justify-center">
              <FileText className="h-20 w-20 text-red-500" />
              <p className="text-sm text-gray-500 mt-2">PDF preview placeholder</p>
            </div>
          </div>
        );
      case 'xlsx':
      case 'csv':
        return (
          <div className="flex justify-center my-4">
            <div className="bg-gray-100 rounded-md p-12 flex flex-col items-center justify-center">
              <FileSpreadsheet className="h-20 w-20 text-green-500" />
              <p className="text-sm text-gray-500 mt-2">Spreadsheet preview placeholder</p>
            </div>
          </div>
        );
      case 'zip':
        return (
          <div className="flex justify-center my-4">
            <div className="bg-gray-100 rounded-md p-12 flex flex-col items-center justify-center">
              <FileArchive className="h-20 w-20 text-purple-500" />
              <p className="text-sm text-gray-500 mt-2">Archive file - preview not available</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex justify-center my-4">
            <div className="bg-gray-100 rounded-md p-12 flex flex-col items-center justify-center">
              <FileIcon className="h-20 w-20 text-gray-500" />
              <p className="text-sm text-gray-500 mt-2">No preview available</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {file.name}
            {file.category && (
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                {file.category}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        {getFilePreview()}
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium">File Size</p>
              <p className="text-sm text-muted-foreground">{file.size}</p>
            </div>
            <div>
              <p className="text-sm font-medium">File Type</p>
              <p className="text-sm text-muted-foreground">{file.type.toUpperCase()}</p>
            </div>
            {file.uploadedBy && (
              <div>
                <p className="text-sm font-medium">Uploaded By</p>
                <p className="text-sm text-muted-foreground">{file.uploadedBy}</p>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium">Modified</p>
              <p className="text-sm text-muted-foreground">{file.modified}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Location</p>
              <p className="text-sm text-muted-foreground">{file.path || 'Root'}</p>
            </div>
            {file.tags && file.tags.length > 0 && (
              <div>
                <p className="text-sm font-medium">Tags</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {file.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {file.description && (
          <div className="mt-4">
            <p className="text-sm font-medium">Description</p>
            <p className="text-sm text-muted-foreground">{file.description}</p>
          </div>
        )}
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
