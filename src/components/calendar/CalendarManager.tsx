
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday } from 'date-fns';
import { Plus, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { NewEventDialog } from '@/components/calendar/NewEventDialog';
import { useAppContext } from '@/context/AppContext';

export function CalendarManager() {
  const { events } = useAppContext();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [newEventDialogOpen, setNewEventDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  
  // Get days in current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Calculate days from previous month to create complete weeks
  const startDay = new Date(monthStart).getDay();
  const daysFromPrevMonth = startDay === 0 ? 6 : startDay - 1; // Adjust for Monday start
  
  // Get events for the selected date (for day view)
  const selectedDateEvents = events.filter(event => 
    selectedDay && isSameDay(event.date, selectedDay)
  );
  
  // Helper function to get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };
  
  // Navigation functions
  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentDate(prevMonth);
  };
  
  const goToNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentDate(nextMonth);
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setCurrentDate(day);
    
    if (viewMode !== 'day') {
      setViewMode('day');
    }
  };
  
  const handleNewEvent = () => {
    setNewEventDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Schedule and manage your business events and deadlines.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={goToToday}>
            Today
          </Button>
          <Button onClick={handleNewEvent}>
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousMonth}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold px-2 min-w-[180px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextMonth}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        <Select
          value={viewMode}
          onValueChange={(value) => setViewMode(value as 'month' | 'week' | 'day')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Month View</SelectItem>
            <SelectItem value="week">Week View</SelectItem>
            <SelectItem value="day">Day View</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {viewMode === 'month' && (
        <Card>
          <CardContent className="p-4">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-px mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center py-2 font-medium text-sm">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-100">
              {/* Render empty cells for days from previous month */}
              {Array.from({ length: daysFromPrevMonth }).map((_, index) => (
                <div key={`prev-${index}`} className="bg-white h-24 p-1 text-gray-400" />
              ))}
              
              {/* Render days of current month */}
              {daysInMonth.map((day) => {
                const dayEvents = getEventsForDate(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isSelectedDay = selectedDay && isSameDay(day, selectedDay);
                
                return (
                  <div 
                    key={day.toString()}
                    className={cn(
                      "bg-white h-24 p-1 relative",
                      !isCurrentMonth && "text-gray-400",
                      isSelectedDay && "bg-blue-50",
                      "hover:bg-gray-50 cursor-pointer"
                    )}
                    onClick={() => handleDayClick(day)}
                  >
                    <div className={cn(
                      "flex justify-center items-center w-6 h-6 rounded-full text-sm",
                      isToday(day) && "bg-primary text-primary-foreground font-semibold",
                      !isToday(day) && isSelectedDay && "font-semibold"
                    )}>
                      {format(day, 'd')}
                    </div>
                    
                    {dayEvents.length > 0 && (
                      <div className="mt-1 max-h-[72px] overflow-hidden">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div 
                            key={event.id}
                            className={cn(
                              "text-xs px-1 py-0.5 mb-1 rounded truncate",
                              event.type === 'task' && "bg-blue-100 text-blue-800",
                              event.type === 'meeting' && "bg-green-100 text-green-800",
                              event.type === 'deadline' && "bg-red-100 text-red-800",
                              event.type === 'reminder' && "bg-amber-100 text-amber-800"
                            )}
                          >
                            {event.title}
                          </div>
                        ))}
                        
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-center text-gray-500">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      
      {viewMode === 'day' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDay ? format(selectedDay, 'EEEE, MMMM d, yyyy') : format(currentDate, 'EEEE, MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <div 
                    key={event.id}
                    className={cn(
                      "p-3 rounded-md border",
                      event.type === 'task' && "border-blue-200 bg-blue-50",
                      event.type === 'meeting' && "border-green-200 bg-green-50",
                      event.type === 'deadline' && "border-red-200 bg-red-50",
                      event.type === 'reminder' && "border-amber-200 bg-amber-50"
                    )}
                  >
                    <div className="flex justify-between">
                      <h3 className="font-medium">{event.title}</h3>
                      <span className="text-sm capitalize">{event.type}</span>
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.description}
                      </p>
                    )}
                    <div className="text-xs text-muted-foreground mt-2">
                      {format(event.date, 'h:mm a')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No events scheduled</h3>
                <p className="text-muted-foreground">
                  Click the "New Event" button to add an event to this day.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {viewMode === 'week' && (
        <Card>
          <CardContent className="p-4">
            <div className="text-center py-8">
              <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Week View</h3>
              <p className="text-muted-foreground">
                Week view will be implemented in the next version.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      <NewEventDialog 
        open={newEventDialogOpen} 
        onOpenChange={setNewEventDialogOpen}
        initialDate={selectedDay || currentDate}
      />
    </div>
  );
}
