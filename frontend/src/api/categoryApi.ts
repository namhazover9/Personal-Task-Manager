import axiosInstance from './axiosInstance';
import { Category } from '../types/category';

export const getCategories = async (): Promise<any> => {
  const response = await axiosInstance.get('/categories');
  return response.data;
};

export const createCategory = async (data: any): Promise<Category> => {
  const response = await axiosInstance.post('/categories', data);
  return response.data;
};

export const updateCategory = async (id: number, data: any): Promise<Category> => {
  const response = await axiosInstance.put(`/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/categories/${id}`);
};