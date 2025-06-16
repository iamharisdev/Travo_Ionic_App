import { object, string } from 'yup';



export const signInSchema = (t:any) =>
  object({
    email: string()
      .email(t('login_invalid_email_format'))
      .required(t('login_email_required')),
    password: string()
      .required(t('login_password_required')),
  });