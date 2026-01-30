'use client';

import { use } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useOneSpecialist, usePublishSpecialist } from '@/lib/queries/specialists';
import { ChevronLeft } from 'lucide-react';

export default function PublishSpecialistPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const { data: specialist, isLoading } = useOneSpecialist(id);
    const { mutate: publishSpecialist, isPending } = usePublishSpecialist();

    const handlePublish = () => {
        publishSpecialist(id, {
            onSuccess: () => {
                router.push(`/specialists/${id}`);
            },
            onError: (error) => {
                console.error('Failed to publish specialist:', error);
                // Optionally show toast
            }
        });
    };

    if (isLoading) return <Typography>Loading...</Typography>;
    if (!specialist) return <Typography>Specialist not found</Typography>;

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
            <Button
                startIcon={<ChevronLeft />}
                onClick={() => router.back()}
                sx={{ mb: 3, textTransform: 'none', color: 'text.secondary' }}
            >
                Back to Details
            </Button>

            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                Publish Service
            </Typography>

            <Box sx={{ p: 3, border: '1px solid #E0E0E0', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                    {specialist.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {specialist.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handlePublish}
                        disabled={!specialist.isDraft || isPending}
                        sx={{
                            bgcolor: '#0f2c59',
                            textTransform: 'none',
                        }}
                    >
                        {isPending ? 'Publishing...' : 'Publish'}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => router.back()}
                        sx={{ textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
