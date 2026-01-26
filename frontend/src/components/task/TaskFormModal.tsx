import React, { useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import useToast from '../../hooks/useToast';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../redux/slices/categorySlice';
import { createNewTask, updateExistingTask, fetchTasks } from '../../redux/slices/taskSlice';
import { RootState, AppDispatch } from '../../redux/store';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  MenuItem,
  Box,
} from '@mui/material';
import FormInput from '../common/FormInput';
import FormDate from '../common/FormDate';
import FormSwitch from '../common/FormSwitch';
import { Task, TaskStatus } from '../../types/task';

// Schema Yup khớp với Task (tất cả optional trừ bắt buộc)
const schema = yup.object({
  title: yup.string().required('Tiêu đề là bắt buộc'),
  description: yup.string().nullable(),
  deadline: yup.string().nullable(), // backend nhận string ISO
  status: yup.mixed<TaskStatus>().oneOf(['PENDING', 'IN_PROGRESS', 'COMPLETED']).required('Trạng thái là bắt buộc'),
  completed: yup.boolean().nullable(),
  categoryId: yup.number().nullable(),
}).required();

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  task?: Task; // Nếu sửa thì truyền task vào
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ open, onClose, task }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading: catLoading } = useSelector((state: RootState) => state.category);
  const toast = useToast();

  type IFormInput = yup.InferType<typeof schema>;

  const methods = useForm<IFormInput>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      title: '',
      description: '', // Fix: use empty string instead of null
      deadline: null,
      status: 'PENDING' as TaskStatus,
      completed: false,
      categoryId: null,
    },
  });

  useEffect(() => {
    if (open) {
      dispatch(fetchCategories());
    }
    // Reset form với data từ task (nếu edit)
    if (task) {
      // Format deadline về YYYY-MM-DD nếu có (không dùng toISOString để tránh lệch timezone)
      const formattedDeadline = task.deadline
        ? format(parseISO(task.deadline), 'yyyy-MM-dd')
        : null;
      methods.reset({
        title: task.title,
        description: task.description || '', // Fix: use empty string instead of null
        deadline: formattedDeadline,
        status: task.status,
        completed: task.completed || false,
        categoryId: task.categoryId || null,
      });
    } else {
      methods.reset({
        title: '',
        description: '', // Fix: use empty string
        deadline: null,
        status: 'PENDING' as TaskStatus,
        completed: false,
        categoryId: null,
      });
    }
  }, [open, task, dispatch, methods]);

  const onSubmit = async (data: IFormInput) => {


    const payload: Partial<Task> = {
      title: data.title,
      description: data.description || undefined,
      status: data.status as TaskStatus,
      completed: data.completed || false,
      categoryId: data.categoryId || undefined,
      // Giữ nguyên date string YYYY-MM-DD, backend sẽ parse
      deadline: data.deadline ? `${data.deadline}T23:59:59` : undefined
    };

    // Gửi deadline dưới dạng LocalDateTime string (YYYY-MM-DDTHH:MM:SS)
    const taskData = {
      ...data,
      deadline: data.deadline ? `${data.deadline}T23:59:59` : null,
    };

    let result;
    if (task) {
      // Update
      result = await dispatch(updateExistingTask({ id: task.id, data: taskData }));
    } else {
      // Create
      // createNewTask likely expects Omit<Task, 'id'>
      result = await dispatch(createNewTask(taskData as any)); // cast to any or specific creation type if known, to be safe
    }

    // Check kết quả dispatch
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(task ? 'Task updated successfully' : 'Task created successfully');
      onClose();
      // Refresh list tasks
      dispatch(fetchTasks({ page: 0, size: 10 }));
    } else {
      toast.error(task ? 'Failed to update task' : 'Failed to create task');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? 'Sửa Task' : 'Tạo Task Mới'}</DialogTitle>
      <FormProvider {...methods}>
        <DialogContent>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormInput name="title" label="Tiêu đề" placeholder="Nhập tiêu đề task..." />

            <FormInput
              name="description"
              label="Mô tả"
              multiline
              rows={4}
              placeholder="Nhập mô tả chi tiết..."
            />

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Box sx={{ flex: 1 }}>
                <FormDate name="deadline" label="Deadline" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <FormInput name="status" label="Trạng thái" select>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                </FormInput>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Box sx={{ flex: 1 }}>
                <FormInput name="categoryId" label="Danh mục" select disabled={catLoading}>
                  {/* <MenuItem value="">Không chọn</MenuItem> */}
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </FormInput>
              </Box>
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <FormSwitch name="completed" label="Đã hoàn thành" />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button
            type="submit"
            variant="contained"
            onClick={methods.handleSubmit(onSubmit)}
            disabled={methods.formState.isSubmitting || catLoading}
          >

            {methods.formState.isSubmitting ? <CircularProgress size={24} /> : (task ? 'Cập nhật' : 'Tạo')}
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default TaskFormModal;