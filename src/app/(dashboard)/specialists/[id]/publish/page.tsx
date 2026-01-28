'use client';

import { use, useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Divider, Stack } from '@mui/material';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Specialist } from '@/lib/types';

// Mock Fetch
const getMockSpecialist = (id: string): Specialist => ({
    id,
    title: 'Incorporation of a new company',
    price: 2000,
    currency: 'RM',
    purchases: 20,
    duration: '3 Days',
    approvalStatus: 'Approved',
    publishStatus: 'Not Published',
});

export default function PublishSpecialistPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const [data, setData] = useState<Specialist | undefined>(undefined);

    useEffect(() => {
        setData(getMockSpecialist(resolvedParams.id));
    }, [resolvedParams.id]);

    const handlePublish = async () => {
        // Simulate API
        console.log('Publishing:', resolvedParams.id);
        await new Promise(r => setTimeout(r, 1000));
        router.push('/specialists');
    };

    if (!data) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                Publish Service
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Review the service details before making it live. Published services will be visible to all clients.
            </Typography>

            <Paper sx={{ p: 4, borderRadius: 2, border: '1px solid #E0E0E0' }} elevation={0}>
                <Stack spacing={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: 60, height: 60, bgcolor: '#0f2c59', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="h6" color="white">S</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight={600}>{data.title}</Typography>
                            <Typography variant="body2" color="text.secondary">{data.currency} {data.price.toLocaleString()} • {data.duration}</Typography>
                        </Box>
                    </Box>

                    <Divider />

                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Description</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Register a new company private limited (Sdn Bhd). Package includes Name Search, Incorporation Fee, and Company Secretary appointment.
                        </Typography>
                    </Box>

                    <Box sx={{ bgcolor: '#FFF3E0', p: 2, borderRadius: 2, display: 'flex', gap: 2 }}>
                        <AlertTriangle color="#F57C00" size={24} />
                        <Box>
                            <Typography variant="subtitle2" color="#E65100">Ready to Publish?</Typography>
                            <Typography variant="caption" color="#EF6C00">
                                Once published, this service will be live on the marketplace. You can unpublish it at any time.
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                        <Button variant="outlined" onClick={() => router.back()} color="inherit">
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handlePublish}
                            startIcon={<CheckCircle size={18} />}
                            sx={{ bgcolor: '#00C853', '&:hover': { bgcolor: '#009624' } }}
                        >
                            Publish Now
                        </Button>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
}
