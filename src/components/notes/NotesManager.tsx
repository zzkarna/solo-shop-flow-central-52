
import React, { useState } from 'react';
import { Plus, Search, FolderOpen, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NotePreview } from '@/components/notes/NotePreview';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewNoteDialog } from '@/components/notes/NewNoteDialog';
import { NewNotebookDialog } from '@/components/notes/NewNotebookDialog';
import { useAppContext } from '@/context/AppContext';

export function NotesManager() {
  const { notebooks } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [newNoteDialogOpen, setNewNoteDialogOpen] = useState(false);
  const [newNotebookDialogOpen, setNewNotebookDialogOpen] = useState(false);
  
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
          <Button onClick={() => setNewNoteDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
          <Button variant="outline" onClick={() => setNewNotebookDialogOpen(true)}>
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
      
      <NewNoteDialog 
        open={newNoteDialogOpen} 
        onOpenChange={setNewNoteDialogOpen} 
      />
      
      <NewNotebookDialog 
        open={newNotebookDialogOpen} 
        onOpenChange={setNewNotebookDialogOpen} 
      />
    </div>
  );
}
