'use client';

import { use, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import SpecialistForm from '@/components/specialists/SpecialistForm';
import { useRouter } from 'next/navigation';
import { Specialist } from '@/lib/types';

// Mock Fetch for Edit
const getMockSpecialist = (id: string): Specialist => ({
    id,
    title: 'Incorporation of a new company',
    price: 2000,
    currency: 'RM',
    purchases: 20,
    duration: '3 Days',
    approvalStatus: 'Approved',
    publishStatus: 'Published',
});

export default function EditSpecialistPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const [initialData, setInitialData] = useState<Specialist | undefined>(undefined);

    useEffect(() => {
        // Simulate fetching data
        const data = getMockSpecialist(resolvedParams.id);
        setInitialData(data);
    }, [resolvedParams.id]);

    const handleUpdate = async (data: any) => {
        console.log('Updating Specialist:', data);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push('/specialists');
    };

    if (!initialData) return <Typography>Loading...</Typography>;

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                Edit Service
            </Typography>
            <SpecialistForm initialData={initialData} onSubmit={handleUpdate} />
        </Box>
    );
}
