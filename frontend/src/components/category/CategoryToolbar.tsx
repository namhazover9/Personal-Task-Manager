import React from 'react';
import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface CategoryToolbarProps {
    searchKeyword: string;
    onSearchChange: (keyword: string) => void;
}

const CategoryToolbar: React.FC<CategoryToolbarProps> = ({ searchKeyword, onSearchChange }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Box sx={{ flex: 1, maxWidth: 400 }}>
                <TextField
                    fullWidth
                    placeholder="Search categories..."
                    value={searchKeyword}
                    onChange={(e) => onSearchChange(e.target.value)}
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: searchKeyword && (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={() => onSearchChange('')}>
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
        </Paper>
    );
};

export default CategoryToolbar;
