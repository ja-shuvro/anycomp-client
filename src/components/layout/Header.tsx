'use client';

import { useState } from 'react';
import { Box, Typography, IconButton, Badge, Avatar, Menu, MenuItem } from '@mui/material';
import { Bell, Mail } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';

export default function Header() {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        handleClose();
        await dispatch(logoutUser());
        router.push('/login');
    };

    // Simple breadcrumb logic
    const pathSegments = pathname.split('/').filter(Boolean);
    const title = pathSegments.length > 0
        ? pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1)
        : 'Dashboard';

    // Use user data from Redux
    const { user } = useAppSelector((state) => state.auth);

    // Mock avatar or placeholder based on user name/email if available
    // For now we can use a generated avatar based on the user's name/email or a default
    const avatarUrl = 'https://ui-avatars.com/api/?name=' + (user?.email || 'User') + '&background=random';

    return (
        <Box
            component="header"
            sx={{
                height: 64,
                px: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: 'white', // White background as per image
                borderBottom: '1px solid #eee', // Subtle border
            }}
        >
            <Box>
                {/* 
                <Typography variant="caption" color="text.secondary">
                    Dashboard
                </Typography>
                <Typography variant="h6" fontWeight={700} color="text.primary">
                    {title}
                </Typography> 
                Keeping title hidden for now to match the clean look in the image strip provided, 
                or we can keep it. The image shows a very empty bar on the left.
                Let's keep the title but make it subtle or just render empty if strictly following the strip.
                The strip shows nothing on the left. I will keep the title logic but render nothing on left if strictly following "like this image".
                However, usually a header needs a title. I'll stick to the right side changes mainly.
                */}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton size="small">
                    <Mail size={20} color="#666" />
                </IconButton>

                <IconButton size="small">
                    <Badge badgeContent={1} color="error" variant="dot">
                        <Bell size={20} color="#666" />
                    </Badge>
                </IconButton>

                <IconButton
                    onClick={handleMenuClick}
                    size="small"
                    sx={{ ml: 1 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar
                        src={avatarUrl}
                        sx={{ width: 32, height: 32 }}
                    />
                </IconButton>
            </Box>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                        },
                    },
                }}
            >
                <MenuItem onClick={handleLogout}>
                    Logout
                </MenuItem>
            </Menu>
        </Box>
    );
}
