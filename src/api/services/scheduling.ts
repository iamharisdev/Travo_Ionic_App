import { AppointmentStatusEnum, CancelAppointmentPayload, ConfirmAppointmentPayload, IAppointment, Services, UpdateAppointmentPayload } from "../../shared/types/appointment.type";
import { schedulingApiInstance } from "../axios.instance";

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
}

export const getEvents = async (
  practiceId: string,
  providerId: string,
  start: string,
  end: string,
  pageNumber: number,
  pageSize: number,
  filter?: any,
  status?: AppointmentStatusEnum,
) => {
  return await schedulingApiInstance.get<EventsResponse>(`/practices/${practiceId}/providers/${providerId}/calendar`, {
    params: {
      start,
      end,
      pageNumber,
      pageSize,
      filter,
      status,
    }
  });
}

export const getServices = async (
  practiceId: string,
  providerId: string,
  pageNumber: number,
  pageSize: number,
) => {
  return await schedulingApiInstance.get<ServicesResponse>(`/practices/${practiceId}/providers/${providerId}/services`, {
    params: {
      pageNumber,
      pageSize,
    }
  });
}

export const editAppointment = async (
  practiceId: string,
  providerId: string,
  appointmentId: string,
  payload: UpdateAppointmentPayload,

) => {
  return await schedulingApiInstance.put<void>(
    `/practices/${practiceId}/providers/${providerId}/appointments/${appointmentId}/edit`,
    payload
  );
}

export const cancelAppointment = async (
  practiceId: string,
  providerId: string,
  appointmentId: string,
  payload: CancelAppointmentPayload,

) => {
  return await schedulingApiInstance.put<void>(
    `/practices/${practiceId}/providers/${providerId}/appointments/${appointmentId}/cancel`,
    payload
  );
}

export const confirmAppointment = async (
  practiceId: string,
  providerId: string,
  appointmentId: string,
  payload: ConfirmAppointmentPayload,

) => {
  return await schedulingApiInstance.put<void>(
    `/practices/${practiceId}/providers/${providerId}/appointments/${appointmentId}/confirm`,
    payload
  );
}

export const createAppointment = async (
  practiceId: string,
  providerId: string,
  payload: CreateAppointmentPayload,
) => {
  return await schedulingApiInstance.post<{ id: string }>(
    `/practices/${practiceId}/providers/${providerId}/appointments`,
    payload
  );
}

