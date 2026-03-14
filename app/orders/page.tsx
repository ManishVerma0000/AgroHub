import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { OrderList } from '@/components/Orders/OrderList';

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Orders" 
        breadcrumbs={[
          { label: "Dashboard" },
          { label: "Orders" }
        ]}
      />
      <OrderList />
    </div>
  );
}
