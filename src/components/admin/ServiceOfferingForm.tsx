'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, TextField, Stack, Autocomplete, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { CreateServiceOfferingRequest } from '@/lib/types';
import { useSpecialists } from '@/lib/queries/specialists';

const offeringSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters').max(255, 'Title must be less than 255 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    specialistId: z.string().uuid('Please select a specialist'),
    s3Key: z.string().optional(),
    bucketName: z.string().optional(),
});

type OfferingFormData = z.infer<typeof offeringSchema>;

interface OfferingFormProps {
    initialData?: Partial<CreateServiceOfferingRequest>;
    isEdit?: boolean;
    isLoading?: boolean;
    onSubmit: (data: OfferingFormData) => void;
    onCancel?: () => void;
}

export default function ServiceOfferingForm({ initialData, isEdit, isLoading, onSubmit, onCancel }: OfferingFormProps) {
    const router = useRouter();
    const [selectedSpecialist, setSelectedSpecialist] = useState<string | null>(initialData?.specialistId || null);

    // Fetch specialists for the autocomplete
    const { data: specialistsData, isLoading: isLoadingSpecialists } = useSpecialists({ page: 1, limit: 100 });
    const specialists = specialistsData?.items || [];

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<OfferingFormData>({
        resolver: zodResolver(offeringSchema),
        defaultValues: initialData || {
            title: '',
            description: '',
            specialistId: '',
            s3Key: '',
            bucketName: '',
        },
    });

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 600, bgcolor: 'white', p: 4, borderRadius: 2 }}>
            <Stack spacing={3}>
                <TextField
                    {...register('title')}
                    label="Service Title *"
                    fullWidth
                    placeholder="e.g., Company Incorporation"
                    error={!!errors.title}
                    helperText={errors.title?.message || 'Between 2-255 characters'}
                />

                <TextField
                    {...register('description')}
                    label="Description *"
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Describe the service offering"
                    error={!!errors.description}
                    helperText={errors.description?.message || 'Minimum 10 characters'}
                />

                <Autocomplete
                    options={specialists}
                    getOptionLabel={(option) => `${option.title} - $${option.basePrice}`}
                    loading={isLoadingSpecialists}
                    value={specialists.find(s => s.id === selectedSpecialist) || null}
                    onChange={(_, newValue) => {
                        setSelectedSpecialist(newValue?.id || null);
                        setValue('specialistId', newValue?.id || '', { shouldValidate: true });
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Specialist *"
                            error={!!errors.specialistId}
                            helperText={errors.specialistId?.message || 'Choose which specialist offers this service'}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {isLoadingSpecialists ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                />

                <TextField
                    {...register('s3Key')}
                    label="S3 Key (Optional)"
                    fullWidth
                    placeholder="e.g., icons/service-icon.png"
                    error={!!errors.s3Key}
                    helperText={errors.s3Key?.message || 'S3 bucket key for service icon/image'}
                />

                <TextField
                    {...register('bucketName')}
                    label="Bucket Name (Optional)"
                    fullWidth
                    placeholder="e.g., anycomp-assets"
                    error={!!errors.bucketName}
                    helperText={errors.bucketName?.message}
                />

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={onCancel || (() => router.back())}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ bgcolor: '#0f2c59' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : isEdit ? 'Update Offering' : 'Save Offering'}
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
}
