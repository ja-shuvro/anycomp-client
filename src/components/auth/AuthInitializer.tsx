'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { loadUser, setLoading } from '@/store/slices/authSlice';

export default function AuthInitializer() {
    const dispatch = useAppDispatch();
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            const token = localStorage.getItem('token');
            if (token) {
                dispatch(loadUser());
            } else {
                dispatch(setLoading(false));
            }
        }
    }, [dispatch]);

    return null;
}
