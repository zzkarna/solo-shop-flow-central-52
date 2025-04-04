
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FilesManager } from '@/components/files/FilesManager';

const Files = () => {
  return (
    <DashboardLayout>
      <FilesManager />
    </DashboardLayout>
  );
};

export default Files;
