import { Countries } from "../../state/practiceSlice";
import { idApiInstance, practiceApiInstance } from "../axios.instance"

export const signIn = async (email: string, password: string) => {
  return await idApiInstance.post<{ success: boolean; token: string; message: string }>('/auth', {
    email,
    password,
  });
}

