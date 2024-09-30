import { boolean, object, string } from 'yup';

export const cancelAppointmentSchema = object({
  notAcceptingNewClients: object({
    checked: boolean().required(),
    value: string(),
  }),
  notWithinScopeOfExpertise: object({
    checked: boolean().required(),
    value: string(),
  }),
  needReferral: object({
    checked: boolean().required(),
    value: string(),
  }),
  other: object({
    checked: boolean().required(),
    value: string(),
  }),
});