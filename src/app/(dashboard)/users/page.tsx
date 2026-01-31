'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip
} from '@mui/material';
import { Plus, Shield, User, Briefcase } from 'lucide-react';
import { UserRole } from '@/lib/types';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDrawer from '@/components/admin/UserDrawer';
import { useUsers } from '@/lib/queries/users';
import { useQueryClient } from '@tanstack/react-query';

const getRoleIcon = (role: UserRole) => {
    switch (role) {
        case UserRole.ADMIN:
            return <Shield size={16} />;
        case UserRole.SPECIALIST:
            return <Briefcase size={16} />;
        case UserRole.CLIENT:
            return <User size={16} />;
    }
};

const getRoleColor = (role: UserRole) => {
    switch (role) {
        case UserRole.ADMIN:
            return 'error';
        case UserRole.SPECIALIST:
            return 'primary';
        case UserRole.CLIENT:
            return 'default';
    }
};

export default function UsersPage() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { data: users, isLoading } = useUsers();
    const queryClient = useQueryClient();

    const handleUserCreated = () => {
        // Refresh the user list after creation
        queryClient.invalidateQueries({ queryKey: ['users'] });
    };

    if (isLoading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            User Management
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Create and manage users with different roles
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        onClick={() => setDrawerOpen(true)}
                        startIcon={<Plus size={18} />}
                        sx={{ bgcolor: '#0f2c59', textTransform: 'none' }}
                    >
                        Create New User
                    </Button>
                </Box>

                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#FAFAFA' }}>
                                <TableCell sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>
                                    EMAIL
                                </TableCell>
                                <TableCell sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>
                                    ROLE
                                </TableCell>
                                <TableCell sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>
                                    CREATED AT
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users?.items?.map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={500}>
                                            {user.email}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            icon={getRoleIcon(user.role)}
                                            label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            size="small"
                                            color={getRoleColor(user.role)}
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <UserDrawer
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    onSuccess={handleUserCreated}
                />
            </Box>
        </ProtectedRoute>
    );
}
