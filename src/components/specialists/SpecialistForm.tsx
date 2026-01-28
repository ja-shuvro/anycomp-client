'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, TextField, Typography, InputAdornment, Stack, Chip, MenuItem } from '@mui/material';
import { Specialist } from '@/lib/types';
import { useRouter } from 'next/navigation';

// Schema Validation
const specialistSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    duration: z.string().min(1, 'Duration is required'), // e.g., "7" (days assumed)
    price: z.number().min(0, 'Price must be positive'),
    currency: z.string(), // Removed .default('RM') to fix type mismatch with form defaultValues
    additionalOfferings: z.array(z.string()).optional(),
});

type SpecialistFormData = z.infer<typeof specialistSchema>;

interface SpecialistFormProps {
    initialData?: Specialist; // If editing
    onSubmit: (data: SpecialistFormData) => void;
    isSubmitting?: boolean;
}

const MOCK_OFFERINGS = ['Company Secretary Subscription', 'CTC Copies', 'eSignature'];

export default function SpecialistForm({ initialData, onSubmit, isSubmitting }: SpecialistFormProps) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<SpecialistFormData>({
        resolver: zodResolver(specialistSchema),
        defaultValues: initialData ? {
            title: initialData.title,
            price: initialData.price,
            currency: 'RM', // Hardcoded for now based on image
            duration: initialData.duration.replace(' Days', ''), // Extract number
            description: 'Describe your service here', // Placeholder or real data
            additionalOfferings: [],
        } : {
            title: '',
            description: '',
            duration: '1',
            price: 0,
            currency: 'RM',
            additionalOfferings: [],
        },
    });

    const activeOfferings = watch('additionalOfferings') || [];

    const toggleOffering = (offering: string) => {
        const current = activeOfferings;
        if (current.includes(offering)) {
            setValue('additionalOfferings', current.filter(o => o !== offering));
        } else {
            setValue('additionalOfferings', [...current, offering]);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', maxWidth: 600, bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: '0px 1px 3px rgba(0,0,0,0.1)' }}>
            <Stack spacing={3}>
                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Title</Typography>
                    <TextField
                        {...register('title')}
                        fullWidth
                        size="small"
                        error={!!errors.title}
                        helperText={errors.title?.message}
                    />
                </Box>

                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Description</Typography>
                    <TextField
                        {...register('description')}
                        fullWidth
                        multiline
                        rows={4}
                        size="small"
                        error={!!errors.description}
                        helperText={errors.description?.message}
                    />
                </Box>

                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Estimated Completion Time (Days)</Typography>
                    <TextField
                        {...register('duration')}
                        type="number"
                        fullWidth
                        size="small"
                        error={!!errors.duration}
                        helperText={errors.duration?.message}
                    />
                </Box>

                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Price</Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            disabled
                            value="RM"
                            size="small"
                            sx={{ width: 80, bgcolor: '#f5f5f5' }}
                        />
                        <TextField
                            {...register('price', { valueAsNumber: true })}
                            type="number"
                            fullWidth
                            size="small"
                            error={!!errors.price}
                            helperText={errors.price?.message}
                        />
                    </Box>
                </Box>

                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Additional Offerings</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {MOCK_OFFERINGS.map((offer) => (
                            <Chip
                                key={offer}
                                label={offer}
                                onClick={() => toggleOffering(offer)}
                                color={activeOfferings.includes(offer) ? 'primary' : 'default'}
                                variant={activeOfferings.includes(offer) ? 'filled' : 'outlined'}
                                sx={{ borderRadius: 1 }}
                            />
                        ))}
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                    <Button variant="outlined" onClick={() => router.back()} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{ bgcolor: '#0f2c59', '&:hover': { bgcolor: '#0a1e3f' } }}
                    >
                        Confirm
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
}
