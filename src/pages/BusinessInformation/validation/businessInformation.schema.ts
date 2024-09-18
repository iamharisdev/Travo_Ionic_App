import { object, string } from 'yup';

export const businessInformationSchema = object({
  subdomain: string().required(),
  fqDomain: string(),
  legalName: string().required(),
  country: string().required(),
  state: string().required(),
  city: string().required(),
  addressLineOne: string().required(),
  addressLineTwo: string().optional(),
  zipCode: string().required(),
});