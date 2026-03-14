import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SettingsForm } from '@/components/Settings/SettingsForm';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Settings" 
        breadcrumbs={[
          { label: "Dashboard" },
          { label: "Settings" }
        ]}
      />
      <SettingsForm />
    </div>
  );
}
