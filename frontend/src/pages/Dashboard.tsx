import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, removeTask } from '../redux/slices/taskSlice';
import { RootState, AppDispatch } from '../redux/store';
import {
  Typography,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import TaskFormModal from '../components/task/TaskFormModal';
import TaskTable from '../components/task/TaskTable';
import { Task } from '../types/task';
import useToast from '../hooks/useToast';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
  const { tasks, loading, error } = useSelector((state: RootState) => state.task);
  const toast = useToast();

  // Thêm state
  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  useEffect(() => {
    // Gọi API lấy tasks khi vào Dashboard
    dispatch(fetchTasks({ page: 0, size: 10 }));
  }, [dispatch]);


  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          My Tasks
        </Typography>
        <Button
          variant="contained"
          startIcon={<span style={{ fontSize: 20 }}>+</span>}
          onClick={() => {
            setSelectedTask(undefined);
            setOpenModal(true);
          }}
        >
          New Task
        </Button>
      </Box>

      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto' }} />}

      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}

      {!loading && !error && tasks && (
        <TaskTable
          tasks={tasks.content}
          onEdit={(task) => {
            setSelectedTask(task);
            setOpenModal(true);
          }}
          onDelete={async (task) => {
            if (window.confirm(`Delete task "${task.title}"?`)) {
              const result = await dispatch(removeTask(task.id));
              if (result.meta.requestStatus === 'fulfilled') {
                toast.success('Task deleted successfully');
                dispatch(fetchTasks({ page: 0, size: 10 }));
              } else {
                toast.error('Failed to delete task');
              }
            }
          }}
        />
      )}

      <TaskFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        task={selectedTask}
      />
    </Box>
  );
};

export default Dashboard;