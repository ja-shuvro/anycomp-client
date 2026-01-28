'use client';

import { Box, Typography, IconButton, Breadcrumbs } from '@mui/material';
import { Bell, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();

    // Simple breadcrumb logic
    const pathSegments = pathname.split('/').filter(Boolean);
    const title = pathSegments.length > 0
        ? pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1)
        : 'Dashboard';

    return (
        <Box
            component="header"
            sx={{
                height: 64,
                px: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: 'transparent', // Looks like it blends with background in image
            }}
        >
            <Box>
                <Typography variant="caption" color="text.secondary">
                    Dashboard
                </Typography>
                <Typography variant="h6" fontWeight={700} color="text.primary">
                    {title}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                {/* Placeholder for header actions like Notifications */}
                <IconButton size="small">
                    <Bell size={20} color="#666" />
                </IconButton>
            </Box>
        </Box>
    );
}
