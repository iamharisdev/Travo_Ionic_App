import { IAppointment, Services, UpdateAppointmentPayload } from "../../shared/types/appointment.type";
import { schedulingApiInstance } from "../axios.instance";

export interface EventsResponse {
  total: number;
  events: IAppointment[];
}

export interface ServicesResponse {
  totalPatientServices: number;
  patientServiceRequestDtos: Services[];
}

export const getEvents = async (
  practiceId: string,
  providerId: string,
  start: string,
  end: string,
  pageNumber: number,
  pageSize: number,
  filter?: any,
) => {
  return await schedulingApiInstance.get<EventsResponse>(`/practices/${practiceId}/providers/${providerId}/calendar`, {
    params: {
      start,
      end,
      pageNumber,
      pageSize,
      filter
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

