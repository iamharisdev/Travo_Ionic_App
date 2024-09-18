import { mockAppointments } from "../../pages/Appointments/mock/appointments.mock";
import { IAppointment } from "../../shared/types/appointment.type";
import { schedulingApiInstance } from "../axios.instance";

export interface EventsResponse {
  total: number;
  events: IAppointment[];
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
  return await new Promise<{ data: EventsResponse }>((resolve) => resolve({
    data: mockAppointments
  }))
  // TODO: uncomment this once we resolve CORS for scheduling api
  // return await schedulingApiInstance.get<EventsResponse>(`/practices/${practiceId}/providers/${providerId}/calendar`, {
  //   params: {
  //     start,
  //     end,
  //     pageNumber,
  //     pageSize,
  //     filter
  //   }
  // });
}