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

// TODO: create services get service