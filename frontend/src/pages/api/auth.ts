import { apiClient } from '@/utils/apiClient';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Ensure this is set in your .env file

interface LoginResponse {
    data: any; 
    status:number;
    id: string;
    firstname:string;
    lastname:string;
    email: string;
    name: string; 
    auth_token:string;
}

interface LoginCredentials {
  email: string;
  password: string;
}
 
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, credentials);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};
 

export const logout = async(email:string) => {
  try {
    const response = await apiClient('/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email:email}), // send formData as JSON
    });

    return response.data;
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }



}