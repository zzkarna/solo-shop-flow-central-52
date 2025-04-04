
import React from 'react';
import { 
  CalendarIcon, 
  Clipboard, 
  Clock, 
  FileText, 
  PlusCircle, 
  ShieldCheck, 
  StickyNote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskItem } from '../tasks/TaskItem';
import { FileCard } from '../files/FileCard';
import { CalendarWidget } from '../calendar/CalendarWidget';
import { ComplianceStatus } from '../compliance/ComplianceStatus';
import { NotePreview } from '../notes/NotePreview';

export function DashboardOverview() {
  // Sample tasks for demo - using proper TaskPriority and TaskStatus types
  const recentTasks = [
    { id: '1', title: 'Order new shipping supplies', priority: 'medium' as const, dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: 'not-started' as const },
    { id: '2', title: 'Update product descriptions', priority: 'high' as const, dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), status: 'in-progress' as const },
    { id: '3', title: 'Schedule social media posts', priority: 'low' as const, dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), status: 'not-started' as const },
  ];

  // Sample files for demo
  const recentFiles = [
    { id: '1', name: 'Business License.pdf', type: 'pdf', size: '2.4 MB', modified: '2 days ago' },
    { id: '2', name: 'Q1 Expense Report.xlsx', type: 'xlsx', size: '1.7 MB', modified: '1 week ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shop Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what needs your attention today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-category-tasks/10 border-category-tasks/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Add Task</CardTitle>
              <Clipboard className="h-4 w-4 text-category-tasks" />
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-category-files/10 border-category-files/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Upload File</CardTitle>
              <FileText className="h-4 w-4 text-category-files" />
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              New File
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-category-notes/10 border-category-notes/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Create Note</CardTitle>
              <StickyNote className="h-4 w-4 text-category-notes" />
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Note
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-category-calendar/10 border-category-calendar/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Schedule Event</CardTitle>
              <CalendarIcon className="h-4 w-4 text-category-calendar" />
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Event
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Tasks and Files */}
        <div className="space-y-6 lg:col-span-2">
          {/* Tasks Section */}
          <Card className="animate-fade-in delay-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Tasks</CardTitle>
                  <CardDescription>Your tasks for the week ahead</CardDescription>
                </div>
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentTasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-3 flex justify-between">
              <span className="text-sm text-muted-foreground">
                Showing 3 of 12 tasks
              </span>
              <Button variant="outline" size="sm">
                View All Tasks
              </Button>
            </CardFooter>
          </Card>

          {/* Files Section */}
          <Card className="animate-fade-in delay-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Files</CardTitle>
                  <CardDescription>Access your important documents</CardDescription>
                </div>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentFiles.map(file => (
                  <FileCard key={file.id} file={file} />
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-3 flex justify-between">
              <span className="text-sm text-muted-foreground">
                Showing 2 of 24 files
              </span>
              <Button variant="outline" size="sm">
                View All Files
              </Button>
            </CardFooter>
          </Card>

          {/* Notes Preview */}
          <Card className="animate-fade-in delay-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Notes</CardTitle>
                  <CardDescription>Your latest notes and ideas</CardDescription>
                </div>
                <StickyNote className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <NotePreview 
                title="Product Launch Ideas"
                excerpt="For the summer collection, we should focus on lightweight fabrics and bright colors. Key items to include:"
                date="2 days ago"
                category="Marketing"
              />
            </CardContent>
            <CardFooter className="border-t pt-3 flex justify-between">
              <span className="text-sm text-muted-foreground">
                Showing 1 of 8 notes
              </span>
              <Button variant="outline" size="sm">
                View All Notes
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right column - Calendar and Compliance */}
        <div className="space-y-6">
          {/* Calendar Widget */}
          <Card className="animate-fade-in delay-100">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Calendar</CardTitle>
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>
                Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarWidget />
            </CardContent>
            <CardFooter className="border-t pt-3">
              <Button variant="outline" className="w-full" size="sm">
                Full Calendar View
              </Button>
            </CardFooter>
          </Card>

          {/* Compliance Status */}
          <Card className="animate-fade-in delay-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Compliance Status</CardTitle>
                  <CardDescription>Upcoming regulatory deadlines</CardDescription>
                </div>
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <ComplianceStatus />
            </CardContent>
            <CardFooter className="border-t pt-3">
              <Button variant="outline" className="w-full" size="sm">
                View Compliance Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
