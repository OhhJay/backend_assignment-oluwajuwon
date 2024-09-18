import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const registerUser = async (firstname:string,lastname:string,email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/register`, { firstname,lastname,email, password });
  return response.data;
};
