import { object, string, mixed } from 'yup';

export const practiceUpdateSchema = object({
  profilePictureUrl: mixed({ type: 'string', }).nullable(),
  firstName: string().required(),
  lastName: string().required(),
  displayName: string().required(),
  languages: string(),
  qualificationsAndTitle: string(),
  bio: string(),
  preferredCurrency: string().required(),
  phoneNumber: string(),
  phoneNumberPrefix: string(),
  userName: string(),
  profession:string(),
  skipAppointmentRequestNotifications: mixed({ type: 'boolean' }).nullable(),
});