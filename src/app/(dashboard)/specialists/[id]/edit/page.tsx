'use client';

import { use } from 'react';
import { Box, Typography, Button } from '@mui/material';
import SpecialistForm from '@/components/specialists/SpecialistForm';
import { useRouter } from 'next/navigation';
import { useOneSpecialist, useUpdateSpecialist } from '@/lib/queries/specialists';
import { ChevronLeft } from 'lucide-react';

export default function EditSpecialistPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const { data: specialist, isLoading } = useOneSpecialist(id);
    const { mutate: updateSpecialist, isPending } = useUpdateSpecialist();

    const handleUpdate = (data: any) => {
        updateSpecialist(
            { id, data },
            {
                onSuccess: () => {
                    router.push(`/specialists/${id}`);
                },
                onError: (error) => {
                    console.error('Failed to update specialist:', error);
                    // Optionally show toast
                }
            }
        );
    };

    if (isLoading) return <Typography>Loading...</Typography>;
    if (!specialist) return <Typography>Specialist not found</Typography>;

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Button
                startIcon={<ChevronLeft />}
                onClick={() => router.back()}
                sx={{ mb: 3, textTransform: 'none', color: 'text.secondary' }}
            >
                Back to Details
            </Button>

            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                Edit Service
            </Typography>
            <SpecialistForm
                initialData={specialist}
                onSubmit={handleUpdate}
                isLoading={isPending}
            />
        </Box>
    );
}
