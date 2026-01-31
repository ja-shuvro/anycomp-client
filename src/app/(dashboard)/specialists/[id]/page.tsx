'use client';

import { use, useState } from 'react';
import { Box, Typography, Button, Container, Divider, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useOneSpecialist, usePublishSpecialist } from '@/lib/queries/specialists';
import ServiceGallery from '@/components/specialists/ServiceGallery';
import PricingCard from '@/components/specialists/PricingCard';
import ServiceProviderProfile from '@/components/specialists/ServiceProviderProfile';

export default function SpecialistDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { data: specialist, isLoading } = useOneSpecialist(id);
    const { mutate: publishSpecialist, isPending: isPublishing } = usePublishSpecialist();
    const [errorDialog, setErrorDialog] = useState({ open: false, message: '' });

    const handlePublish = () => {
        publishSpecialist(id, {
            onSuccess: () => {
                setErrorDialog({ open: true, message: 'SUCCESS: Specialist published successfully!' });
            },
            onError: (error: any) => {
                const errorMessage = error?.response?.data?.error?.message ||
                    error?.message ||
                    'Failed to publish specialist';
                setErrorDialog({ open: true, message: errorMessage });
                console.error('Failed to publish specialist:', error);
            }
        });
    };

    const handleCloseDialog = () => {
        setErrorDialog({ open: false, message: '' });
    };

    const handleGoToEdit = () => {
        handleCloseDialog();
        router.push(`/specialists/${id}/edit`);
    };

    if (isLoading) return <Typography>Loading...</Typography>;
    if (!specialist) return <Typography>Specialist not found</Typography>;

    const isSuccess = errorDialog.message.startsWith('SUCCESS:');
    const needsServices = errorDialog.message.includes('at least one service');

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Grid container spacing={6}>
                <Grid size={{ xs: 12, md: 7 }}>
                    <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
                        {specialist.title}
                    </Typography>
                    <ServiceGallery />

                    <Box sx={{ my: 4 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            Description
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                            {specialist.description || "Describe your service here"}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 4 }} />

                    <Box sx={{ my: 4 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            Additional Offerings
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Enhance your service by adding additional offerings
                        </Typography>
                        {specialist.serviceOfferings && specialist.serviceOfferings.length > 0 ? (
                            <Box sx={{ mt: 2 }}>
                                {specialist.serviceOfferings.map((offering, index) => (
                                    <Typography key={index} variant="body2">
                                        • {offering.serviceOfferingsMasterList.title}
                                    </Typography>
                                ))}
                            </Box>
                        ) : (
                            <Alert severity="warning" sx={{ mt: 2 }}>
                                No services added yet. Add at least one service to publish this specialist.
                            </Alert>
                        )}
                    </Box>

                    <Divider sx={{ my: 4 }} />

                    <ServiceProviderProfile />
                </Grid>

                {/* Right Column - Pricing */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Box sx={{ position: 'sticky', top: 24 }}>
                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Button
                                variant="contained"
                                sx={{
                                    bgcolor: '#000', // Dark blue/blackish from image
                                    textTransform: 'none',
                                    minWidth: 100
                                }}
                                onClick={() => router.push(`/specialists/${id}/edit`)}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="contained"
                                disabled={!specialist.isDraft || isPublishing}
                                sx={{
                                    bgcolor: '#0f2c59', // Brighter blue
                                    textTransform: 'none',
                                    minWidth: 100
                                }}
                                onClick={handlePublish}
                            >
                                {isPublishing ? 'Publishing...' : specialist.isDraft ? 'Publish' : 'Published'}
                            </Button>
                        </Box>

                        <PricingCard
                            basePrice={specialist.finalPrice || specialist.basePrice}
                            currency="MYR"
                        />
                    </Box>
                </Grid>
            </Grid>

            {/* Error/Success Dialog */}
            <Dialog
                open={errorDialog.open}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{
                    bgcolor: isSuccess ? '#4caf50' : '#f44336',
                    color: 'white',
                    fontWeight: 600
                }}>
                    {isSuccess ? '✓ Success' : '⚠ Publishing Failed'}
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {errorDialog.message.replace('SUCCESS: ', '')}
                    </Typography>

                    {needsServices && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            <Typography variant="body2" fontWeight={600} gutterBottom>
                                How to fix this:
                            </Typography>
                            <Typography variant="body2">
                                1. Click "Go to Edit" below<br />
                                2. Add at least one service offering<br />
                                3. Save your changes<br />
                                4. Return here and click Publish again
                            </Typography>
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    {needsServices && (
                        <Button
                            variant="contained"
                            onClick={handleGoToEdit}
                            sx={{ mr: 1 }}
                        >
                            Go to Edit
                        </Button>
                    )}
                    <Button onClick={handleCloseDialog} variant="outlined">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container >
    );
}
