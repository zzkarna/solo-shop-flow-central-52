
import React from 'react';

interface NotePreviewProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

export function NotePreview({ title, excerpt, date, category }: NotePreviewProps) {
  return (
    <div className="border rounded-md p-4 hover:bg-accent/50 transition-colors cursor-pointer">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{title}</h3>
        <span className="text-xs px-2 py-1 bg-category-notes/10 text-category-notes rounded-full">
          {category}
        </span>
      </div>
      
      <p className="text-sm text-muted-foreground line-clamp-3">
        {excerpt}
      </p>
      
      <div className="mt-2 text-xs text-muted-foreground">
        Last edited {date}
      </div>
    </div>
  );
}
