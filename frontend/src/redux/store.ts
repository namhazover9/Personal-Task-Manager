import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import taskReducer from './slices/taskSlice';
import categoryReducer from './slices/categorySlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    category: categoryReducer,
    // Sau này thêm taskReducer, categoryReducer ở đây
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Tạm tắt để dễ lưu object Date/LocalDateTime nếu cần
    }),
});

// Type cho RootState và AppDispatch (dùng ở component)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;