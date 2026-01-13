import axiosInstance from './axiosInstance';
import { Task, TaskFilter } from '../types/task'; // Tạo types sau

// Lấy danh sách tasks với filter/pagination
export const getTasks = async (filter: TaskFilter = {}): Promise<any> => {
  const params = {
    page: filter.page ?? 0,
    size: filter.size ?? 10,
    sortBy: filter.sortBy ?? 'createdAt',
    sortDir: filter.sortDir ?? 'desc',
    status: filter.status,
    categoryId: filter.categoryId,
    keyword: filter.keyword,
  };

  const response = await axiosInstance.get('/tasks', { params });
  return response.data;
};

export const createTask = async (data: any): Promise<Task> => {
  const response = await axiosInstance.post('/tasks', data);
  return response.data;
};

export const updateTask = async (id: number, data: any): Promise<Task> => {
  const response = await axiosInstance.put(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/tasks/${id}`);
};