
import React from 'react';
import { FileIcon, FileText, FileType, Image, FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileCardProps {
  file: {
    id: string;
    name: string;
    type: string;
    size: string;
    modified: string;
  };
}

export function FileCard({ file }: FileCardProps) {
  const { name, type, size, modified } = file;
  
  const getFileIcon = () => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'image':
      case 'jpg':
      case 'png':
        return <Image className="h-6 w-6 text-blue-500" />;
      case 'xlsx':
      case 'csv':
        return <FileSpreadsheet className="h-6 w-6 text-green-500" />;
      default:
        return <FileIcon className="h-6 w-6 text-gray-500" />;
    }
  };
  
  return (
    <div className="flex items-center p-3 border rounded-md hover:bg-accent/50 transition-colors cursor-pointer">
      <div className="mr-3">
        {getFileIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <span>{size}</span>
          <span>•</span>
          <span>Modified {modified}</span>
        </div>
      </div>
    </div>
  );
}
