
// This is a read-only file, but we need to ensure it works with our updated context
// We'll create a new enhanced version of TaskItem that connects to our context

import React from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';

interface TaskProps {
  task: {
    id: string;
    title: string;
    priority: 'high' | 'medium' | 'low';
    dueDate: Date;
    status: 'not-started' | 'in-progress' | 'completed';
    description?: string;
  };
}

// Export this directly as TaskItem instead of EnhancedTaskItem
export function TaskItem({ task }: TaskProps) {
  const { updateTaskStatus } = useAppContext();
  
  const priorityStyles = {
    high: "border-red-200 bg-red-50 hover:bg-red-100",
    medium: "border-amber-200 bg-amber-50 hover:bg-amber-100",
    low: "border-green-200 bg-green-50 hover:bg-green-100"
  };
  
  const statusIcons = {
    'not-started': <Clock className="h-4 w-4 text-blue-500" />,
    'in-progress': <Clock className="h-4 w-4 text-amber-500" />,
    'completed': <CheckCircle2 className="h-4 w-4 text-green-500" />
  };
  
  // Calculate if task is overdue
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDate = new Date(task.dueDate);
  taskDate.setHours(0, 0, 0, 0);
  const isOverdue = taskDate < today && task.status !== 'completed';
  
  const getNextStatus = () => {
    switch (task.status) {
      case 'not-started': return 'in-progress';
      case 'in-progress': return 'completed';
      case 'completed': return 'not-started';
      default: return 'not-started';
    }
  };
  
  const handleStatusUpdate = () => {
    const nextStatus = getNextStatus();
    updateTaskStatus(task.id, nextStatus);
  };

  return (
    <div className={cn(
      "p-3 rounded-md border flex items-center gap-3",
      priorityStyles[task.priority],
      task.status === 'completed' && "opacity-70"
    )}>
      <Button 
        variant="ghost" 
        size="icon"
        className="rounded-full p-0"
        onClick={handleStatusUpdate}
      >
        {statusIcons[task.status]}
      </Button>
      
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <p className={cn(
            "font-medium",
            task.status === 'completed' && "line-through text-muted-foreground"
          )}>
            {task.title}
          </p>
          
          <div className="flex items-center gap-2 text-xs mt-1 sm:mt-0">
            <span className={cn(
              "rounded-full px-2 py-0.5 text-xs",
              task.priority === 'high' && "bg-red-100 text-red-800",
              task.priority === 'medium' && "bg-amber-100 text-amber-800",
              task.priority === 'low' && "bg-green-100 text-green-800"
            )}>
              {task.priority}
            </span>
            
            <span className="text-muted-foreground">
              {format(task.dueDate, 'MMM d')}
            </span>
            
            {isOverdue && (
              <span className="flex items-center text-red-600">
                <AlertCircle className="h-3 w-3 mr-1" />
                Overdue
              </span>
            )}
          </div>
        </div>
        
        {task.description && (
          <p className="text-sm text-muted-foreground mt-1 truncate">
            {task.description}
          </p>
        )}
      </div>
    </div>
  );
}

// No longer exporting EnhancedTaskItem
