
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { NotesManager } from '@/components/notes/NotesManager';

const Notes = () => {
  return (
    <DashboardLayout>
      <NotesManager />
    </DashboardLayout>
  );
};

export default Notes;
