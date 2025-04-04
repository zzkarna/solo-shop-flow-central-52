
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ComplianceManager } from '@/components/compliance/ComplianceManager';

const Compliance = () => {
  return (
    <DashboardLayout>
      <ComplianceManager />
    </DashboardLayout>
  );
};

export default Compliance;
