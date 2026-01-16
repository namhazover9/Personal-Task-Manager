import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task } from '../../types/task';

interface TaskTableProps {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onEdit, onDelete }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'success';
            case 'IN_PROGRESS':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getDaysLeft = (deadline: string | Date) => {
        const now = new Date();
        const end = new Date(deadline);

        // Reset giờ để tránh lỗi lệch timezone
        now.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        const diffTime = end.getTime() - now.getTime();

        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    const getDeadlineColor = (task: Task) => {
        if (!task.deadline) return 'text.secondary';

        // Nếu đã hoàn thành → màu trung tính / xanh
        if (task.status === 'COMPLETED') {
            return 'success.main';
        }

        const daysLeft = getDaysLeft(task.deadline);

        if (daysLeft < 0) return 'error.main';      // Quá hạn
        if (daysLeft === 1) return 'warning.main';  // Còn 1 ngày
        return 'text.primary';
    }



    return (
        <TableContainer component={Paper} elevation={0}
            sx={{ width: '100%', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Table sx={{
                width: '100%',
                tableLayout: 'fixed',
                '& th, & td': {
                    borderRight: '1px solid',
                    borderColor: 'divider',
                },
                '& th:last-child, & td:last-child': {
                    borderRight: 'none',
                },
            }}>
                <TableHead sx={{ bgcolor: 'background.neutral' }}>
                    <TableRow>
                        <TableCell sx={{ pl: 3, fontWeight: 600, width: '20%' }} align="center">Title</TableCell>
                        <TableCell sx={{ fontWeight: 600, width: '25%' }} align="center">Description</TableCell>
                        <TableCell sx={{ fontWeight: 600, width: '10%' }} align="center">Category</TableCell>
                        <TableCell sx={{ fontWeight: 600, width: '15%' }} align="center">Status</TableCell>
                        <TableCell sx={{ fontWeight: 600, width: '15%' }} align="center">Deadline</TableCell>
                        <TableCell sx={{ pr: 3, fontWeight: 600, width: '15%' }} align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tasks.map((task, index) => (
                        <TableRow key={task.id} sx={{
                            '&:nth-of-type(odd)': {
                                backgroundColor: 'action.hover',
                            },
                            '&:hover': {
                                backgroundColor: 'action.selected',
                                cursor: 'pointer',
                            },
                        }}>
                            <TableCell sx={{ fontWeight: 600 }}>{task.title}</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {task.description || '-'}
                            </TableCell>
                            <TableCell align="center">
                                {/* <Chip
                                    label={task.categoryName || 'Uncategorized'}
                                    size="small"
                                    variant="outlined"
                                    color={task.categoryName ? 'info' : 'default'}
                                /> */}
                                {task.categoryName}
                            </TableCell>
                            <TableCell align="center">
                                <Chip
                                    label={task.status.replace('_', ' ')}
                                    color={getStatusColor(task.status) as any}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontWeight: 'bold' }}
                                />
                            </TableCell>
                            <TableCell align="center">
                                {task.deadline ? (
                                    <Typography
                                        sx={{
                                            fontWeight: 600,
                                            color: getDeadlineColor(task),
                                        }}
                                    >
                                        {new Date(task.deadline).toLocaleDateString()}
                                    </Typography>
                                ) : (
                                    '-'
                                )}
                            </TableCell>
                            <TableCell align="center">
                                <Tooltip title="Edit">
                                    <IconButton onClick={() => onEdit(task)} color="primary" size="small">
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton onClick={() => onDelete(task)} color="error" size="small">
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                    {tasks.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                No tasks found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TaskTable;
