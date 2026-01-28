'use client';

import { Box, Typography } from '@mui/material';
import PlatformFeeForm from '@/components/admin/PlatformFeeForm';
import { useCreatePlatformFee } from '@/lib/queries/platform-fees';
import { useRouter } from 'next/navigation';

export default function CreatePlatformFeePage() {
    const router = useRouter();
    const createMutation = useCreatePlatformFee();

    const handleCreate = (data: any) => {
        createMutation.mutate(data, {
            onSuccess: () => router.push('/platform-fees')
        });
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                Create Platform Fee
            </Typography>
            <PlatformFeeForm onSubmit={handleCreate} />
        </Box>
    );
}
