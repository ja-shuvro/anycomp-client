'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Drawer,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
    Alert
} from '@mui/material';
import { X } from 'lucide-react';
import { UserRole } from '@/lib/types';
import api from '@/lib/api';

const userSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.nativeEnum(UserRole),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserDrawerProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function UserDrawer({ open, onClose, onSuccess }: UserDrawerProps) {
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            role: UserRole.CLIENT
        }
    });

    const handleClose = () => {
        reset();
        setError(null);
        onClose();
    };

    const onSubmit = async (data: UserFormData) => {
        try {
            setIsSubmitting(true);
            setError(null);

            await api.post('/auth/register', data);

            onSuccess();
            handleClose();
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to create user');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: { width: { xs: '100%', sm: 500 } }
            }}
        >
            <Box sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight={600}>
                        Create New User
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <X size={24} />
                    </IconButton>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Form */}
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        disabled={isSubmitting}
                    />

                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        {...register('password')}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        disabled={isSubmitting}
                    />

                    <FormControl fullWidth margin="normal" error={!!errors.role}>
                        <InputLabel>Role</InputLabel>
                        <Select
                            label="Role"
                            defaultValue={UserRole.CLIENT}
                            {...register('role')}
                            disabled={isSubmitting}
                        >
                            <MenuItem value={UserRole.CLIENT}>
                                <Box>
                                    <Typography fontWeight={600}>Client</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Read-only access to specialists
                                    </Typography>
                                </Box>
                            </MenuItem>
                            <MenuItem value={UserRole.SPECIALIST}>
                                <Box>
                                    <Typography fontWeight={600}>Specialist</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Can create and manage specialists
                                    </Typography>
                                </Box>
                            </MenuItem>
                            <MenuItem value={UserRole.ADMIN}>
                                <Box>
                                    <Typography fontWeight={600}>Admin</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Full access to all features
                                    </Typography>
                                </Box>
                            </MenuItem>
                        </Select>
                        {errors.role && (
                            <FormHelperText>{errors.role.message}</FormHelperText>
                        )}
                    </FormControl>

                    <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={isSubmitting}
                            sx={{ bgcolor: '#0f2c59', '&:hover': { bgcolor: '#0a1e3f' } }}
                        >
                            {isSubmitting ? 'Creating...' : 'Create User'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Drawer>
    );
}
