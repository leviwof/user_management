'use client';

import { useState, useCallback, useEffect } from 'react';
import { User } from '@/types';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from '@/components/ui/toast';
import { userApi } from '@/lib/api-client';

interface UserTableProps {
  refreshTrigger?: number;
  onRefresh?: () => void;
}

export function UserTable({ refreshTrigger = 0, onRefresh }: UserTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const limit = 10;

  const fetchUsers = useCallback(async (searchTerm: string, pageNum: number) => {
    setLoading(true);
    try {
      const response = await userApi.getUsers({ search: searchTerm, page: pageNum, limit });
      setUsers(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
      setPage(response.page);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(search, page);
  }, [fetchUsers, refreshTrigger]);

  useEffect(() => {
    if (onRefresh) {
      const handleCustomRefresh = () => {
        fetchUsers(search, page);
      };
      (window as any).__refreshUsersTable = handleCustomRefresh;
    }
  }, [fetchUsers, onRefresh, search, page]);

  const handleSearch = useCallback(() => {
    setPage(1);
    fetchUsers(search, 1);
  }, [search, fetchUsers]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const handleClearSearch = useCallback(() => {
    setSearch('');
    setPage(1);
    fetchUsers('', 1);
  }, [fetchUsers]);

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchUsers(search, newPage);
    }
  }, [search, totalPages, fetchUsers]);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    setDeletingId(id);
    try {
      await userApi.deleteUser(id);
      toast.success('User deleted successfully');
      fetchUsers(search, page);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  }, [search, page, fetchUsers]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {search && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button onClick={handleSearch} variant="outline">
            Search
          </Button>
        </div>
        <Link href="/users/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Name
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Email
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Role
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Created Date
              </th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: limit }).map((_, i) => (
                <tr key={i} className="border-b">
                  <td className="p-4"><Skeleton className="h-5 w-32" /></td>
                  <td className="p-4"><Skeleton className="h-5 w-40" /></td>
                  <td className="p-4"><Skeleton className="h-5 w-16" /></td>
                  <td className="p-4"><Skeleton className="h-5 w-24" /></td>
                  <td className="p-4"><Skeleton className="h-8 w-20 ml-auto" /></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="h-32 text-center align-middle text-muted-foreground">
                  {search ? 'No users found matching your search.' : 'No users yet. Create your first user!'}
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-muted-foreground">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === 'Admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{formatDate(user.createdAt)}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/users/${user.id}/edit`}>
                        <Button variant="ghost" size="icon" disabled={deletingId === user.id}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user.id)}
                        disabled={deletingId === user.id}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && users.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
