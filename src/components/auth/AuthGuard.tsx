'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { loadUser, setLoading } from '@/store/slices/authSlice';
import { CircularProgress, Box } from '@mui/material';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        // Attempt to load user from token on mount
        const token = localStorage.getItem('token');
        if (token && !user) {
            dispatch(loadUser());
        } else if (!token && isLoading) {
            // No token found, stop loading so we can redirect
            dispatch(setLoading(false));
        }
    }, [dispatch, user, isLoading]);

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
