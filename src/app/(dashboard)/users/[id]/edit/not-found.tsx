import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">User not found</p>
      </div>
      <Link href="/users">
        <Button>
          <Home className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
      </Link>
    </div>
  );
}
