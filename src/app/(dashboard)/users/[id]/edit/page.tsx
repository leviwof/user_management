import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserForm } from '@/components/user-form';
import { prisma } from '@/lib/prisma';

interface EditUserPageProps {
  params: { id: string };
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    notFound();
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    notFound();
  }

  const formattedUser = {
    ...user,
    role: user.role as 'Admin' | 'User',
    createdAt: user.createdAt.toISOString(),
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit User</CardTitle>
          <CardDescription>Update user information.</CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm user={formattedUser} isEditing />
        </CardContent>
      </Card>
    </div>
  );
}
