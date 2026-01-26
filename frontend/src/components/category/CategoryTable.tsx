import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Category } from '../../types/category';

interface CategoryTableProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, onEdit, onDelete }) => {
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
                        <TableCell sx={{ pl: 3, fontWeight: 600, width: '15%' }} align="center">ID</TableCell>
                        <TableCell sx={{ fontWeight: 600, width: '60%' }} align="center">Tên danh mục</TableCell>
                        <TableCell sx={{ pr: 3, fontWeight: 600, width: '25%' }} align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {categories.map((category) => (
                        <TableRow key={category.id} sx={{
                            '&:nth-of-type(odd)': {
                                backgroundColor: 'action.hover',
                            },
                            '&:hover': {
                                backgroundColor: 'action.selected',
                                cursor: 'pointer',
                            },
                        }}>
                            <TableCell align="center">{category.id}</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600 }}>{category.name}</TableCell>
                            <TableCell align="center">
                                <Tooltip title="Edit">
                                    <IconButton onClick={() => onEdit(category)} color="primary" size="small">
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton onClick={() => onDelete(category)} color="error" size="small">
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                    {categories.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                                No categories found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CategoryTable;
