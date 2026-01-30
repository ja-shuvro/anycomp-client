'use client';

import { use, useState } from 'react';
import { Box, Typography, Button, Container, Divider, Grid } from '@mui/material';
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

    const handlePublish = () => {
        publishSpecialist(id, {
            onSuccess: () => {
                // Optionally show a success toast
                console.log('Specialist published successfully');
            },
            onError: (error) => {
                console.error('Failed to publish specialist:', error);
                // Optionally show an error toast
            }
        });
    };

    if (isLoading) return <Typography>Loading...</Typography>;
    if (!specialist) return <Typography>Specialist not found</Typography>;

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
                        {specialist.serviceOfferings && specialist.serviceOfferings.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                {specialist.serviceOfferings.map((offering, index) => (
                                    <Typography key={index} variant="body2">
                                        • {offering.serviceOfferingsMasterList.name}
                                    </Typography>
                                ))}
                            </Box>
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
        </Container >
    );
}
