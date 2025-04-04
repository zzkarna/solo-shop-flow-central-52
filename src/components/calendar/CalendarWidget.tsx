
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'task' | 'meeting' | 'reminder' | 'deadline';
}

export function CalendarWidget() {
  const [date, setDate] = useState<Date>(new Date());
  
  // Sample calendar events for demo
  const events: CalendarEvent[] = [
    { id: '1', title: 'Update product images', date: new Date(), type: 'task' },
    { id: '2', title: 'Supplier call', date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), type: 'meeting' },
    { id: '3', title: 'Sales tax filing', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), type: 'deadline' },
  ];
  
  // Filter events for the selected date
  const todayEvents = events.filter(event => 
    format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  // Define marker styles for dates with events
  const eventDates = events.map(event => format(event.date, 'yyyy-MM-dd'));
  
  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={(newDate) => newDate && setDate(newDate)}
        className="rounded-md border w-full"
        classNames={{
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
        }}
        components={{
          DayContent: (props) => {
            const dateString = format(props.date, 'yyyy-MM-dd');
            const hasEvent = eventDates.includes(dateString);
            
            return (
              <div className="relative w-full h-full flex items-center justify-center">
                <div>{props.date.getDate()}</div>
                {hasEvent && (
                  <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />
                )}
              </div>
            );
          }
        }}
      />
      
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">
          {format(date, "MMMM d, yyyy")} Events
        </h3>
        
        {todayEvents.length > 0 ? (
          <div className="space-y-2">
            {todayEvents.map(event => (
              <div 
                key={event.id} 
                className={cn(
                  "p-2 rounded-md text-sm",
                  event.type === 'task' ? "bg-category-tasks/10" :
                  event.type === 'meeting' ? "bg-category-calendar/10" :
                  event.type === 'deadline' ? "bg-category-compliance/10" :
                  "bg-muted"
                )}
              >
                <div className="font-medium">{event.title}</div>
                <div className="text-xs text-muted-foreground">
                  {format(event.date, "h:mm a")} • {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-4">
            No events scheduled for this day
          </div>
        )}
      </div>
    </div>
  );
}
