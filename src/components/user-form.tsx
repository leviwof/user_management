'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, UserFormData } from '@/types';
import { userFormSchema, UserFormSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/toast';
import { userApi } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

interface UserFormProps {
  user?: User;
  isEditing?: boolean;
}

export function UserForm({ user, isEditing = false }: UserFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserFormSchema>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || undefined,
    },
  });

  const selectedRole = watch('role');

  useEffect(() => {
    if (user?.role) {
      setValue('role', user.role as 'Admin' | 'User');
    }
  }, [user, setValue]);

  const onSubmit = async (data: UserFormData) => {
    try {
      if (isEditing && user) {
        await userApi.updateUser(user.id, data);
        toast.success('User updated successfully');
      } else {
        await userApi.createUser(data);
        toast.success('User created successfully');
      }
      router.push('/users');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Failed to ${isEditing ? 'update' : 'create'} user`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name <span className="text-destructive">*</span>
        </label>
        <Input
          id="name"
          placeholder="John Doe"
          {...register('name')}
          error={errors.name?.message}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email <span className="text-destructive">*</span>
        </label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          {...register('email')}
          error={errors.email?.message}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="role" className="text-sm font-medium">
          Role <span className="text-destructive">*</span>
        </label>
        <Select
          value={selectedRole}
          onValueChange={(value) => setValue('role', value as 'Admin' | 'User')}
        >
          <SelectTrigger error={errors.role?.message}>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="User">User</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-sm text-destructive">{errors.role.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditing ? 'Update User' : 'Create User'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/users')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
