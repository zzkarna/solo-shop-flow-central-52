import React, { useState } from 'react';
import { Clipboard, Plus, Search, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskItem } from '@/components/tasks/TaskItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewTaskDialog } from '@/components/tasks/NewTaskDialog';
import { useAppContext } from '@/context/AppContext';

export function TaskManager() {
  const { tasks } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  
  const filteredTasks = tasks
    .filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(task => 
      filterPriority === 'all' || task.priority === filterPriority
    );
  
  const notStartedTasks = filteredTasks.filter(task => task.status === 'not-started');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in-progress');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const urgentTasks = filteredTasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate <= today && task.status !== 'completed';
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Task Management</h1>
          <p className="text-muted-foreground">
            Organize and prioritize your business tasks.
          </p>
        </div>
        <Button onClick={() => setNewTaskDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={filterPriority}
          onValueChange={setFilterPriority}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="low">Low Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="urgent">
            Urgent
            {urgentTasks.length > 0 && (
              <span className="ml-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                {urgentTasks.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="status">By Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-4">
          <div className="space-y-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))
            ) : (
              <div className="text-center py-12">
                <Clipboard className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No tasks found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || filterPriority !== 'all' ? "Try different filters" : "Create a task to get started"}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="urgent" className="pt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-red-700">
                <AlertCircle className="mr-2 h-5 w-5" />
                Due Today or Overdue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {urgentTasks.length > 0 ? (
                  urgentTasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                  ))
                ) : (
                  <p className="text-center py-4 text-muted-foreground">
                    No urgent tasks found - you're all caught up!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="status" className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-blue-500" />
                  Not Started ({notStartedTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notStartedTasks.length > 0 ? (
                    notStartedTasks.map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">
                      No tasks to start
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-amber-500" />
                  In Progress ({inProgressTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inProgressTasks.length > 0 ? (
                    inProgressTasks.map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">
                      No tasks in progress
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                  Completed ({completedTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedTasks.length > 0 ? (
                    completedTasks.map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">
                      No completed tasks yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <NewTaskDialog 
        open={newTaskDialogOpen} 
        onOpenChange={setNewTaskDialogOpen} 
      />
    </div>
  );
}
