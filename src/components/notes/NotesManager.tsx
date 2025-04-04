
import React, { useState } from 'react';
import { Plus, Search, FolderOpen, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NotePreview } from '@/components/notes/NotePreview';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Note {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  content?: string;
}

interface NotebookType {
  id: string;
  name: string;
  notes: Note[];
}

export function NotesManager() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample notebooks and notes for demo
  const notebooks: NotebookType[] = [
    {
      id: 'marketing',
      name: 'Marketing',
      notes: [
        {
          id: '1',
          title: 'Product Launch Ideas',
          excerpt: 'For the summer collection, we should focus on lightweight fabrics and bright colors. Key items to include:',
          date: '2 days ago',
          category: 'Marketing'
        },
        {
          id: '2',
          title: 'Social Media Schedule',
          excerpt: 'Monday: Product spotlight\nWednesday: Customer testimonial\nFriday: Behind the scenes\nSunday: Weekend special',
          date: '1 week ago',
          category: 'Marketing'
        }
      ]
    },
    {
      id: 'operations',
      name: 'Operations',
      notes: [
        {
          id: '3',
          title: 'Shipping Workflow',
          excerpt: 'Updated process for shipping orders: 1. Verify order details 2. Print shipping label 3. Package items 4. Prepare for pickup',
          date: '3 days ago',
          category: 'Operations'
        },
        {
          id: '4',
          title: 'Inventory Management',
          excerpt: 'New count procedure: 1. Count all items at the beginning of month 2. Update spreadsheet 3. Compare with system numbers',
          date: '2 weeks ago',
          category: 'Operations'
        }
      ]
    },
    {
      id: 'suppliers',
      name: 'Suppliers',
      notes: [
        {
          id: '5',
          title: 'Fabric Vendor Contact Info',
          excerpt: 'Primary: John Smith (555-123-4567)\nBackup: Sarah Jones (555-987-6543)\nEmail: orders@fabricsupplier.com',
          date: '1 month ago',
          category: 'Suppliers'
        }
      ]
    }
  ];
  
  // Flatten all notes for search
  const allNotes = notebooks.flatMap(notebook => notebook.notes);
  
  // Filter notes based on search term
  const filteredNotes = allNotes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get recent notes
  const recentNotes = [...allNotes].sort((a, b) => {
    const dateA = new Date(a.date.replace(' ago', ''));
    const dateB = new Date(b.date.replace(' ago', ''));
    return dateB.getTime() - dateA.getTime();
  }).slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notes</h1>
          <p className="text-muted-foreground">
            Capture ideas, processes, and important information.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
          <Button variant="outline">
            <FolderOpen className="mr-2 h-4 w-4" />
            New Notebook
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Notes</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="notebooks">Notebooks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchTerm ? (
              filteredNotes.length > 0 ? (
                filteredNotes.map(note => (
                  <NotePreview 
                    key={note.id}
                    title={note.title}
                    excerpt={note.excerpt}
                    date={note.date}
                    category={note.category}
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <StickyNote className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No notes found</h3>
                  <p className="text-muted-foreground">
                    Try a different search term
                  </p>
                </div>
              )
            ) : (
              allNotes.map(note => (
                <NotePreview 
                  key={note.id}
                  title={note.title}
                  excerpt={note.excerpt}
                  date={note.date}
                  category={note.category}
                />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="recent" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recently Updated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotes.map(note => (
                  <NotePreview 
                    key={note.id}
                    title={note.title}
                    excerpt={note.excerpt}
                    date={note.date}
                    category={note.category}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notebooks" className="pt-4">
          <div className="space-y-6">
            {notebooks.map(notebook => (
              <Card key={notebook.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FolderOpen className="mr-2 h-5 w-5 text-muted-foreground" />
                    {notebook.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {notebook.notes.length > 0 ? (
                    <div className="space-y-4">
                      {notebook.notes.map(note => (
                        <NotePreview 
                          key={note.id}
                          title={note.title}
                          excerpt={note.excerpt}
                          date={note.date}
                          category={note.category}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">
                      No notes in this notebook
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
