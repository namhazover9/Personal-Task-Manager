import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTasks, createTask, updateTask, deleteTask } from '../../api/taskApi';
import { TaskPage, TaskFilter, Task } from '../../types/task';


interface TaskState {
  tasks: TaskPage | null;
  loading: boolean;
  error: string | null;
  filter: TaskFilter;
}

const initialState: TaskState = {
  tasks: null,
  loading: false,
  error: null,
  filter: {
    page: 0,
    size: 10,
    sortBy: 'createdAt',
    sortDir: 'desc',
    keyword: '',
    status: undefined,
    categoryId: undefined,
  },
};

export const fetchTasks = createAsyncThunk<TaskPage, TaskFilter>(
  'task/fetchTasks',
  async (filter, { rejectWithValue }) => {
    try {
      const data = await getTasks(filter);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lấy danh sách task thất bại');
    }
  }
);

export const createNewTask = createAsyncThunk<Task, any>(
  'task/createNewTask',
  async (data, { rejectWithValue }) => {
    try {
      const created = await createTask(data);
      return created;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Tạo task thất bại');
    }
  }
);

export const updateExistingTask = createAsyncThunk<Task, { id: number; data: any }>(
  'task/updateExistingTask',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const updated = await updateTask(id, data);
      return updated;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Cập nhật task thất bại');
    }
  }
);

export const removeTask = createAsyncThunk<number, number>(
  'task/removeTask',
  async (id, { rejectWithValue }) => {
    try {
      await deleteTask(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Xóa task thất bại');
    }
  }
);

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    resetFilter: (state) => {
      state.filter = initialState.filter;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create
    builder
      .addCase(createNewTask.pending, (state) => { state.loading = true; })
      .addCase(createNewTask.fulfilled, (state, action) => {
        state.loading = false;
        if (state.tasks) {
          state.tasks.content.unshift(action.payload);
          state.tasks.totalElements += 1;
        }
      })
      .addCase(createNewTask.rejected, (state, action) => {
        state.loading = false;
      });

    // Update
    builder
      .addCase(updateExistingTask.pending, (state) => { state.loading = true; })
      .addCase(updateExistingTask.fulfilled, (state, action) => {
        state.loading = false;
        if (state.tasks) {
          const index = state.tasks.content.findIndex(t => t.id === action.payload.id);
          if (index !== -1) {
            state.tasks.content[index] = action.payload;
          }
        }
      })
      .addCase(updateExistingTask.rejected, (state, action) => {
        state.loading = false;
      });

    // Delete
    builder
      .addCase(removeTask.pending, (state) => { state.loading = true; })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.loading = false;
        if (state.tasks) {
          state.tasks.content = state.tasks.content.filter(t => t.id !== action.payload);
          state.tasks.totalElements -= 1;
        }
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const { setFilter, resetFilter } = taskSlice.actions;

export default taskSlice.reducer;