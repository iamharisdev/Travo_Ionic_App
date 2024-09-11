import { BusinessInformation, Country } from "../../state/practiceSlice";
import { practiceApiInstance } from "../axios.instance";

export const getBusinessInformation = async (practiceId: string) => {
  return await practiceApiInstance.get<BusinessInformation>(`/practices/${practiceId}`);
}

export const updateBusinessInformation = async (practiceId: string, businessInformation: Partial<BusinessInformation>) => {
  return await practiceApiInstance.put<void>(`/practices/${practiceId}/business-information`, businessInformation);
}

export const getCountries = async () => {
  return await practiceApiInstance.get<Array<Country>>(`/global-data/countries`);
}
