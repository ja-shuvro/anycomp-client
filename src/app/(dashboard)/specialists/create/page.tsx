'use client';

import { Box, Typography, Button } from '@mui/material';
import { useCreateSpecialist } from '@/lib/queries/specialists';
import SpecialistForm from '@/components/specialists/SpecialistForm';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { CreateSpecialistData } from '@/lib/types';

export default function CreateSpecialistPage() {
    const router = useRouter();
    const { mutate: createSpecialist, isPending } = useCreateSpecialist();

    const handleSubmit = (data: CreateSpecialistData) => {
        createSpecialist(data, {
            onSuccess: () => {
                router.push('/specialists');
            },
            onError: (error) => {
                console.error("Failed to create specialist:", error);
                // Ideally show toast
            }
        });
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
                Create New Specialist
            </Typography>

            <SpecialistForm onSubmit={handleSubmit} isLoading={isPending} />
        </Box>
    );
}
