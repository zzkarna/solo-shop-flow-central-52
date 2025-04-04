
import React, { createContext, useState, useContext, ReactNode } from 'react';

// File type
export interface File {
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string;
  category?: string;
  description?: string;
  tags?: string[];
  path?: string; // Parent folder ID
}

// Folder type (extends File for simplicity)
export interface Folder extends File {
  type: 'folder';
}

// Task type
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  status: 'not-started' | 'in-progress' | 'completed';
}

// Calendar event type
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  type: 'meeting' | 'task' | 'reminder' | 'deadline';
}

// Compliance item type
export interface ComplianceItem {
  id: string;
  title: string;
  description?: string;
  category: 'tax' | 'license' | 'legal' | 'insurance';
  dueDate: Date;
  status: 'upcoming' | 'urgent' | 'overdue' | 'completed';
}

// Note type
export interface Note {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
}

// Notebook type
export interface Notebook {
  id: string;
  name: string;
  notes: Note[];
}

// Context type
interface AppContextType {
  // Files
  files: File[];
  addFile: (file: Omit<File, 'id'>) => void;
  deleteFile: (id: string) => void;
  updateFileTags: (id: string, tags: string[]) => void;
  
  // Folders
  folders: Folder[];
  addFolder: (folder: Omit<Folder, 'id'>) => void;
  
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  
  // Events
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  
  // Compliance Items
  complianceItems: ComplianceItem[];
  addComplianceItem: (item: Omit<ComplianceItem, 'id'>) => void;
  updateComplianceStatus: (id: string, status: ComplianceItem['status']) => void;
  
  // Notebooks & Notes
  notebooks: Notebook[];
  addNotebook: (name: string) => void;
  addNote: (notebookId: string, note: Omit<Note, 'id'>) => void;
}

// Create context with default values
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  // Files state
  const [files, setFiles] = useState<File[]>([
    { 
      id: '1', 
      name: 'Business License.pdf', 
      type: 'pdf', 
      size: '2.4 MB', 
      modified: '2 days ago',
      category: 'legal',
      tags: ['important', 'license']
    },
    { 
      id: '2', 
      name: 'Q1 Expense Report.xlsx', 
      type: 'xlsx', 
      size: '1.7 MB', 
      modified: '1 week ago',
      category: 'finances'
    },
    { 
      id: '3', 
      name: 'Product Catalog.pdf', 
      type: 'pdf', 
      size: '5.2 MB', 
      modified: '2 weeks ago',
      category: 'products'
    },
    { 
      id: '4', 
      name: 'Logo.png', 
      type: 'image', 
      size: '0.8 MB', 
      modified: '1 month ago',
      category: 'marketing'
    },
    { 
      id: '5', 
      name: 'Supplier Contract.pdf', 
      type: 'pdf', 
      size: '3.1 MB', 
      modified: '3 weeks ago',
      category: 'legal',
      tags: ['contract', 'supplier']
    },
    { 
      id: '6', 
      name: 'Store Photos.zip', 
      type: 'zip', 
      size: '24.5 MB', 
      modified: '1 month ago',
      category: 'marketing'
    },
    { 
      id: '7', 
      name: 'Monthly Sales Data.xlsx', 
      type: 'xlsx', 
      size: '1.9 MB', 
      modified: '3 days ago',
      category: 'finances',
      tags: ['sales', 'monthly']
    }
  ]);
  
  // Folders state
  const [folders, setFolders] = useState<Folder[]>([
    {
      id: 'folder-1',
      name: 'Legal Documents',
      type: 'folder',
      size: '--',
      modified: '1 week ago',
      category: 'legal'
    },
    {
      id: 'folder-2',
      name: 'Financial Reports',
      type: 'folder',
      size: '--',
      modified: '3 days ago',
      category: 'finances'
    }
  ]);

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: 't1', 
      title: 'Order new shipping supplies', 
      priority: 'medium', 
      dueDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), 
      status: 'not-started' 
    },
    { 
      id: 't2', 
      title: 'Update product descriptions', 
      priority: 'high', 
      dueDate: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000), 
      status: 'in-progress' 
    },
    { 
      id: 't3', 
      title: 'Schedule social media posts', 
      priority: 'low', 
      dueDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000), 
      status: 'not-started' 
    },
  ]);
  
  // Events state
  const [events, setEvents] = useState<CalendarEvent[]>([
    { 
      id: 'e1', 
      title: 'Supplier Meeting', 
      date: new Date(), 
      type: 'meeting' 
    },
    { 
      id: 'e2', 
      title: 'Product Photography', 
      date: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), 
      type: 'task' 
    },
    { 
      id: 'e3', 
      title: 'Sales Tax Filing', 
      date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), 
      type: 'deadline' 
    },
  ]);
  
  // Compliance items state
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([
    { 
      id: 'c1', 
      title: 'Quarterly Sales Tax Filing', 
      category: 'tax', 
      dueDate: new Date(2025, 3, 30), // April 30, 2025 
      status: 'upcoming' 
    },
    { 
      id: 'c2', 
      title: 'Business License Renewal', 
      category: 'license', 
      dueDate: new Date(2025, 5, 15), // June 15, 2025
      status: 'upcoming' 
    },
    { 
      id: 'c3', 
      title: 'Annual Tax Return', 
      category: 'tax', 
      dueDate: new Date(2025, 3, 15), // April 15, 2025
      status: 'urgent' 
    },
  ]);
  
  // Notebooks state
  const [notebooks, setNotebooks] = useState<Notebook[]>([
    {
      id: 'nb1',
      name: 'Marketing',
      notes: [
        {
          id: 'n1',
          title: 'Product Launch Ideas',
          excerpt: 'For the summer collection, we should focus on lightweight fabrics and bright colors. Key items to include:',
          content: 'For the summer collection, we should focus on lightweight fabrics and bright colors. Key items to include: sundresses, linen shirts, and beach accessories. We can also partner with local influencers for promotion.',
          date: '2 days ago',
          category: 'Marketing'
        }
      ]
    },
    {
      id: 'nb2',
      name: 'Operations',
      notes: [
        {
          id: 'n2',
          title: 'Shipping Process Improvements',
          excerpt: 'Current shipping times are too long. We should consider the following improvements:',
          content: 'Current shipping times are too long. We should consider the following improvements: partnering with a new logistics company, pre-packaging common orders, and implementing batch processing for shipping labels.',
          date: '1 week ago',
          category: 'Operations'
        }
      ]
    }
  ]);

  // File operations
  const addFile = (file: Omit<File, 'id'>) => {
    const newFile = { ...file, id: `file-${Date.now()}` };
    setFiles([...files, newFile]);
  };
  
  const deleteFile = (id: string) => {
    // Check if it's a file
    const fileIndex = files.findIndex(file => file.id === id);
    if (fileIndex !== -1) {
      setFiles(files.filter(file => file.id !== id));
      return;
    }
    
    // Check if it's a folder
    const folderIndex = folders.findIndex(folder => folder.id === id);
    if (folderIndex !== -1) {
      // Delete folder
      setFolders(folders.filter(folder => folder.id !== id));
      
      // Delete all files in this folder
      setFiles(files.filter(file => file.path !== id));
      
      // TODO: In a real app, we would recursively delete subfolders too
      return;
    }
  };
  
  const updateFileTags = (id: string, tags: string[]) => {
    setFiles(files.map(file => 
      file.id === id ? { ...file, tags } : file
    ));
  };
  
  // Folder operations
  const addFolder = (folder: Omit<Folder, 'id'>) => {
    const newFolder = { ...folder, id: `folder-${Date.now()}` };
    setFolders([...folders, newFolder]);
  };

  // Task operations
  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = { ...task, id: `t${tasks.length + 1}` };
    setTasks([...tasks, newTask]);
  };
  
  const updateTaskStatus = (id: string, status: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status } : task
    ));
  };
  
  // Calendar event operations
  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent = { ...event, id: `e${events.length + 1}` };
    setEvents([...events, newEvent]);
  };
  
  // Compliance item operations
  const addComplianceItem = (item: Omit<ComplianceItem, 'id'>) => {
    const newItem = { ...item, id: `c${complianceItems.length + 1}` };
    setComplianceItems([...complianceItems, newItem]);
  };
  
  const updateComplianceStatus = (id: string, status: ComplianceItem['status']) => {
    setComplianceItems(complianceItems.map(item => 
      item.id === id ? { ...item, status } : item
    ));
  };
  
  // Notebook operations
  const addNotebook = (name: string) => {
    const newNotebook = { 
      id: `nb${notebooks.length + 1}`,
      name,
      notes: []
    };
    setNotebooks([...notebooks, newNotebook]);
  };
  
  // Note operations
  const addNote = (notebookId: string, note: Omit<Note, 'id'>) => {
    const newNote = { ...note, id: `n${Date.now()}` };
    
    setNotebooks(notebooks.map(notebook => 
      notebook.id === notebookId
        ? { ...notebook, notes: [...notebook.notes, newNote] }
        : notebook
    ));
  };

  return (
    <AppContext.Provider
      value={{
        files,
        addFile,
        deleteFile,
        updateFileTags,
        folders,
        addFolder,
        tasks,
        addTask,
        updateTaskStatus,
        events,
        addEvent,
        complianceItems,
        addComplianceItem,
        updateComplianceStatus,
        notebooks,
        addNotebook,
        addNote
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
};
