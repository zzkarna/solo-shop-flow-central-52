
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Search, Shield, Calendar, AlertTriangle, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { NewComplianceItemDialog } from '@/components/compliance/NewComplianceItemDialog';
import { useAppContext } from '@/context/AppContext';

export function ComplianceManager() {
  const { complianceItems, updateComplianceStatus } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [newComplianceItemDialogOpen, setNewComplianceItemDialogOpen] = useState(false);
  
  // Filter items based on search term
  const filteredItems = complianceItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Group items by status
  const overdueItems = filteredItems.filter(item => item.status === 'overdue');
  const urgentItems = filteredItems.filter(item => item.status === 'urgent');
  const upcomingItems = filteredItems.filter(item => item.status === 'upcoming');
  const completedItems = filteredItems.filter(item => item.status === 'completed');
  
  // Calculate compliance progress
  const totalItems = complianceItems.length;
  const completedCount = complianceItems.filter(item => item.status === 'completed').length;
  const completionPercentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;
  
  // Status icons and classes
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
  
  const categoryIcons = {
    tax: <span className="text-green-600">💰</span>,
    license: <span className="text-blue-600">📄</span>,
    legal: <span className="text-purple-600">⚖️</span>,
    insurance: <span className="text-amber-600">🔒</span>
  };
  
  const handleMarkCompleted = (id: string) => {
    updateComplianceStatus(id, 'completed');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Compliance Management</h1>
          <p className="text-muted-foreground">
            Track and manage your business compliance requirements.
          </p>
        </div>
        <Button onClick={() => setNewComplianceItemDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Compliance Item
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search compliance items..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Compliance Status</CardTitle>
            <CardDescription>
              {overdueItems.length > 0 ? 
                `You have ${overdueItems.length} overdue item${overdueItems.length === 1 ? '' : 's'}` : 
                'All compliance items are up to date'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Compliance</span>
                <span className="text-sm text-muted-foreground">{completedCount}/{totalItems} Complete</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
            
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Items</TabsTrigger>
                <TabsTrigger value="attention" className="relative">
                  Needs Attention
                  {(overdueItems.length + urgentItems.length) > 0 && (
                    <span className="ml-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      {overdueItems.length + urgentItems.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="space-y-3">
                  {filteredItems.length > 0 ? filteredItems.map(item => (
                    <div 
                      key={item.id} 
                      className={cn(
                        "flex items-center p-3 border rounded-md gap-3",
                        statusClasses[item.status]
                      )}
                    >
                      <div>
                        {statusIcons[item.status]}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium truncate flex items-center gap-2">
                            {categoryIcons[item.category]}
                            {item.title}
                          </p>
                          <span className="text-xs capitalize whitespace-nowrap ml-2">
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Due: {format(item.dueDate, 'MMM d, yyyy')}
                        </p>
                      </div>
                      
                      {item.status !== 'completed' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="whitespace-nowrap"
                          onClick={() => handleMarkCompleted(item.id)}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No compliance items found</h3>
                      <p className="text-muted-foreground">
                        {searchTerm ? "Try a different search term" : "Add a compliance item to get started"}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="attention">
                {overdueItems.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-red-700 font-medium mb-3 flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Overdue
                    </h3>
                    <div className="space-y-3">
                      {overdueItems.map(item => (
                        <div 
                          key={item.id} 
                          className={cn(
                            "flex items-center p-3 border rounded-md gap-3",
                            statusClasses[item.status]
                          )}
                        >
                          <div>
                            {statusIcons[item.status]}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate flex items-center gap-2">
                              {categoryIcons[item.category]}
                              {item.title}
                            </p>
                            <p className="text-xs">
                              Due: {format(item.dueDate, 'MMM d, yyyy')}
                            </p>
                            {item.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                          
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="whitespace-nowrap"
                            onClick={() => handleMarkCompleted(item.id)}
                          >
                            Mark Complete
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {urgentItems.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-amber-700 font-medium mb-3 flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Urgent
                    </h3>
                    <div className="space-y-3">
                      {urgentItems.map(item => (
                        <div 
                          key={item.id} 
                          className={cn(
                            "flex items-center p-3 border rounded-md gap-3",
                            statusClasses[item.status]
                          )}
                        >
                          <div>
                            {statusIcons[item.status]}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate flex items-center gap-2">
                              {categoryIcons[item.category]}
                              {item.title}
                            </p>
                            <p className="text-xs">
                              Due: {format(item.dueDate, 'MMM d, yyyy')}
                            </p>
                            {item.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                          
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="whitespace-nowrap"
                            onClick={() => handleMarkCompleted(item.id)}
                          >
                            Mark Complete
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {overdueItems.length === 0 && urgentItems.length === 0 && (
                  <div className="text-center py-8">
                    <Check className="h-12 w-12 mx-auto text-green-500" />
                    <h3 className="mt-4 text-lg font-medium">All caught up!</h3>
                    <p className="text-muted-foreground">
                      No urgent or overdue compliance items.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingItems.length > 0 ? (
              <div className="space-y-3">
                {upcomingItems.slice(0, 5).map(item => (
                  <div 
                    key={item.id} 
                    className="flex items-center p-3 border rounded-md gap-2 hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate flex items-center gap-2">
                        {categoryIcons[item.category]}
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Due: {format(item.dueDate, 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">
                No upcoming deadlines
              </p>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <Button variant="outline" size="sm" className="w-full">
              View Calendar
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <NewComplianceItemDialog 
        open={newComplianceItemDialogOpen} 
        onOpenChange={setNewComplianceItemDialogOpen} 
      />
    </div>
  );
}
