
import React, { useState } from 'react';
import { FileText, FolderPlus, Upload, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCard } from '@/components/files/FileCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewFileDialog } from '@/components/files/NewFileDialog';
import { useAppContext } from '@/context/AppContext';

export function FilesManager() {
  const { files } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [newFileDialogOpen, setNewFileDialogOpen] = useState(false);
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  
  // Filter files based on search term
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // For demo purposes, categorized files
  const importantFiles = files.filter((_, index) => index === 0 || index === 2 || index === 6);
  const recentFiles = files.filter((file) => file.modified.includes('day') || file.modified.includes('Just now'));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">File Management</h1>
          <p className="text-muted-foreground">
            Store and organize all your important business documents.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setNewFileDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
          <Button variant="outline" onClick={() => setNewFolderDialogOpen(true)}>
            <FolderPlus className="mr-2 h-4 w-4" />
            New Folder
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search files..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="important">Important</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFiles.length > 0 ? (
              filteredFiles.map(file => (
                <FileCard key={file.id} file={file} />
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No files found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "Try a different search term" : "Upload files to get started"}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="important" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Important Documents</CardTitle>
              <CardDescription>Key files for your business operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {importantFiles.map(file => (
                  <FileCard key={file.id} file={file} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recent" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recently Modified</CardTitle>
              <CardDescription>Files you've worked with recently</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentFiles.map(file => (
                  <FileCard key={file.id} file={file} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <NewFileDialog 
        open={newFileDialogOpen} 
        onOpenChange={setNewFileDialogOpen} 
      />
    </div>
  );
}
