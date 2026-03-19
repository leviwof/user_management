import { UserTable } from '@/components/user-table';

export default async function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">Manage your users here.</p>
      </div>
      <UserTable />
    </div>
  );
}
