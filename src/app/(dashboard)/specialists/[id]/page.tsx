'use client';

import { Box, Typography, Button } from '@mui/material';
import { useOneSpecialist, useUpdateSpecialist } from '@/lib/queries/specialists';
import SpecialistForm from '@/components/specialists/SpecialistForm';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { CreateSpecialistData } from '@/lib/types';
import { use } from 'react';

export default function EditSpecialistPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { data: specialist, isLoading: isLoadingData } = useOneSpecialist(id);
    const { mutate: updateSpecialist, isPending: isUpdating } = useUpdateSpecialist();

    const handleSubmit = (data: CreateSpecialistData) => {
        updateSpecialist({ id, data }, {
            onSuccess: () => {
                router.push('/specialists');
            },
            onError: (error) => {
                console.error("Failed to update specialist:", error);
            }
        });
    };

    if (isLoadingData) return <Typography>Loading...</Typography>;
    if (!specialist) return <Typography>Specialist not found</Typography>;

    // Map existing data to form format
    const initialData: CreateSpecialistData = {
        title: specialist.title,
        description: specialist.description,
        basePrice: specialist.basePrice || specialist.price, // fallback
        durationDays: specialist.durationDays || 1,
        slug: specialist.slug,
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Button
                startIcon={<ChevronLeft />}
                onClick={() => router.back()}
                sx={{ mb: 3, textTransform: 'none', color: 'text.secondary' }}
            >
                Back to Specialists
            </Button>

            <Typography variant="h5" fontWeight={700} mb={3}>
                Edit Specialist
            </Typography>

            <SpecialistForm
                initialData={initialData}
                onSubmit={handleSubmit}
                isLoading={isUpdating}
                isEdit
            />
        </Box>
    );
}
