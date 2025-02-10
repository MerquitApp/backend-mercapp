import { Prisma } from '@prisma/client';

export class Users implements Prisma.UserCreateInput {
  user_id?: number;
  registration_date?: Date | string;
  name: string;
  email: string;
  phone_number: string;
  role?: string;
  verification_state?: boolean;
  password: string;
  profile_picture?: string;
}
