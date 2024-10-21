import { Patient } from "../../state/patientSlice";
import { patientApiInstance } from "../axios.instance";

export const searchPatient = async (practiceId: string, patient: string) => {
  return await patientApiInstance.get<Array<Patient>>(`/practices/${practiceId}/patients/search`, {
    params: {
      searchString: patient
    }
  });
}