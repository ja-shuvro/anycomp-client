'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, TextField, Button, Typography, Paper, InputAdornment } from '@mui/material';
import { CreateSpecialistData } from '@/lib/types';
import { useRouter } from 'next/navigation';

const specialistSchema = z.object({
    title: z.string().min(2, 'Title is required').max(200),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    basePrice: z.coerce.number().min(0.01, 'Price must be greater than 0'),
    durationDays: z.coerce.number().int().min(1, 'Duration must be at least 1 day'),
    slug: z.string().optional(),
});

type SpecialistSchemaType = z.infer<typeof specialistSchema>;

interface SpecialistFormProps {
    initialData?: CreateSpecialistData;
    onSubmit: (data: SpecialistSchemaType) => void;
    isLoading?: boolean;
    isEdit?: boolean;
}

export default function SpecialistForm({ initialData, onSubmit, isLoading, isEdit }: SpecialistFormProps) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SpecialistSchemaType>({
        // Cast resolver to any to avoid strict type mismatch with zod coerce
        resolver: zodResolver(specialistSchema) as any,
        defaultValues: initialData || {
            title: '',
            description: '',
            basePrice: 0,
            durationDays: 1,
            slug: '',
        },
    });

    return (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: '1px solid #E0E0E0' }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h6" fontWeight={700}>
                    {isEdit ? 'Edit Specialist Details' : 'Specialist Details'}
                </Typography>

                {/* Title */}
                <Box>
                    <TextField
                        fullWidth
                        label="Title"
                        {...register('title')}
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        placeholder="e.g. Company Incorporation Service"
                    />
                </Box>

                {/* Slug & Duration */}
                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                    <TextField
                        fullWidth
                        label="Slug (Optional)"
                        {...register('slug')}
                        error={!!errors.slug}
                        helperText={errors.slug?.message}
                        placeholder="company-incorporation-service"
                        sx={{ flex: 1 }}
                    />
                    <TextField
                        fullWidth
                        label="Duration (Expected)"
                        type="number"
                        {...register('durationDays')}
                        error={!!errors.durationDays}
                        helperText={errors.durationDays?.message}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">Days</InputAdornment>,
                        }}
                        sx={{ flex: 1 }}
                    />
                </Box>

                {/* Price */}
                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                    <TextField
                        fullWidth
                        label="Base Price"
                        type="number"
                        {...register('basePrice')}
                        error={!!errors.basePrice}
                        helperText={errors.basePrice?.message}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">RM</InputAdornment>,
                        }}
                        sx={{ flex: 1 }}
                    />
                    {/* Empty Box for spacing alignment if needed, or let it stretch full width if single */}
                    <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }} />
                </Box>

                {/* Description */}
                <Box>
                    <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={6}
                        {...register('description')}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        placeholder="Detailed description of the specialist service..."
                    />
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 1 }}>
                    <Button
                        variant="outlined"
                        onClick={() => router.back()}
                        disabled={isLoading}
                        sx={{ textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        sx={{ bgcolor: '#0f2c59', textTransform: 'none' }}
                    >
                        {isLoading ? 'Saving...' : (isEdit ? 'Update details' : 'Create Specialist')}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}
