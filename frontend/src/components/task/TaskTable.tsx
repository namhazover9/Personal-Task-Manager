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
                        <TableCell sx={{ pl: 3, fontWeight: 600, width: '25%' }} align="center">Title</TableCell>
                        <TableCell sx={{ fontWeight: 600, width: '30%' }} align="center">Description</TableCell>
                        <TableCell sx={{ fontWeight: 600, width: '15%' }} align="center">Status</TableCell>
                        <TableCell sx={{ fontWeight: 600, width: '15%' }} align="center">Deadline</TableCell>
                        <TableCell sx={{ pr: 3, fontWeight: 600, width: '15%' }} align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow key={task.id} hover>
                            <TableCell sx={{ fontWeight: 600 }}>{task.title}</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {task.description || '-'}
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
                                {task.deadline ? new Date(task.deadline).toLocaleDateString() : '-'}
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
                            <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
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
