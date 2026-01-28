'use client';

import { Box, Typography } from '@mui/material';
import SpecialistForm from '@/components/specialists/SpecialistForm';
import { useRouter } from 'next/navigation';

export default function CreateSpecialistPage() {
    const router = useRouter();

    const handleCreate = async (data: any) => {
        console.log('Creating Specialist:', data);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push('/specialists');
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                Create New Service
            </Typography>
            <SpecialistForm onSubmit={handleCreate} />
        </Box>
    );
}
