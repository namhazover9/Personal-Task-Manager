import axiosInstance from './axiosInstance';
import { AuthRequest, AuthResponse, UserRegistration } from '../types/auth';

export const login = async (data: AuthRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const register = async (data: UserRegistration): Promise<void> => {
  await axiosInstance.post('/auth/register', data);
};