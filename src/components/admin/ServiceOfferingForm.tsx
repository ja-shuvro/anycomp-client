'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, TextField, Stack, MenuItem } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ServiceOffering } from '@/lib/types';

const offeringSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    basePrice: z.number().min(0),
    isActive: z.boolean(),
});

type OfferingFormData = z.infer<typeof offeringSchema>;

interface OfferingFormProps {
    initialData?: ServiceOffering;
    onSubmit: (data: OfferingFormData) => void;
}

export default function ServiceOfferingForm({ initialData, onSubmit }: OfferingFormProps) {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<OfferingFormData>({
        resolver: zodResolver(offeringSchema),
        defaultValues: initialData || {
            name: '',
            description: '',
            basePrice: 0,
            isActive: true,
        },
    });

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 600, bgcolor: 'white', p: 4, borderRadius: 2 }}>
            <Stack spacing={3}>
                <TextField
                    {...register('name')}
                    label="Service Name"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                />
                <TextField
                    {...register('description')}
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                />
                <TextField
                    {...register('basePrice', { valueAsNumber: true })}
                    label="Base Price (RM)"
                    type="number"
                    fullWidth
                    error={!!errors.basePrice}
                    helperText={errors.basePrice?.message}
                />

                <TextField
                    select
                    label="Status"
                    defaultValue={initialData?.isActive !== false ? 'true' : 'false'}
                    fullWidth
                    {...register('isActive', {
                        setValueAs: (v) => v === 'true'
                    })}
                >
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                </TextField>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                    <Button variant="outlined" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" sx={{ bgcolor: '#0f2c59' }}>
                        Save Offering
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
}
