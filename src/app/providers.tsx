'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import theme from '@/components/theme';
import { useState } from 'react';
import AuthInitializer from '@/components/auth/AuthInitializer';

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <Provider store={store}>
            <AuthInitializer />
            <QueryClientProvider client={queryClient}>
                <AppRouterCacheProvider>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        {children}
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </QueryClientProvider>
        </Provider>
    );
}
