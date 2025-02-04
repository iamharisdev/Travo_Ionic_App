// TODO: move some interfaces in their own files

export interface Identifiable {
  id?: string;
}

export interface IPatientContact {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  mobileNumberPrefix: string;
  note: string;
  guardian: boolean;
  relationshipType: string;
  receiveEmailNotifications?: boolean;
}

export interface CustomField {
  name: string;
  value: string;
  label?: string;
}

export interface IPatient {
  id?: string;
  patientNumber?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  mobileNumberPrefix: string;
  dob: string;
  gender: string;
  countryCode: string;
  countryName: string;
  language?: string;
  contacts: IPatientContact[];
  archived?: boolean;
  createdDate?: string;
  fullName?: string; // Needed only for UI
  icd10Code?: string;
  icd10Description?: string;
  countrySpecificFields?: Record<string, string>;
  customFields?: CustomField[];
  valid?: boolean;
  errorDetails?: string;
  genderDisplay?: string;
  acceptArchived?: boolean;
}

export enum Time {
  '12:00 AM' = '12:00 AM',
  '12:30 AM' = '12:30 AM',
  '01:00 AM' = '01:00 AM',
  '01:30 AM' = '01:30 AM',
  '02:00 AM' = '02:00 AM',
  '02:30 AM' = '02:30 AM',
  '03:00 AM' = '03:00 AM',
  '03:30 AM' = '03:30 AM',
  '04:00 AM' = '04:00 AM',
  '04:30 AM' = '04:30 AM',
  '05:00 AM' = '05:00 AM',
  '05:30 AM' = '05:30 AM',
  '06:00 AM' = '06:00 AM',
  '06:30 AM' = '06:30 AM',
  '07:00 AM' = '07:00 AM',
  '07:30 AM' = '07:30 AM',
  '08:00 AM' = '08:00 AM',
  '08:30 AM' = '08:30 AM',
  '09:00 AM' = '09:00 AM',
  '09:30 AM' = '09:30 AM',
  '10:00 AM' = '10:00 AM',
  '10:30 AM' = '10:30 AM',
  '11:00 AM' = '11:00 AM',
  '11:30 AM' = '11:30 AM',
  '12:00 PM' = '12:00 PM',
  '12:30 PM' = '12:30 PM',
  '01:00 PM' = '01:00 PM',
  '01:30 PM' = '01:30 PM',
  '02:00 PM' = '02:00 PM',
  '02:30 PM' = '02:30 PM',
  '03:00 PM' = '03:00 PM',
  '03:30 PM' = '03:30 PM',
  '04:00 PM' = '04:00 PM',
  '04:30 PM' = '04:30 PM',
  '05:00 PM' = '05:00 PM',
  '05:30 PM' = '05:30 PM',
  '06:00 PM' = '06:00 PM',
  '06:30 PM' = '06:30 PM',
  '07:00 PM' = '07:00 PM',
  '07:30 PM' = '07:30 PM',
  '08:00 PM' = '08:00 PM',
  '08:30 PM' = '08:30 PM',
  '09:00 PM' = '09:00 PM',
  '09:30 PM' = '09:30 PM',
  '10:00 PM' = '10:00 PM',
  '10:30 PM' = '10:30 PM',
  '11:00 PM' = '11:00 PM',
  '11:30 PM' = '11:30 PM',
}


export interface TimePeriod {
  startTime: Time;
  endTime: Time;
}

export interface SessionTimeRequest extends TimePeriod {
  day: string;
}

export type ServiceType = 'Individual' | 'Group';

export interface IService {
  id?: string;
  name: string;
  patientType: string;
  description: string;
  practiceId?: string;
  providerId?: string;
  serviceType?: ServiceType; // Optional only in the front end
  duration: number | string; // String only for reusing model as form initializer
  price: number | string; // String only for reusing model as form initializer
  currency: string;
  clientType: string;
  location: string;
  paymentType: string;
  bookingStartTime: string;
  bufferTime: number;
  calendarColor: string;
  active?: boolean;
  archived?: boolean;
  restrictedTimes?: SessionTimeRequest[];
  externalSchedulerLink?: string;
  local?: boolean;
  showPriceOnPublicBookingPage?: boolean;
  order?: number | null;
}

export interface PatientInsuranceResponseDto {
  medicalAidCompanyName: string;
  medicalAidNumber: string;
  valid: boolean;
}

export enum CALENDAR_SLOTS {
  ORANGE = 'orange',
  PINK = 'pink',
  PURPLE = 'purple',
  BLUE = 'blue',
  GREEN = 'green',
  TEAL = 'teal',
};

export interface IAppointment extends Identifiable {
  appointmentNumber?: string;
  patientId?: string;
  patientNumber?: string;
  patientName?: string;
  patientEmail?: string;
  patient?: IPatient;
  patientServiceId?: string;
  service?: IService;
  scheduleUrl?: string;
  startTime?: Date | string;
  endTime?: Date | string;
  practiceId?: string;
  providerId?: string;
  patientServiceName?: string;
  additionalParticipants?: any[];
  location?: string;
  color?: CALENDAR_SLOTS;
  timeZone?: string;
  status?: AppointmentStatusEnum;
  cancellationReason?: string | null;
  cancellationDetails?: string | null;
  onlineMeetingProvider?: string;
  onlineMeetUrl?: string;
  onlineMeetProviderUrl?: string;
  onlineMeetingUrl?: string;
  onlineMeetingAdditionalInformation?: string;
  price?: number | null;
  discount?: string | null;
  providerName?: string;
  clientType?: string;
  patientServiceType?: string;
  allDay?: boolean;
  view?: string; // Only used in the UI to show buttons
  invoiceDataId?: string;
  insuranceDetails?: PatientInsuranceResponseDto;
  patientArchived?: boolean;
  // Meeting events
  title?: string;
  inviteDetails?: string;
  description?: string;
  providerEmail?: string;
  id?: string;
  externalEventId?: string;
  endTimeValid?: boolean;
  startTimeValid?: boolean;
}

export interface SessionTimeRequest extends TimePeriod {
  day: string;
}

export interface Services {
  id: string;
  name: string;
  patientType: string;
  description: string;
  practiceId: string;
  providerId: string;
  serviceType: ServiceType;
  duration: number;
  price: number;
  currency: string;
  clientType: string;
  location: string;
  bookingStartTime: string;
  bufferTime: number;
  procedureCode: string;
  procedureDescription: string | null;
  calendarColor: string;
  paymentType: 'At Completion' | 'In Advance';
  active: boolean
  archived: boolean;
  local: boolean;
  restrictedTimes?: SessionTimeRequest[];
  externalSchedulerLink: string;
  externalSchedulerId: string;
  showPriceOnPublicBookingPage: boolean;
  order: number | null;
}

export interface UpdateAppointmentPayload extends Partial<IAppointment> {
  location: string;
  patientServiceId: string;
  startTime: string;
  endTime: string;
}

export enum AppointmentDetailTypeEnum {
  ACCEPT = 'accept',
  RESCHEDULE = 'reschedule',
}

export enum AppointmentStatusEnum {
  PENDING = 'Pending',
  CONFIRMEND = 'Confirmed',
  CANCELLED = 'Cancelled',
  BUSY = 'Busy',
}

export interface CancelAppointmentPayload {
  additionalDetails: string;
  reason: string;
}

export interface ConfirmAppointmentPayload {
  patientServiceId?: string;
  price?: string;
  location?: string;
  invoiceDataId?: string;
}