'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, TextField, Typography, Stack, MenuItem } from '@mui/material';
import { useRouter } from 'next/navigation';
import { PlatformFee } from '@/lib/types';

const feeSchema = z.object({
    tierName: z.string().min(1, 'Tier Name is required'),
    percentage: z.number().min(0).max(100),
    fixedAmount: z.number().min(0),
    isActive: z.boolean(),
});

type FeeFormData = z.infer<typeof feeSchema>;

interface FeeFormProps {
    initialData?: PlatformFee;
    onSubmit: (data: FeeFormData) => void;
}

export default function PlatformFeeForm({ initialData, onSubmit }: FeeFormProps) {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<FeeFormData>({
        resolver: zodResolver(feeSchema),
        defaultValues: initialData || {
            tierName: '',
            percentage: 0,
            fixedAmount: 0,
            isActive: true,
        },
    });

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 500, bgcolor: 'white', p: 4, borderRadius: 2 }}>
            <Stack spacing={3}>
                <TextField
                    {...register('tierName')}
                    label="Tier Name"
                    fullWidth
                    error={!!errors.tierName}
                    helperText={errors.tierName?.message}
                />
                <TextField
                    {...register('percentage', { valueAsNumber: true })}
                    label="Percentage (%)"
                    type="number"
                    fullWidth
                    error={!!errors.percentage}
                    helperText={errors.percentage?.message}
                />
                <TextField
                    {...register('fixedAmount', { valueAsNumber: true })}
                    label="Fixed Fee (RM)"
                    type="number"
                    fullWidth
                    error={!!errors.fixedAmount}
                    helperText={errors.fixedAmount?.message}
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
                        Save Fee
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
}
