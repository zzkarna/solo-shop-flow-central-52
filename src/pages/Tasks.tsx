
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TaskManager } from '@/components/tasks/TaskManager';

const Tasks = () => {
  return (
    <DashboardLayout>
      <TaskManager />
    </DashboardLayout>
  );
};

export default Tasks;
