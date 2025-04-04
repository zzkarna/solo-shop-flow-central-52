
import React from 'react';
import { format } from 'date-fns';
import { Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

type TaskStatus = 'not-started' | 'in-progress' | 'completed';
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    priority: TaskPriority;
    dueDate: Date;
    status: TaskStatus;
  };
}

export function TaskItem({ task }: TaskItemProps) {
  const { title, priority, dueDate, status } = task;
  
  const priorityClasses = {
    low: "bg-task-low/10 border-task-low/30 text-task-low",
    medium: "bg-task-medium/10 border-task-medium/30 text-task-medium",
    high: "bg-task-high/10 border-task-high/30 text-task-high",
    urgent: "bg-task-urgent/10 border-task-urgent/30 text-task-urgent"
  };
  
  const statusDisplay = {
    'not-started': 'Not Started',
    'in-progress': 'In Progress',
    'completed': 'Completed'
  };

  const isCompleted = status === 'completed';
  const isOverdue = new Date() > dueDate && status !== 'completed';
  
  return (
    <div className={cn(
      "flex items-center p-3 border rounded-md gap-3",
      isCompleted ? "bg-muted/50" : (isOverdue ? "border-task-urgent/50" : "")
    )}>
      <Checkbox 
        className="h-5 w-5"
        checked={isCompleted}
      />
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium truncate",
          isCompleted && "line-through text-muted-foreground"
        )}>
          {title}
        </p>
        <div className="flex items-center text-xs gap-2 mt-1">
          <span className={cn(
            "px-2 py-0.5 rounded-full",
            priorityClasses[priority]
          )}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </span>
          <span className="text-muted-foreground flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            {format(dueDate, 'MMM d')}
          </span>
          <span className="text-muted-foreground">
            {statusDisplay[status]}
          </span>
        </div>
      </div>
      
      {isOverdue && !isCompleted && (
        <div className="bg-task-urgent/10 text-task-urgent text-xs py-0.5 px-2 rounded-full">
          Overdue
        </div>
      )}
    </div>
  );
}
