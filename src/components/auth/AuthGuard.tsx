'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLoading } from '@/store/slices/authSlice';
import { CircularProgress, Box } from '@mui/material';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);

    // AuthInitializer in providers.tsx now handles the initial loadUser call.
    // We just need to wait for loading to finish and then check authentication.

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            // If finish loading and still not authenticated, redirect
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
            }
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // If not authenticated (and not loading), we are likely redirecting, so return null or spinner
    if (!isAuthenticated) return null;

    return <>{children}</>;
}
