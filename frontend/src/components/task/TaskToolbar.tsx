import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    MenuItem,
    InputAdornment,
    IconButton,
    Paper,
    FormControl,
    Select,
    InputLabel,
    SelectChangeEvent,
    useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { setFilter, fetchTasks } from '../../redux/slices/taskSlice';
import { fetchCategories } from '../../redux/slices/categorySlice';
import { TaskStatus } from '../../types/task';

const TaskToolbar: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const theme = useTheme();
    const { filter } = useSelector((state: RootState) => state.task);
    const { categories } = useSelector((state: RootState) => state.category);

    const [localKeyword, setLocalKeyword] = useState(filter.keyword || '');

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (localKeyword !== filter.keyword) {
                dispatch(setFilter({ keyword: localKeyword, page: 0 })); // Reset page on search
            }
        }, 500); // Debounce 500ms

        return () => clearTimeout(timer);
    }, [localKeyword, dispatch, filter.keyword]);

    // Effect to trigger fetch when filter changes (excluding localKeyword which is handled by debounce)
    // We actually need to trigger fetch in Dashboard or here. 
    // Best practice: Trigger in Dashboard based on filter change, OR trigger here.
    // Given the architecture, let's trigger here when critical filter parts change? 
    // Actually, usually Filter changes -> State update -> useEffect in Dashboard listening to State -> Fetch.
    // Let's stick to Dashboard listening to filter state changes.

    const handleStatusChange = (event: SelectChangeEvent) => {
        dispatch(setFilter({ status: event.target.value as TaskStatus | '', page: 0 }));
    };

    const handleCategoryChange = (event: SelectChangeEvent<any>) => {
        const value = event.target.value;
        dispatch(setFilter({ categoryId: value === '' ? undefined : Number(value), page: 0 }));
    };

    const handleClearSearch = () => {
        setLocalKeyword('');
        dispatch(setFilter({ keyword: '', page: 0 }));
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Box sx={{ flex: 1, minWidth: 200 }}>
                <TextField
                    fullWidth
                    placeholder="Search tasks..."
                    value={localKeyword}
                    onChange={(e) => setLocalKeyword(e.target.value)}
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: localKeyword && (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={handleClearSearch}>
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                    value={filter.status || ''}
                    label="Status"
                    onChange={handleStatusChange}
                >
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                    <MenuItem value="COMPLETED">Completed</MenuItem>
                </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Category</InputLabel>
                <Select
                    value={filter.categoryId || ''}
                    label="Category"
                    onChange={handleCategoryChange as any}
                >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Paper>
    );
};

export default TaskToolbar;
