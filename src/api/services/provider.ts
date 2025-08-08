import { NewModalCountry } from '../../state/practiceSlice';
import { MeInterface, Practice } from '../../state/providerSlice';
import { providerApiInstance } from '../axios.instance';

export const getMe = async () => {
  return await providerApiInstance.get<MeInterface>('providers/me');
};

export const getPractice = async (practiceId: string, providerId: string) => {
  return await providerApiInstance.get<Practice>(
    `/practices/${practiceId}/providers/${providerId}/profile-information?teamInfo=true`
  );
};



export const updatePractice = async (
  practiceId: string,
  providerId: string,
  practice: Practice
) => {
  return await providerApiInstance.put<void>(
    `/practices/${practiceId}/providers/${providerId}/profile-information`,
    practice
  );
};

export const uploadProfilePicture = async (providerId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return await providerApiInstance.post<{ data: string }>(
    `/providers/${providerId}/upload-profile-picture`,
    formData
  );
};

export const getCountriesForRegion = async () => {
  return await providerApiInstance.get<NewModalCountry>('lookups/en');
};
