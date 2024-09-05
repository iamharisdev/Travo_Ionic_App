import { publicAxiosInstance } from "../axios.instance"

export const signIn = async (email: string, password: string) => {
  return await publicAxiosInstance.post<{ success: boolean; token: string; message: string }>('/auth', {
    email,
    password,
  });
}
