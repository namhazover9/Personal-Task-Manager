import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, removeCategory } from '../redux/slices/categorySlice';
import { RootState, AppDispatch } from '../redux/store';
import {
    Typography,
    Button,
    Box,
    CircularProgress,
} from '@mui/material';
import CategoryFormModal from '../components/category/CategoryFormModal';
import CategoryTable from '../components/category/CategoryTable';
import CategoryToolbar from '../components/category/CategoryToolbar';
import { Category } from '../types/category';
import useToast from '../hooks/useToast';

const Categories: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { categories, loading, error } = useSelector((state: RootState) => state.category);
    const toast = useToast();

    const [openModal, setOpenModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Client-side filtering
    const filteredCategories = useMemo(() => {
        if (!categories) return [];
        if (!searchKeyword.trim()) return categories;

        const keyword = searchKeyword.toLowerCase();
        return categories.filter(cat =>
            cat.name.toLowerCase().includes(keyword)
        );
    }, [categories, searchKeyword]);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">
                    Categories
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<span style={{ fontSize: 20 }}>+</span>}
                    onClick={() => {
                        setSelectedCategory(undefined);
                        setOpenModal(true);
                    }}
                >
                    New Category
                </Button>
            </Box>

            {/* Search Toolbar */}
            <CategoryToolbar
                searchKeyword={searchKeyword}
                onSearchChange={setSearchKeyword}
            />

            {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}

            {error && (
                <Typography color="error" align="center" sx={{ my: 2 }}>
                    {error}
                </Typography>
            )}

            {!loading && !error && categories && (
                <CategoryTable
                    categories={filteredCategories}
                    onEdit={(category) => {
                        setSelectedCategory(category);
                        setOpenModal(true);
                    }}
                    onDelete={async (category) => {
                        if (window.confirm(`Delete category "${category.name}"?`)) {
                            const result = await dispatch(removeCategory(category.id));
                            if (result.meta.requestStatus === 'fulfilled') {
                                toast.success('Category deleted successfully');
                            } else {
                                toast.error('Failed to delete category');
                            }
                        }
                    }}
                />
            )}

            <CategoryFormModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                category={selectedCategory}
            />
        </Box>
    );
};

export default Categories;
