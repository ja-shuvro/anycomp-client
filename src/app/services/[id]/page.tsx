'use client';

import { use } from 'react';
import {
    Box,
    Typography,
    Button,
    Container,
    Divider,
    Grid,
    Chip,
    Breadcrumbs,
    Link as MuiLink,
    Skeleton
} from '@mui/material';
import { Home, ChevronRight, Star, Clock, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOneSpecialist } from '@/lib/queries/specialists';
import ServiceGallery from '@/components/specialists/ServiceGallery';
import PricingCard from '@/components/specialists/PricingCard';
import ServiceProviderProfile from '@/components/specialists/ServiceProviderProfile';

// Currency formatter for Malaysian Ringgit
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-MY', {
        style: 'currency',
        currency: 'MYR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price).replace('MYR', 'RM');
};

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { data: specialist, isLoading } = useOneSpecialist(id);

    // Loading state
    if (isLoading) {
        return (
            <Container maxWidth="xl" sx={{ pt: 8, pb: 6, px: { xs: 2, md: 4 } }}>
                <Skeleton variant="text" width={300} height={20} sx={{ mb: 3 }} />
                <Skeleton variant="text" width={400} height={48} sx={{ mb: 6 }} />
                <Grid container spacing={6}>
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
                    </Grid>
                </Grid>
            </Container>
        );
    }

    // Not found state
    if (!specialist) {
        return (
            <Container maxWidth="xl" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                    Service not found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    The service you&apos;re looking for doesn&apos;t exist or has been removed.
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => router.push('/services')}
                    sx={{ textTransform: 'none' }}
                >
                    Browse Services
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ pt: 8, pb: 6, px: { xs: 2, md: 4 } }}>
            {/* Breadcrumb Navigation */}
            <Breadcrumbs
                separator={<ChevronRight size={14} />}
                sx={{ mb: 3 }}
            >
                <MuiLink
                    component={Link}
                    href="/"
                    color="text.secondary"
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.875rem' }}
                >
                    <Home size={14} />
                </MuiLink>
                <MuiLink
                    component={Link}
                    href="/services"
                    color="text.secondary"
                    underline="hover"
                    sx={{ fontSize: '0.875rem' }}
                >
                    Specialists
                </MuiLink>
                <Typography color="text.primary" sx={{ fontSize: '0.875rem' }}>
                    {specialist.title}
                </Typography>
            </Breadcrumbs>

            <Grid container spacing={6}>
                {/* Left Column - Gallery and Details */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Box sx={{ mb: 6 }}>
                        {/* Title and Status */}
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 1.5 }}>
                            <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
                                {specialist.title}
                            </Typography>
                            {specialist.isVerified && (
                                <Chip
                                    icon={<CheckCircle size={14} />}
                                    label="Verified"
                                    size="small"
                                    sx={{
                                        bgcolor: '#E8F5E9',
                                        color: '#2E7D32',
                                        fontWeight: 600,
                                        '& .MuiChip-icon': { color: '#2E7D32' }
                                    }}
                                />
                            )}
                        </Box>

                        {/* Rating and Duration */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            {specialist.averageRating && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Star size={16} fill="#FFB800" color="#FFB800" />
                                    <Typography variant="body2" fontWeight={600}>
                                        {Number(specialist.averageRating).toFixed(1)}
                                    </Typography>
                                    {specialist.totalNumberOfRatings && (
                                        <Typography variant="body2" color="text.secondary">
                                            ({specialist.totalNumberOfRatings} reviews)
                                        </Typography>
                                    )}
                                </Box>
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Clock size={16} color="#666" />
                                <Typography variant="body2" color="text.secondary">
                                    {specialist.durationDays} day{specialist.durationDays !== 1 ? 's' : ''} delivery
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Service Gallery */}
                    <ServiceGallery specialistId={id} />

                    {/* Description */}
                    <Box sx={{ my: 4 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            About this service
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
                            {specialist.description || "No description provided."}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 4 }} />

                    {/* Service Offerings */}
                    <Box sx={{ my: 4 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            What&apos;s Included
                        </Typography>
                        {specialist.serviceOfferings && specialist.serviceOfferings.length > 0 ? (
                            <Box sx={{ mt: 2 }}>
                                {specialist.serviceOfferings.map((offering, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5,
                                            py: 1
                                        }}
                                    >
                                        <CheckCircle size={18} color="#4CAF50" />
                                        <Typography variant="body1">
                                            {offering.serviceOfferingsMasterList.title}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                Contact the specialist for more details about what&apos;s included.
                            </Typography>
                        )}
                    </Box>

                    <Divider sx={{ my: 4 }} />

                    {/* Service Provider Profile */}
                    <ServiceProviderProfile />
                </Grid>

                {/* Right Column - Pricing Card */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Box sx={{ position: 'sticky', top: 24 }}>
                        <PricingCard
                            basePrice={specialist.basePrice}
                            platformFee={specialist.platformFee}
                            finalPrice={specialist.finalPrice}
                            currency="MYR"
                        />

                        {/* Order Button */}
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{
                                mt: 2,
                                py: 1.5,
                                bgcolor: '#0f2c59',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                                borderRadius: 2,
                                '&:hover': {
                                    bgcolor: '#1a3d6e'
                                }
                            }}
                        >
                            Continue ({formatPrice(specialist.finalPrice)})
                        </Button>

                        {/* Contact Button */}
                        <Button
                            variant="outlined"
                            fullWidth
                            size="large"
                            sx={{
                                mt: 1.5,
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                                borderRadius: 2,
                                borderColor: '#0f2c59',
                                color: '#0f2c59',
                                '&:hover': {
                                    borderColor: '#1a3d6e',
                                    bgcolor: 'rgba(15, 44, 89, 0.04)'
                                }
                            }}
                        >
                            Contact Specialist
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}
