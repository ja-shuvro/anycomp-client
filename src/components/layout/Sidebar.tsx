'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Users,
    FileText,
    MessageSquare,
    Receipt,
    HelpCircle,
    Settings,
    Briefcase
} from 'lucide-react';
import { Avatar, Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';

const MENU_ITEMS = [
    { text: 'Specialists', icon: Briefcase, href: '/specialists' },
    { text: 'Clients', icon: Users, href: '/clients' },
    { text: 'Service Orders', icon: FileText, href: '/orders' },
    { text: 'eSignature', icon: FileText, href: '/esignature' },
    { text: 'Messages', icon: MessageSquare, href: '/messages' },
    { text: 'Invoices & Receipts', icon: Receipt, href: '/invoices' },
];

const ADMIN_ITEMS = [
    { text: 'Platform Fees', icon: Settings, href: '/platform-fees' },
    { text: 'Service Offerings', icon: Briefcase, href: '/service-offerings' },
];

const BOTTOM_ITEMS = [
    { text: 'Help', icon: HelpCircle, href: '/help' },
    { text: 'Settings', icon: Settings, href: '/settings' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <Box
            component="nav"
            sx={{
                width: 280,
                height: '100vh',
                bgcolor: '#ffffff',
                borderRight: '1px solid #E5E7EB',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: 1200,
            }}
        >
            {/* Profile Section */}
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src="/profile-placeholder.jpg" alt="Profile" sx={{ width: 40, height: 40 }} />
                <Box>
                    <Typography variant="subtitle1" fontWeight={600} fontSize={14} color="text.primary">
                        Gwen Lam
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontSize={12}>
                        ST Comp Holdings Sdn Bhd
                    </Typography>
                </Box>
            </Box>

            {/* Dashboard Label */}
            <Box sx={{ px: 3, pb: 1, pt: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>
                    Dashboard
                </Typography>
            </Box>

            {/* Main Navigation */}
            <List disablePadding>
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <Link href={item.href} style={{ textDecoration: 'none', width: '100%' }}>
                                <ListItemButton
                                    selected={isActive}
                                    sx={{
                                        mx: 2,
                                        borderRadius: 2,
                                        '&.Mui-selected': {
                                            bgcolor: '#0f2c59', // Dark blue from image
                                            color: '#ffffff',
                                            '&:hover': {
                                                bgcolor: '#0a1e3f',
                                            },
                                            '& .MuiListItemIcon-root': {
                                                color: '#ffffff',
                                            },
                                        },
                                        '&:hover': {
                                            bgcolor: 'rgba(0, 0, 0, 0.04)',
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40, color: isActive ? '#ffffff' : 'text.secondary' }}>
                                        <item.icon size={20} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        primaryTypographyProps={{
                                            fontSize: 14,
                                            fontWeight: isActive ? 600 : 400,
                                            color: isActive ? 'inherit' : 'text.primary'
                                        }}
                                    />
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    );
                })}
            </List>

            <Box sx={{ px: 3, pb: 1, pt: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>
                    Admin
                </Typography>
            </Box>

            <List disablePadding>
                {ADMIN_ITEMS.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <Link href={item.href} style={{ textDecoration: 'none', width: '100%' }}>
                                <ListItemButton
                                    selected={isActive}
                                    sx={{
                                        mx: 2,
                                        borderRadius: 2,
                                        '&.Mui-selected': {
                                            bgcolor: '#0f2c59',
                                            color: '#ffffff',
                                            '&:hover': {
                                                bgcolor: '#0a1e3f',
                                            },
                                            '& .MuiListItemIcon-root': {
                                                color: '#ffffff',
                                            },
                                        },
                                        '&:hover': {
                                            bgcolor: 'rgba(0, 0, 0, 0.04)',
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40, color: isActive ? '#ffffff' : 'text.secondary' }}>
                                        <item.icon size={20} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        primaryTypographyProps={{
                                            fontSize: 14,
                                            fontWeight: isActive ? 600 : 400,
                                            color: isActive ? 'inherit' : 'text.primary'
                                        }}
                                    />
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    );
                })}
            </List>

            <Box sx={{ flexGrow: 1 }} />

            {/* Bottom Actions */}
            <List disablePadding sx={{ mb: 2 }}>
                {BOTTOM_ITEMS.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <Link href={item.href} style={{ textDecoration: 'none', width: '100%' }}>
                            <ListItemButton sx={{ mx: 2, borderRadius: 2 }}>
                                <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                                    <item.icon size={20} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{ fontSize: 14, color: 'text.secondary' }}
                                />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
