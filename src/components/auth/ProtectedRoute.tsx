'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/lib/types';
import { useRole } from '@/hooks/useRole';
import { Box, Typography, Button, Container } from '@mui/material';
import { ShieldX } from 'lucide-react';

interface ProtectedRouteProps {
    allowedRoles: UserRole[];
    children: ReactNode;
    fallback?: ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children, fallback }: ProtectedRouteProps) {
    const router = useRouter();
    const { hasRole } = useRole();

    if (!hasRole(allowedRoles)) {
        if (fallback) {
            return <>{fallback}</>;
        }

        // Default unauthorized UI
        return (
            <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <ShieldX size={64} color="#f44336" />
                    <Typography variant="h4" fontWeight={700}>
                        Access Denied
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        You don't have permission to access this page.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => router.push('/')}
                        sx={{ bgcolor: '#0f2c59', textTransform: 'none', minWidth: 120 }}
                    >
                        Go Home
                    </Button>
                </Box>
            </Container>
        );
    }

    return <>{children}</>;
}
