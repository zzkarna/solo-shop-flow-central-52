
import React from 'react';
import { AlertTriangle, Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface ComplianceItem {
  id: string;
  title: string;
  dueDate: Date;
  status: 'completed' | 'upcoming' | 'urgent' | 'overdue';
}

export function ComplianceStatus() {
  // Sample compliance items for demo
  const complianceItems: ComplianceItem[] = [
    { 
      id: '1', 
      title: 'Quarterly Sales Tax Filing', 
      dueDate: new Date(2025, 3, 30), // April 30, 2025
      status: 'upcoming'
    },
    { 
      id: '2', 
      title: 'Business License Renewal', 
      dueDate: new Date(2025, 5, 15), // June 15, 2025
      status: 'upcoming'
    },
    { 
      id: '3', 
      title: 'Annual Tax Return', 
      dueDate: new Date(2025, 3, 15), // April 15, 2025
      status: 'urgent'
    }
  ];
  
  const totalItems = complianceItems.length;
  const completedItems = complianceItems.filter(item => item.status === 'completed').length;
  const completionPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  
  const statusIcons = {
    completed: <Check className="h-4 w-4 text-green-500" />,
    upcoming: <Clock className="h-4 w-4 text-blue-500" />,
    urgent: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    overdue: <AlertTriangle className="h-4 w-4 text-red-500" />
  };
  
  const statusClasses = {
    completed: "bg-green-50 text-green-700 border-green-200",
    upcoming: "bg-blue-50 text-blue-700 border-blue-200",
    urgent: "bg-amber-50 text-amber-700 border-amber-200",
    overdue: "bg-red-50 text-red-700 border-red-200"
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Compliance Progress</span>
          <span className="text-sm text-muted-foreground">{completedItems}/{totalItems} Complete</span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </div>
      
      <div className="space-y-3 mt-4">
        {complianceItems.map(item => (
          <div key={item.id} className={cn(
            "flex items-center p-3 border rounded-md gap-3",
            statusClasses[item.status]
          )}>
            <div>
              {statusIcons[item.status]}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.title}</p>
              <p className="text-xs">
                Due: {item.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
