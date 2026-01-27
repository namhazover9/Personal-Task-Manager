import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, removeTask, setFilter } from '../redux/slices/taskSlice';
import { RootState, AppDispatch } from '../redux/store';
import {
  Typography,
  Button,
  Box,
  CircularProgress,
  TablePagination,
} from '@mui/material';
import TaskFormModal from '../components/task/TaskFormModal';
import TaskTable from '../components/task/TaskTable';
import TaskToolbar from '../components/task/TaskToolbar';
import { Task } from '../types/task';
import useToast from '../hooks/useToast';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
  const { tasks, loading, error, filter } = useSelector((state: RootState) => state.task);
  const toast = useToast();

  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  // Fetch tasks whenever filter changes
  useEffect(() => {
    dispatch(fetchTasks(filter));
  }, [dispatch, filter]);

  const handlePageChange = (event: unknown, newPage: number) => {
    dispatch(setFilter({ page: newPage }));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilter({ size: parseInt(event.target.value, 10), page: 0 }));
  };

  return (
    <Box sx={{ width: '100%', flexGrow: 1 }}>
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

      {/* Toolbar for Search & Filter */}
      <TaskToolbar />

      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}

      {error && (
        <Typography color="error" align="center" sx={{ my: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && tasks && (
        <>
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
                  // No need to manual fetch, removing task updates store or triggers refetch if needed.
                  // Current removeTask reducer updates state locally, so it's fine.
                  // But to be consistent with pagination, maybe we should fetch again? 
                  // For now local update is faster UX.
                } else {
                  toast.error('Failed to delete task');
                }
              }
            }}
          />
          <TablePagination
            component="div"
            count={tasks.totalElements}
            page={tasks.number}
            onPageChange={handlePageChange}
            rowsPerPage={tasks.size}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
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