import React from 'react';
import useToast from '../hooks/useToast';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/slices/authSlice';
import { AppDispatch, RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Link,
} from '@mui/material';
import FormInput from '../components/common/FormInput';
import AuthLayout from '../layouts/AuthLayout';

// Schema validation
const schema = yup.object({
  username: yup.string().required('Tên đăng nhập là bắt buộc').min(3, 'Tối thiểu 3 ký tự'),
  email: yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),
  password: yup.string().required('Mật khẩu là bắt buộc').min(6, 'Mật khẩu ít nhất 6 ký tự'),
});

// Registration page
const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const toast = useToast();
  const { loading } = useSelector((state: RootState) => state.auth);

  // Initialize react-hook-form with yup resolver
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: any) => {
    const result = await dispatch(register(data));
    if (register.fulfilled.match(result)) {
      toast.success('Registration successful! Please login.');
      navigate('/login'); // Sau đăng ký thành công → chuyển sang login
    } else {
      toast.error((result.payload as string) || 'Registration failed');
    }
  };

  return (
    <AuthLayout title="Đăng Ký"
      subtitle="Chưa có tài khoản? Đăng ký ngay! 👏"
    >
      <FormProvider {...methods} >
        <Box component="form" onSubmit={methods.handleSubmit(onSubmit)} noValidate >
          <FormInput name="username" label="Tên đăng nhập" autoFocus />
          <FormInput name="email" label="Email" type="email" />
          <FormInput name="password" label="Mật khẩu" type="password" />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>

          <Typography align="center">
            Đã có tài khoản?{' '}
            <Link href="/login" underline="hover">
              Đăng nhập ngay
            </Link>
          </Typography>
        </Box>
      </FormProvider>
    </AuthLayout>
  );
};

export default Register;