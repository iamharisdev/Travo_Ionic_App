import { BusinessInformation } from "../../state/practiceSlice";
import { practiceApiInstance } from "../axios.instance";

export const getBusinessInformation = async (practiceId: string) => {
  return await practiceApiInstance.get<BusinessInformation>(`/practices/${practiceId}`);
}

export const updateBusinessInformation = async (practiceId: string, businessInformation: Partial<BusinessInformation>) => {
  return await practiceApiInstance.put<void>(`/practices/${practiceId}/business-information`, businessInformation);
}
