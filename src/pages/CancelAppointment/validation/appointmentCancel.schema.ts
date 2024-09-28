import { boolean, object } from 'yup';

export const cancelAppointmentSchema = object({
  notAcceptingNewClients: boolean().required(),
  notWithinScopeOfExpertise: boolean().required(),
  needReferral: boolean().required(),
  other: boolean().required(),
});