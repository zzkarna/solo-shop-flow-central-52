
import React, { useState } from 'react';
import { FileText, FolderPlus, Upload, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCard } from '@/components/files/FileCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function FilesManager() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample files for demo
  const files = [
    { id: '1', name: 'Business License.pdf', type: 'pdf', size: '2.4 MB', modified: '2 days ago' },
    { id: '2', name: 'Q1 Expense Report.xlsx', type: 'xlsx', size: '1.7 MB', modified: '1 week ago' },
    { id: '3', name: 'Supplier Contract.pdf', type: 'pdf', size: '3.1 MB', modified: '3 weeks ago' },
    { id: '4', name: 'Product Catalog.pdf', type: 'pdf', size: '8.3 MB', modified: '1 month ago' },
    { id: '5', name: 'Marketing Plan 2025.docx', type: 'docx', size: '1.2 MB', modified: '2 days ago' },
    { id: '6', name: 'Logo Files.zip', type: 'zip', size: '15.8 MB', modified: '3 months ago' },
    { id: '7', name: 'Insurance Policy.pdf', type: 'pdf', size: '4.5 MB', modified: '5 months ago' },
    { id: '8', name: 'Product Images.zip', type: 'zip', size: '45.2 MB', modified: '2 weeks ago' },
  ];

  // Filter files based on search term
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // For demo purposes, categorized files
  const importantFiles = files.filter((_, index) => index === 0 || index === 2 || index === 6);
  const recentFiles = files.filter((_, index) => index === 0 || index === 1 || index === 4);

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
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
          <Button variant="outline">
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
    </div>
  );
}
