import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCategories } from '../../api/categoryApi';
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
  },
});

export default categorySlice.reducer;