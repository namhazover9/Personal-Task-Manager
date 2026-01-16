import React from 'react';
import { Box, Typography } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

interface AuthLayoutProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
    title,
    subtitle,
    children,
}) => {
    return (
        <Box sx={{
            display: 'flex',
            minHeight: '100vh',
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            m: 0,
            p: 0,
        }}>
            {/* Left Side - Branding (Hidden on mobile) */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #474fa7ff 0%, #112f5eff 100%)',
                    display: { xs: 'none', sm: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    width: { sm: '40%', md: '50%' },
                    flexShrink: 0,
                    height: '100vh',
                }}
            >
                {/* Decorative Circles/Glow */}
                <Box sx={{
                    position: 'absolute',
                    top: '20%',
                    left: '10%',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                    borderRadius: '50%',
                }} />

                <Box sx={{ zIndex: 1, textAlign: 'center', p: 4, color: 'white' }}>
                    <TaskAltIcon sx={{ fontSize: 80, mb: 2, color: '#4FC3F7' }} />
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Task Manager
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.8, maxWidth: 400 }}>
                        Manage your tasks efficiently with AI-powered insights and premium experience.
                    </Typography>
                </Box>
            </Box>

            {/* Right Side - Form */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    height: '100vh',
                    bgcolor: '#F5F5F5',
                    p: 3,
                    overflow: 'auto',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        maxWidth: 450,
                        width: '100%',
                        p: 4,
                        borderRadius: 4,
                        boxShadow: '0px 10px 40px -10px rgba(0,0,0,0.1)',
                        bgcolor: '#FFFFFF',
                    }}
                >
                    <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom>
                        {title}
                    </Typography>

                    {subtitle && (
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                            {subtitle}
                        </Typography>
                    )}

                    <Box sx={{ width: '100%' }}>
                        {children}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default AuthLayout;