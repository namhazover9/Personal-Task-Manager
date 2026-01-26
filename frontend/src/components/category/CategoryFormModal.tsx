import React, { useEffect } from 'react';
import useToast from '../../hooks/useToast';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { createNewCategory, updateExistingCategory, fetchCategories } from '../../redux/slices/categorySlice';
import { AppDispatch } from '../../redux/store';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    Box,
} from '@mui/material';
import FormInput from '../common/FormInput';
import { Category } from '../../types/category';

// Schema Yup for Category
const schema = yup.object({
    name: yup.string().required('Tên danh mục là bắt buộc'),
}).required();

interface CategoryFormModalProps {
    open: boolean;
    onClose: () => void;
    category?: Category; // If editing, pass category
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ open, onClose, category }) => {
    const dispatch = useDispatch<AppDispatch>();
    const toast = useToast();

    type IFormInput = yup.InferType<typeof schema>;

    const methods = useForm<IFormInput>({
        resolver: yupResolver(schema) as any,
        defaultValues: {
            name: '',
        },
    });

    useEffect(() => {
        // Reset form with category data (if edit)
        if (category) {
            methods.reset({
                name: category.name,
            });
        } else {
            methods.reset({
                name: '',
            });
        }
    }, [open, category, methods]);

    const onSubmit = async (data: IFormInput) => {
        let result;
        if (category) {
            // Update
            result = await dispatch(updateExistingCategory({ id: category.id, data }));
        } else {
            // Create
            result = await dispatch(createNewCategory(data));
        }

        if (result.meta.requestStatus === 'fulfilled') {
            toast.success(category ? 'Category updated successfully' : 'Category created successfully');
            onClose();
            dispatch(fetchCategories());
        } else {
            toast.error(category ? 'Failed to update category' : 'Failed to create category');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{category ? 'Sửa Danh Mục' : 'Tạo Danh Mục Mới'}</DialogTitle>
            <FormProvider {...methods}>
                <DialogContent>
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormInput
                            name="name"
                            label="Tên danh mục"
                            placeholder="Nhập tên danh mục..."
                            autoFocus
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Hủy</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        onClick={methods.handleSubmit(onSubmit)}
                        disabled={methods.formState.isSubmitting}
                    >
                        {methods.formState.isSubmitting ? <CircularProgress size={24} /> : (category ? 'Cập nhật' : 'Tạo')}
                    </Button>
                </DialogActions>
            </FormProvider>
        </Dialog>
    );
};

export default CategoryFormModal;