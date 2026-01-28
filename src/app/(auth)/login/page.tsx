'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, TextField, Typography, Link as MuiLink, InputAdornment, IconButton, Alert, CircularProgress } from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser } from '@/store/slices/authSlice';
import { UserRole } from '@/lib/types';

// Validation Schema
const loginSchema = z.object({
    email: z.string().min(1, 'Email or username is required'), // Backend accepts email/username
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isLoading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);

    const [showPassword, setShowPassword] = useState(false);

    // Redirect if logged in
    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === UserRole.ADMIN) {
                router.push('/specialists'); // or /dashboard
            } else {
                router.push('/dashboard'); // client dashboard
            }
        }
    }, [isAuthenticated, user, router]);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        await dispatch(loginUser(data));
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', width: '100vw', bgcolor: 'white' }}>
            {/* Left Side - Image/Banner */}
            <Box sx={{
                flex: 1,
                position: 'relative',
                display: { xs: 'none', md: 'block' }
            }}>
                {/* We'll use a placeholder or the provided image if available. 
            For now, using a solid color/gradient placeholder as "image" until asset is moved. */}
                <Box sx={{
                    height: '100%',
                    width: '100%',
                    bgcolor: '#e0e0e0', // Placeholder gray
                    backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 4
                }}>
                    {/* Branding Overlay (Mock based on image) */}
                    <Box sx={{
                        position: 'absolute',
                        top: 40,
                        left: 40
                    }}>
                        <Typography variant="h5" fontWeight={800} sx={{ color: 'white', letterSpacing: 2 }}>ANYCOMP</Typography>
                    </Box>
                </Box>
            </Box>

            {/* Right Side - Login Form */}
            <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 4
            }}>
                <Box sx={{ width: '100%', maxWidth: 400 }}>
                    <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                        Login
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Email</Typography>
                            <TextField
                                placeholder="Enter your email or username"
                                fullWidth
                                {...register('email')}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                sx={{ bgcolor: '#F9FAFB' }}
                            />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Password</Typography>
                            <TextField
                                placeholder=".........."
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                {...register('password')}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                sx={{ bgcolor: '#F9FAFB' }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            sx={{
                                py: 1.5,
                                bgcolor: '#0f2c59',
                                textTransform: 'none',
                                fontSize: 16,
                                '&:hover': { bgcolor: '#0a1e3f' }
                            }}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
                        </Button>


                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
