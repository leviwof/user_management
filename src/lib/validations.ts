import { z } from 'zod';

export const userFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  role: z.enum(['Admin', 'User'], {
    required_error: 'Role is required',
  }),
});

export type UserFormSchema = z.infer<typeof userFormSchema>;
