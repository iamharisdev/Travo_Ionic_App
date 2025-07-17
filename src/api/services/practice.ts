import { BusinessInformation, Country, Currencies, PhoneCode } from '../../state/practiceSlice';
import { practiceApiInstance, providerApiInstance } from '../axios.instance';

export const getBusinessInformation = async (practiceId: string) => {
  return await practiceApiInstance.get<BusinessInformation>(`/practices/${practiceId}`);
};

export const updateBusinessInformation = async (
  practiceId: string,
  businessInformation: Partial<BusinessInformation>
) => {
  return await practiceApiInstance.put<void>(
    `/practices/${practiceId}/business-information`,
    businessInformation
  );
};

export const getCountries = async () => {
  return await practiceApiInstance.get<Array<Country>>('/global-data/countries');
};

export const getPhoneCodes = async () => {
  return await practiceApiInstance.get<Array<PhoneCode>>('/global-data/phone-codes');
};

export const uploadPracticeLogo = async (practiceId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return await practiceApiInstance.post<{ data: string }>(
    `/practices/${practiceId}/upload-logo`,
    formData
  );
};

export const updateBrandingInformation = async (
  practiceId: string,
  businessInformation: Partial<BusinessInformation>
) => {
  return await practiceApiInstance.put<void>(
    `/practices/${practiceId}/branding-information`,
    businessInformation
  );
};

export const getCurrencies = async () => {
  return await practiceApiInstance.get<Array<Currencies>>('/anonymous/global-data/currencies');
};

export const getLookupCurrencies = async () => {
  return await providerApiInstance.get<Array<Currencies>>('/lookups/en');
};
