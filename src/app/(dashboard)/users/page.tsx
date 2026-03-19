'use client';

import { useState } from 'react';
import { UserTable } from '@/components/user-table';

export default function UsersPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className="space-y-6" key={refreshKey}>
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">Manage your users here.</p>
      </div>
      <UserTable refreshTrigger={refreshKey} onRefresh={handleRefresh} />
    </div>
  );
}
