import { MeInterface, ProviderProfileResponse } from "../../state/providerSlice";
import { providerApiInstance } from "../axios.instance";

export const getMe = async () => {
  return await providerApiInstance.get<MeInterface>('providers/me');
}

export const getProfile = async (practiceId: string, providerId: string) => {
  return await providerApiInstance.get<ProviderProfileResponse>(`/practices/${practiceId}/providers/${providerId}/profile-information`);
}
