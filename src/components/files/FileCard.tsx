
import React from 'react';
import { FileIcon, FileText, Image, FileSpreadsheet, FileArchive, FolderIcon, MoreVertical, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

interface FileCardProps {
  file: {
    id: string;
    name: string;
    type: string;
    size: string;
    modified: string;
    category?: string;
    tags?: string[];
  };
  selected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onClick?: (id: string) => void;
  onAction?: (action: string, id: string) => void;
}

export function FileCard({ file, selected = false, onSelect, onClick, onAction }: FileCardProps) {
  const { id, name, type, size, modified, category, tags } = file;
  
  const getFileIcon = () => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-9 w-9 text-red-500" />;
      case 'image':
      case 'jpg':
      case 'png':
        return <Image className="h-9 w-9 text-blue-500" />;
      case 'xlsx':
      case 'csv':
        return <FileSpreadsheet className="h-9 w-9 text-green-500" />;
      case 'zip':
        return <FileArchive className="h-9 w-9 text-purple-500" />;
      case 'folder':
        return <FolderIcon className="h-9 w-9 text-amber-400" />;
      default:
        return <FileIcon className="h-9 w-9 text-gray-500" />;
    }
  };

  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(id, !selected);
    }
  };
  
  const handleCardClick = () => {
    if (onClick) {
      onClick(id);
    }
  };
  
  const handleAction = (action: string) => {
    if (onAction) {
      onAction(action, id);
    }
  };
  
  return (
    <div 
      className={cn(
        "relative flex items-center p-3 border rounded-md transition-all cursor-pointer",
        selected ? "bg-accent/80 border-primary" : "hover:bg-accent/50"
      )}
      onClick={handleCardClick}
    >
      {onSelect && (
        <div 
          className="absolute top-2 left-2 z-10"
          onClick={handleCheckboxChange}
        >
          <Checkbox checked={selected} />
        </div>
      )}
      
      <div className={cn("mr-3", onSelect && "ml-6")}>
        {getFileIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <span>{size}</span>
          <span>•</span>
          <span>Modified {modified}</span>
          
          {category && (
            <>
              <span>•</span>
              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[10px]">
                {category}
              </span>
            </>
          )}
        </div>
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, 2).map((tag) => (
              <span 
                key={tag}
                className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded-full"
              >
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded-full">
                +{tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleAction('preview')}>Preview</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction('download')}>Download</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction('rename')}>Rename</DropdownMenuItem>
          {type !== 'folder' && (
            <DropdownMenuItem onClick={() => handleAction('move')}>Move to Folder</DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => handleAction('tags')}>Manage Tags</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => handleAction('delete')}
            className="text-red-600 focus:text-red-600"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
