
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { format } from 'date-fns';

// Define types for our data
export interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
  status: 'not-started' | 'in-progress' | 'completed';
  description?: string;
}

export interface File {
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string;
  category?: string;
}

export interface Note {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  content?: string;
}

export interface NotebookType {
  id: string;
  name: string;
  notes: Note[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'task' | 'meeting' | 'reminder' | 'deadline';
  description?: string;
}

export interface ComplianceItem {
  id: string;
  title: string;
  dueDate: Date;
  description?: string;
  status: 'completed' | 'upcoming' | 'urgent' | 'overdue';
  category: 'tax' | 'license' | 'legal' | 'insurance';
  documents?: string[];
}

interface AppContextType {
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  
  // Files
  files: File[];
  addFile: (file: Omit<File, 'id'>) => void;
  addFolder: (folder: Omit<File, 'id'>) => void;
  
  // Notes
  notebooks: NotebookType[];
  addNote: (notebookId: string, note: Omit<Note, 'id'>) => void;
  addNotebook: (name: string) => void;
  
  // Calendar
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  
  // Compliance
  complianceItems: ComplianceItem[];
  addComplianceItem: (item: Omit<ComplianceItem, 'id'>) => void;
  updateComplianceStatus: (id: string, status: ComplianceItem['status']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Sample data
const initialTasks: Task[] = [
  { id: '1', title: 'Order new shipping supplies', priority: 'medium', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: 'not-started' },
  { id: '2', title: 'Update product descriptions', priority: 'high', dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), status: 'in-progress' },
  { id: '3', title: 'Schedule social media posts', priority: 'low', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), status: 'not-started' },
  { id: '4', title: 'Contact supplier about late delivery', priority: 'high', dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: 'not-started' },
  { id: '5', title: 'Renew domain name', priority: 'medium', dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), status: 'not-started' },
  { id: '6', title: 'Review customer feedback', priority: 'medium', dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), status: 'in-progress' },
  { id: '7', title: 'Update inventory count', priority: 'high', dueDate: new Date(Date.now()), status: 'completed' },
  { id: '8', title: 'Send thank you emails to recent customers', priority: 'low', dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), status: 'not-started' },
];

const initialFiles: File[] = [
  { id: '1', name: 'Business License.pdf', type: 'pdf', size: '2.4 MB', modified: '2 days ago' },
  { id: '2', name: 'Q1 Expense Report.xlsx', type: 'xlsx', size: '1.7 MB', modified: '1 week ago' },
  { id: '3', name: 'Supplier Contract.pdf', type: 'pdf', size: '3.1 MB', modified: '3 weeks ago' },
  { id: '4', name: 'Product Catalog.pdf', type: 'pdf', size: '8.3 MB', modified: '1 month ago' },
  { id: '5', name: 'Marketing Plan 2025.docx', type: 'docx', size: '1.2 MB', modified: '2 days ago' },
  { id: '6', name: 'Logo Files.zip', type: 'zip', size: '15.8 MB', modified: '3 months ago' },
  { id: '7', name: 'Insurance Policy.pdf', type: 'pdf', size: '4.5 MB', modified: '5 months ago' },
  { id: '8', name: 'Product Images.zip', type: 'zip', size: '45.2 MB', modified: '2 weeks ago' },
];

const initialNotebooks: NotebookType[] = [
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

const initialEvents: CalendarEvent[] = [
  { id: '1', title: 'Update product images', date: new Date(), type: 'task' },
  { id: '2', title: 'Supplier call', date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), type: 'meeting', description: 'Discuss new product line' },
  { id: '3', title: 'Sales tax filing', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), type: 'deadline', description: 'Quarterly filing due' },
  { id: '4', title: 'Website maintenance', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), type: 'task' },
  { id: '5', title: 'Social media planning', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), type: 'meeting' },
  { id: '6', title: 'Inventory restock deadline', date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), type: 'deadline' },
  { id: '7', title: 'Customer follow-ups', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), type: 'task' },
  { id: '8', title: 'Marketing campaign launch', date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), type: 'reminder' },
];

const initialComplianceItems: ComplianceItem[] = [
  { 
    id: '1', 
    title: 'Quarterly Sales Tax Filing', 
    dueDate: new Date(2025, 3, 30), // April 30, 2025
    description: 'File Q1 sales tax report with state department of revenue',
    status: 'upcoming',
    category: 'tax'
  },
  { 
    id: '2', 
    title: 'Business License Renewal', 
    dueDate: new Date(2025, 5, 15), // June 15, 2025
    description: 'Annual business license renewal with city office',
    status: 'upcoming',
    category: 'license'
  },
  { 
    id: '3', 
    title: 'Annual Tax Return', 
    dueDate: new Date(2025, 3, 15), // April 15, 2025
    description: 'Federal income tax return for the business',
    status: 'urgent',
    category: 'tax'
  },
  { 
    id: '4', 
    title: 'Insurance Policy Renewal', 
    dueDate: new Date(2025, 2, 10), // March 10, 2025
    description: 'Renew business liability insurance policy',
    status: 'completed',
    category: 'insurance'
  },
  { 
    id: '5', 
    title: 'LLC Annual Report', 
    dueDate: new Date(2025, 0, 15), // January 15, 2025
    description: 'Submit annual LLC report to state',
    status: 'overdue',
    category: 'legal'
  },
  { 
    id: '6', 
    title: 'Sales Tax Permit Renewal', 
    dueDate: new Date(2025, 7, 31), // August 31, 2025
    description: 'Renew sales tax collection permit',
    status: 'upcoming',
    category: 'license'
  },
  { 
    id: '7', 
    title: 'Quarterly Estimated Tax Payment', 
    dueDate: new Date(2025, 6, 15), // July 15, 2025
    description: 'Q2 estimated tax payment',
    status: 'upcoming',
    category: 'tax'
  },
  { 
    id: '8', 
    title: 'Workers Comp Insurance Audit', 
    dueDate: new Date(2025, 1, 28), // February 28, 2025
    description: 'Annual workers compensation insurance audit',
    status: 'overdue',
    category: 'insurance'
  }
];

export const AppProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [notebooks, setNotebooks] = useState<NotebookType[]>(initialNotebooks);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>(initialComplianceItems);

  // Task functions
  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = {
      ...task,
      id: `task-${Date.now()}`
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const updateTaskStatus = (id: string, status: Task['status']) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, status } : task
      )
    );
  };

  // File functions
  const addFile = (file: Omit<File, 'id'>) => {
    const newFile = {
      ...file,
      id: `file-${Date.now()}`
    };
    setFiles(prevFiles => [...prevFiles, newFile]);
  };
  
  // New folder function
  const addFolder = (folder: Omit<File, 'id'>) => {
    const newFolder = {
      ...folder,
      id: `folder-${Date.now()}`
    };
    setFiles(prevFiles => [...prevFiles, newFolder]);
  };

  // Note functions
  const addNote = (notebookId: string, note: Omit<Note, 'id'>) => {
    const newNote = {
      ...note,
      id: `note-${Date.now()}`
    };
    
    setNotebooks(prevNotebooks => 
      prevNotebooks.map(notebook => 
        notebook.id === notebookId 
          ? { ...notebook, notes: [...notebook.notes, newNote] } 
          : notebook
      )
    );
  };

  const addNotebook = (name: string) => {
    const newNotebook = {
      id: `notebook-${Date.now()}`,
      name,
      notes: []
    };
    setNotebooks(prevNotebooks => [...prevNotebooks, newNotebook]);
  };

  // Calendar functions
  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent = {
      ...event,
      id: `event-${Date.now()}`
    };
    setEvents(prevEvents => [...prevEvents, newEvent]);
  };

  // Compliance functions
  const addComplianceItem = (item: Omit<ComplianceItem, 'id'>) => {
    const newItem = {
      ...item,
      id: `compliance-${Date.now()}`
    };
    setComplianceItems(prevItems => [...prevItems, newItem]);
  };

  const updateComplianceStatus = (id: string, status: ComplianceItem['status']) => {
    setComplianceItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const value = {
    tasks,
    addTask,
    updateTaskStatus,
    files,
    addFile,
    addFolder,
    notebooks,
    addNote,
    addNotebook,
    events,
    addEvent,
    complianceItems,
    addComplianceItem,
    updateComplianceStatus
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
