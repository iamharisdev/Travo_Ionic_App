import {
  AppointmentStatusEnum,
  CancelAppointmentPayload,
  ConfirmAppointmentPayload,
  IAppointment,
  Services,
  UpdateAppointmentPayload,
} from '../../shared/types/appointment.type';
import { schedulingApiInstance } from '../axios.instance';

export interface EventsResponse {
  total: number;
  events: IAppointment[];
}

export interface ServicesResponse {
  totalPatientServices: number;
  patientServiceRequestDtos: Services[];
}

export interface CreateAppointmentPayload {
  patientServiceId: string;
  patientId: string;
  patientEmail: string;
  patientName: string;
  patientNumber: string;
  startTime: string;
  endTime: string;
  invoiceDataId?: string;
  recurring: boolean;
  count?: number;
  frequency?: string;
  recurringUpdate?: boolean;
  id: string;
}

export interface RescheduleAppointmentPayload {
  frequency?: string;
  count?: number;
  recurring: boolean;
  futureAppointments: string[];
  ignoreOthers: boolean;
  patientServiceId: string;
  startTime: string;
  endTime: string;
  price: number;
  location: string;
  invoiceDataId: string;
}

export const getEvents = async (
  practiceId: string,
  providerId: string,
  start: string,
  end: string,
  pageNumber: number,
  pageSize: number,
  filter?: any,
  status?: AppointmentStatusEnum
) => {
  return await schedulingApiInstance.get<EventsResponse>(
    `/practices/${practiceId}/providers/${providerId}/calendar`,
    {
      params: {
        start,
        end,
        pageNumber,
        pageSize,
        filter,
        status,
      },
    }
  );
};

export const getMicrosoftEvents = async (
  practiceId: string,
  providerId: string,
  start: string,
  end: string
) => {
  return await schedulingApiInstance.get<Array<IAppointment>>(
    `/practices/${practiceId}/providers/${providerId}/connected-calendars/microsoft/events`,
    {
      params: {
        start,
        end,
      },
    }
  );
};

export const getGoogleEvents = async (
  practiceId: string,
  providerId: string,
  start: string,
  end: string
) => {
  return await schedulingApiInstance.get<Array<IAppointment>>(
    `/practices/${practiceId}/providers/${providerId}/connected-calendars/google/events`,
    {
      params: {
        start,
        end,
      },
    }
  );
};

export const getServices = async (
  practiceId: string,
  providerId: string,
  pageNumber: number,
  pageSize: number
) => {
  return await schedulingApiInstance.get<ServicesResponse>(
    `/practices/${practiceId}/providers/${providerId}/services`,
    {
      params: {
        pageNumber,
        pageSize,
      },
    }
  );
};

export const editAppointment = async (
  practiceId: string,
  providerId: string,
  appointmentId: string,
  payload: UpdateAppointmentPayload
) => {
  return await schedulingApiInstance.put<void>(
    `/practices/${practiceId}/providers/${providerId}/appointments/${appointmentId}/edit`,
    payload
  );
};

export const cancelAppointment = async (
  practiceId: string,
  providerId: string,
  appointmentId: string,
  endPoint: string,
  payload: CancelAppointmentPayload
) => {
  return await schedulingApiInstance.put<void>(
    `/practices/${practiceId}/providers/${providerId}/appointments/${appointmentId}/${endPoint}`,
    payload
  );
};

export const confirmAppointment = async (
  practiceId: string,
  providerId: string,
  appointmentId: string,
  payload: ConfirmAppointmentPayload
) => {
  return await schedulingApiInstance.put<void>(
    `/practices/${practiceId}/providers/${providerId}/appointments/${appointmentId}/confirm`,
    payload
  );
};

export const createAppointment = async (
  practiceId: string,
  providerId: string,
  payload: CreateAppointmentPayload
) => {
  if (payload?.count && payload.frequency && payload.recurringUpdate) {
    return await schedulingApiInstance.put<{ id: string }>(
      `practices/${practiceId}/providers/${providerId}/appointments/${payload.id}/edit/recurring`,
      payload
    );
  }
  if (payload?.recurring) {
    return await schedulingApiInstance.post<{ id: string }>(
      `/practices/${practiceId}/providers/${providerId}/appointments/recurring`,
      payload
    );
  }
  return await schedulingApiInstance.post<{ id: string }>(
    `/practices/${practiceId}/providers/${providerId}/appointments`,
    payload
  );
};

export const rescheduleAppointment = async (
  practiceId: string,
  providerId: string,
  appointmentId: string,
  payload: RescheduleAppointmentPayload
) =>
  await schedulingApiInstance.put<void>(
    `/practices/${practiceId}/providers/${providerId}/appointments/${appointmentId}/reschedule/recurring`,
    payload
  );

export const rescheduleAppointmentWithOutRecurring = async (
  practiceId: string,
  providerId: string,
  appointmentId: string,
  payload: RescheduleAppointmentPayload
) =>
  await schedulingApiInstance.put<void>(
    `/practices/${practiceId}/providers/${providerId}/appointments/${appointmentId}/reschedule`,
    payload
  );

export const editAppointmentsRecurring = async (
  practiceId: string,
  providerId: string,
  appointmentId: string,
  payload: RescheduleAppointmentPayload
) =>
  await schedulingApiInstance.put<void>(
    `practices/${practiceId}/providers/${providerId}/appointments/${appointmentId}/edit/recurring`,
    payload
  );
