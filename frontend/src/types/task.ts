import { TaskStatus } from './enum'; // Tạo enum nếu cần

export interface Task {
  id: number;
  title: string;
  description?: string;
  deadline?: string;
  status: TaskStatus;
  completed: boolean;
  categoryId?: number;
  categoryName?: string;
}

export interface TaskFilter {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  status?: TaskStatus;
  categoryId?: number;
  keyword?: string;
}

export interface TaskPage {
  content: Task[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export { TaskStatus } from './enum';