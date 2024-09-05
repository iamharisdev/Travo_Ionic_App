import { ProviderProfileResponse } from "../../state/providerSlice";
import { privateAxiosInstance } from "../axios.instance";

export const getProfile = async (practiceId: string, providerId: string) => {
  return await privateAxiosInstance.get<ProviderProfileResponse>(`/practices/${practiceId}/providers/${providerId}/profile-information`);
}
