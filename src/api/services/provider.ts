import { MeInterface, Practice } from "../../state/providerSlice";
import { providerApiInstance } from "../axios.instance";

export const getMe = async () => {
  return await providerApiInstance.get<MeInterface>('providers/me');
}

export const getPractice = async (practiceId: string, providerId: string) => {
  return await providerApiInstance.get<Practice>(`/practices/${practiceId}/providers/${providerId}/profile-information`);
}

export const updatePractice = async (practiceId: string, providerId: string, practice: Practice) => {
  return await providerApiInstance.put<void>(`/practices/${practiceId}/providers/${providerId}/profile-information`, practice);
}
