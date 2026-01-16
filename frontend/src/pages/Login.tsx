import React from 'react';
import useToast from '../hooks/useToast';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice';
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


// Schema validation với yup
const schema = yup.object({
  username: yup.string().required('Tên đăng nhập là bắt buộc'),
  password: yup.string().required('Mật khẩu là bắt buộc').min(6, 'Mật khẩu ít nhất 6 ký tự'),
});

// Trang đăng nhập
const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const toast = useToast();
  const { loading } = useSelector((state: RootState) => state.auth);


  // Khởi tạo react-hook-form với yup resolver
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Xử lý khi submit form
  const onSubmit = async (data: any) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      toast.success('Login successful!');
      navigate('/dashboard'); // redirect sau login thành công
    } else {
      toast.error((result.payload as string) || 'Login failed');
    }
  };

  // Giao diện trang đăng nhập
  return (
    <AuthLayout
      title="Đăng Nhập"
      subtitle="Chào mừng bạn quay trở lại 👋"
    >
      <FormProvider {...methods}>
        <Box component="form" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          <FormInput name="username" label="Tên đăng nhập" autoFocus />
          <FormInput name="password" label="Mật khẩu" type="password" />

          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>

          <Typography align="center">
            Chưa có tài khoản?{' '}
            <Link href="/register" underline="hover">
              Đăng ký ngay
            </Link>
          </Typography>
        </Box>
      </FormProvider>
    </AuthLayout>
  );

};

export default Login;