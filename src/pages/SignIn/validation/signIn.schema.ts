import { object, string } from 'yup';

export const signInSchema = object({
  email: string().email("invalid email format").required(),
  password: string().required(),
});