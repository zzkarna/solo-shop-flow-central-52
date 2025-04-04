
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CalendarManager } from '@/components/calendar/CalendarManager';

const CalendarPage = () => {
  return (
    <DashboardLayout>
      <CalendarManager />
    </DashboardLayout>
  );
};

export default CalendarPage;
