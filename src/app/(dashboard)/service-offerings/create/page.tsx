'use client';

import { Box, Typography } from '@mui/material';
import ServiceOfferingForm from '@/components/admin/ServiceOfferingForm';
import { useCreateServiceOffering } from '@/lib/queries/service-offerings';
import { useRouter } from 'next/navigation';

export default function CreateServiceOfferingPage() {
    const router = useRouter();
    const createMutation = useCreateServiceOffering();

    const handleCreate = (data: any) => {
        createMutation.mutate(data, {
            onSuccess: () => router.push('/service-offerings')
        });
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                Create Service Offering
            </Typography>
            <ServiceOfferingForm onSubmit={handleCreate} />
        </Box>
    );
}
