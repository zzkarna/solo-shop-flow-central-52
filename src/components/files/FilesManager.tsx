import React, { useState, useEffect } from 'react';
import {
  FileText,
  FolderPlus,
  Upload,
  Search,
  Filter,
  FolderIcon,
  Check,
  X,
  Download,
  Trash2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCard } from '@/components/files/FileCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewFileDialog } from '@/components/files/NewFileDialog';
import { NewFolderDialog } from '@/components/files/NewFolderDialog';
import { FilePreviewDialog } from '@/components/files/FilePreviewDialog';
import { FileTagsDialog } from '@/components/files/FileTagsDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppContext } from '@/context/AppContext';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface FolderBreadcrumb {
  id: string;
  name: string;
}

export function FilesManager() {
  const { files, folders, addFolder, deleteFile, updateFileTags } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState('root');
  const [breadcrumbs, setBreadcrumbs] = useState<FolderBreadcrumb[]>([{ id: 'root', name: 'Root' }]);
  const [currentFilter, setCurrentFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [newFileDialogOpen, setNewFileDialogOpen] = useState(false);
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [filePreviewDialogOpen, setFilePreviewDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [fileTagsDialogOpen, setFileTagsDialogOpen] = useState(false);
  
  const filteredItems = [...files, ...folders].filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = item.path === currentFolder || 
                        (currentFolder === 'root' && !item.path);
    const matchesFilter = !currentFilter || 
                        (item.type === currentFilter || 
                        (item.category && item.category === currentFilter));
    
    return matchesSearch && matchesFolder && matchesFilter;
  });
  
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;
    
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'date') {
      comparison = a.modified.localeCompare(b.modified);
    } else if (sortBy === 'size') {
      const sizeA = a.size === '--' ? 0 : parseFloat(a.size);
      const sizeB = b.size === '--' ? 0 : parseFloat(b.size);
      comparison = sizeA - sizeB;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  const importantFiles = files.filter((file) => file.tags?.includes('important') || file.category === 'legal');
  const recentFiles = files.filter((file) => file.modified.includes('day') || file.modified.includes('Just now'));

  const handleFileSelect = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedFileIds([...selectedFileIds, id]);
    } else {
      setSelectedFileIds(selectedFileIds.filter(fileId => fileId !== id));
    }
  };
  
  const handleSelectAll = () => {
    if (selectedFileIds.length === filteredItems.length) {
      setSelectedFileIds([]);
    } else {
      setSelectedFileIds(filteredItems.map(item => item.id));
    }
  };
  
  const handleFileClick = (id: string) => {
    const clickedItem = [...files, ...folders].find(item => item.id === id);
    
    if (clickedItem) {
      if (clickedItem.type === 'folder') {
        setCurrentFolder(id);
        setBreadcrumbs([...breadcrumbs, { id, name: clickedItem.name }]);
        setSelectedFileIds([]);
      } else {
        setSelectedFile(clickedItem);
        setFilePreviewDialogOpen(true);
      }
    }
  };
  
  const handleFileAction = (action: string, id: string) => {
    const actionFile = [...files, ...folders].find(item => item.id === id);
    
    if (!actionFile) return;
    
    switch (action) {
      case 'preview':
        setSelectedFile(actionFile);
        setFilePreviewDialogOpen(true);
        break;
      case 'download':
        toast({
          title: "Download Started",
          description: `Downloading ${actionFile.name}...`,
        });
        break;
      case 'rename':
        toast({
          description: "Rename functionality will be implemented soon.",
        });
        break;
      case 'delete':
        deleteFile(id);
        setSelectedFileIds(selectedFileIds.filter(fileId => fileId !== id));
        toast({
          title: "Success",
          description: `${actionFile.name} deleted.`,
        });
        break;
      case 'move':
        toast({
          description: "Move functionality will be implemented soon.",
        });
        break;
      case 'tags':
        setSelectedFile(actionFile);
        setFileTagsDialogOpen(true);
        break;
    }
  };
  
  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'delete':
        selectedFileIds.forEach(id => deleteFile(id));
        toast({
          title: "Success",
          description: `${selectedFileIds.length} item(s) deleted.`,
        });
        setSelectedFileIds([]);
        break;
      case 'download':
        toast({
          title: "Bulk Download Started",
          description: `Downloading ${selectedFileIds.length} files...`,
        });
        break;
      case 'move':
        toast({
          description: "Move functionality will be implemented soon.",
        });
        break;
    }
  };
  
  const navigateToBreadcrumb = (index: number) => {
    if (index >= breadcrumbs.length) return;
    
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setCurrentFolder(newBreadcrumbs[newBreadcrumbs.length - 1].id);
    setBreadcrumbs(newBreadcrumbs);
    setSelectedFileIds([]);
  };
  
  const navigateUp = () => {
    if (breadcrumbs.length <= 1) return;
    
    const newBreadcrumbs = breadcrumbs.slice(0, breadcrumbs.length - 1);
    setCurrentFolder(newBreadcrumbs[newBreadcrumbs.length - 1].id);
    setBreadcrumbs(newBreadcrumbs);
    setSelectedFileIds([]);
  };
  
  const toggleSort = (sortKey: 'name' | 'date' | 'size') => {
    if (sortBy === sortKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sortKey);
      setSortDirection('asc');
    }
  };
  
  const handleTagsUpdate = (fileId: string, newTags: string[]) => {
    updateFileTags(fileId, newTags);
    setFileTagsDialogOpen(false);
    
    toast({
      title: "Tags Updated",
      description: "The file tags have been updated successfully.",
    });
  };

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

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search files and folders..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              {currentFilter ? `Filter: ${currentFilter}` : "Filter"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setCurrentFilter('')}>
              All Types
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCurrentFilter('pdf')}>
              PDFs
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCurrentFilter('image')}>
              Images
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCurrentFilter('xlsx')}>
              Spreadsheets
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setCurrentFilter('invoices')}>
              Invoices
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCurrentFilter('legal')}>
              Legal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCurrentFilter('marketing')}>
              Marketing
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Sort by: {sortBy} {sortDirection === 'asc' ? '↑' : '↓'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => toggleSort('name')}>
              Name {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleSort('date')}>
              Date Modified {sortBy === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleSort('size')}>
              Size {sortBy === 'size' && (sortDirection === 'asc' ? '↑' : '↓')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={navigateUp}
          disabled={breadcrumbs.length <= 1}
          className="mr-1"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center overflow-x-auto whitespace-nowrap py-2">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.id}>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto py-1 px-2"
                onClick={() => navigateToBreadcrumb(index)}
              >
                {index === 0 ? (
                  <FolderIcon className="h-4 w-4 mr-1" />
                ) : null}
                {crumb.name}
              </Button>
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {selectedFileIds.length > 0 && (
        <div className="flex items-center justify-between bg-accent p-2 rounded-md">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFileIds([])}
            >
              <X className="h-4 w-4 mr-1" /> Clear Selection
            </Button>
            <span className="text-sm">{selectedFileIds.length} item(s) selected</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('download')}
            >
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('move')}
            >
              Move
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600"
              onClick={() => handleBulkAction('delete')}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="important">Important</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-4">
          <div className="mb-2 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
            >
              <Check className="h-4 w-4 mr-1" />
              {selectedFileIds.length === filteredItems.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedItems.length > 0 ? (
              sortedItems.map(item => (
                <FileCard
                  key={item.id}
                  file={item}
                  selected={selectedFileIds.includes(item.id)}
                  onSelect={handleFileSelect}
                  onClick={handleFileClick}
                  onAction={handleFileAction}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No files found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || currentFilter ? "Try a different search term or filter" : "Upload files to get started"}
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
                {importantFiles.length > 0 ? importantFiles.map(file => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onClick={handleFileClick}
                    onAction={handleFileAction}
                  />
                )) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No important files found</p>
                  </div>
                )}
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
                {recentFiles.length > 0 ? recentFiles.map(file => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onClick={handleFileClick}
                    onAction={handleFileAction}
                  />
                )) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No recent files found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <NewFileDialog 
        open={newFileDialogOpen} 
        onOpenChange={setNewFileDialogOpen} 
        currentFolder={currentFolder !== 'root' ? currentFolder : undefined}
      />
      
      <NewFolderDialog
        open={newFolderDialogOpen}
        onOpenChange={setNewFolderDialogOpen}
        parentFolder={currentFolder !== 'root' ? currentFolder : undefined}
      />
      
      <FilePreviewDialog
        open={filePreviewDialogOpen}
        onOpenChange={setFilePreviewDialogOpen}
        file={selectedFile}
      />
      
      <FileTagsDialog
        open={fileTagsDialogOpen}
        onOpenChange={setFileTagsDialogOpen}
        file={selectedFile}
        onSaveTags={handleTagsUpdate}
      />
    </div>
  );
}
