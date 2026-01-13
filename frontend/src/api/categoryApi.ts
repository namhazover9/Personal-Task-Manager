import axiosInstance from './axiosInstance';

export const getCategories = async (): Promise<any> => {
  const response = await axiosInstance.get('/categories');
  return response.data;
};