import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createCategory, getCategories, updateCategory, deleteCategory } from '../../api/categoryApi';
import { Category } from '../../types/category';


interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk<Category[], void>(
  'category/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCategories();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lấy danh sách category thất bại');
    }
  }
);

export const createNewCategory = createAsyncThunk<Category, any>(
  'category/createNewCategory',
  async (data, { rejectWithValue }) => {
    try {
      const created = await createCategory(data);
      return created;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Tạo category thất bại');
    }
  }
);

export const updateExistingCategory = createAsyncThunk<Category, { id: number; data: any }>(
  'category/updateExistingCategory',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const updated = await updateCategory(id, data);
      return updated;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Cập nhật category thất bại');
    }
  }
);

export const removeCategory = createAsyncThunk<number, number>(
  'category/removeCategory',
  async (id, { rejectWithValue }) => {
    try {
      await deleteCategory(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Xóa category thất bại');
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create
    builder
      .addCase(createNewCategory.pending, (state) => { state.loading = true; })
      .addCase(createNewCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.unshift(action.payload);
      })
      .addCase(createNewCategory.rejected, (state, action) => {
        state.loading = false;
      });

    // Update
    builder
      .addCase(updateExistingCategory.pending, (state) => { state.loading = true; })
      .addCase(updateExistingCategory.fulfilled, (state, action) => {
        state.loading = false;
        if (state.categories) {
          const index = state.categories.findIndex(t => t.id === action.payload.id);
          if (index !== -1) {
            state.categories[index] = action.payload;
          }
        }
      })
      .addCase(updateExistingCategory.rejected, (state, action) => {
        state.loading = false;
      });

    // Delete
    builder
      .addCase(removeCategory.pending, (state) => { state.loading = true; })
      .addCase(removeCategory.fulfilled, (state, action) => {
        state.loading = false;
        if (state.categories) {
          state.categories = state.categories.filter(t => t.id !== action.payload);
        }
      })
      .addCase(removeCategory.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export default categorySlice.reducer;