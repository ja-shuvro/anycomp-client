'use client';

import React from 'react';
import { Drawer, Box, Typography, IconButton, Button, TextField, Stack, MenuItem } from '@mui/material';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreatePlatformFee, useUpdatePlatformFee } from '@/lib/queries/platform-fees';
import { PlatformFee } from '@/lib/types';

const platformFeeSchema = z.object({
    tierName: z.enum(['basic', 'standard', 'premium', 'enterprise']),
    minValue: z.number().min(0, 'Minimum value must be at least 0'),
    maxValue: z.number().min(0, 'Maximum value must be at least 0'),
    platformFeePercentage: z.number().min(0, 'Fee must be at least 0%').max(100, 'Fee cannot exceed 100%'),
}).refine((data) => data.minValue < data.maxValue, {
    message: 'Minimum value must be less than maximum value',
    path: ['maxValue'],
});

type PlatformFeeFormData = z.infer<typeof platformFeeSchema>;

interface PlatformFeeDrawerProps {
    open: boolean;
    onClose: () => void;
    platformFee?: PlatformFee | null;
}

export default function PlatformFeeDrawer({ open, onClose, platformFee }: PlatformFeeDrawerProps) {
    const isEdit = !!platformFee;
    const { mutate: createFee, isPending: isCreating } = useCreatePlatformFee();
    const { mutate: updateFee, isPending: isUpdating } = useUpdatePlatformFee();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<PlatformFeeFormData>({
        resolver: zodResolver(platformFeeSchema),
        defaultValues: {
            tierName: 'basic',
            minValue: 0,
            maxValue: 0,
            platformFeePercentage: 0,
        },
    });

    React.useEffect(() => {
        if (platformFee) {
            reset({
                tierName: platformFee.tierName,
                minValue: platformFee.minValue,
                maxValue: platformFee.maxValue,
                platformFeePercentage: platformFee.platformFeePercentage,
            });
        } else {
            reset({
                tierName: 'basic',
                minValue: 0,
                maxValue: 0,
                platformFeePercentage: 0,
            });
        }
    }, [platformFee, reset]);

    const onSubmit = (data: PlatformFeeFormData) => {
        if (isEdit && platformFee?.id) {
            updateFee(
                { id: platformFee.id, data },
                {
                    onSuccess: () => {
                        onClose();
                        reset();
                    },
                    onError: (error) => {
                        console.error('Failed to update platform fee:', error);
                        alert('Failed to update platform fee. Please try again.');
                    },
                }
            );
        } else {
            createFee(data as any, {
                onSuccess: () => {
                    onClose();
                    reset();
                },
                onError: (error) => {
                    console.error('Failed to create platform fee:', error);
                    alert('Failed to create platform fee. Please try again.');
                },
            });
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 500 },
                    p: 3,
                },
            }}
        >
            <Box>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight={700}>
                        {isEdit ? 'Edit Platform Fee' : 'Create Platform Fee'}
                    </Typography>
                    <IconButton onClick={handleClose} size="small">
                        <X size={20} />
                    </IconButton>
                </Box>

                {/* Form */}
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={3}>
                        <TextField
                            select
                            label="Tier Name"
                            fullWidth
                            defaultValue="basic"
                            {...register('tierName')}
                            error={!!errors.tierName}
                            helperText={errors.tierName?.message}
                        >
                            <MenuItem value="basic">Basic</MenuItem>
                            <MenuItem value="standard">Standard</MenuItem>
                            <MenuItem value="premium">Premium</MenuItem>
                            <MenuItem value="enterprise">Enterprise</MenuItem>
                        </TextField>

                        <TextField
                            label="Minimum Value (RM)"
                            type="number"
                            fullWidth
                            {...register('minValue', { valueAsNumber: true })}
                            error={!!errors.minValue}
                            helperText={errors.minValue?.message}
                            placeholder="e.g., 0"
                        />

                        <TextField
                            label="Maximum Value (RM)"
                            type="number"
                            fullWidth
                            {...register('maxValue', { valueAsNumber: true })}
                            error={!!errors.maxValue}
                            helperText={errors.maxValue?.message}
                            placeholder="e.g., 499"
                        />

                        <TextField
                            label="Platform Fee Percentage (%)"
                            type="number"
                            fullWidth
                            {...register('platformFeePercentage', { valueAsNumber: true })}
                            error={!!errors.platformFeePercentage}
                            helperText={errors.platformFeePercentage?.message}
                            placeholder="e.g., 10"
                            inputProps={{ step: '0.01', min: '0', max: '100' }}
                        />

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                            <Button variant="outlined" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isCreating || isUpdating}
                                sx={{ bgcolor: '#0f2c59' }}
                            >
                                {isCreating || isUpdating
                                    ? 'Saving...'
                                    : isEdit
                                        ? 'Update Fee'
                                        : 'Create Fee'}
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </Drawer>
    );
}
