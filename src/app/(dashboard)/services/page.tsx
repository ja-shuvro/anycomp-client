'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Select,
    MenuItem,
    FormControl,
    Avatar,
    Breadcrumbs,
    Link as MuiLink,
    Skeleton,
    Chip
} from '@mui/material';
import { Home, ChevronRight, Star } from 'lucide-react';
import { useSpecialists } from '@/lib/queries/specialists';
import { Specialist } from '@/lib/types';
import Pagination from '@/components/common/Pagination';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Currency formatter for Malaysian Ringgit
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-MY', {
        style: 'currency',
        currency: 'MYR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price).replace('MYR', 'RM');
};

export default function ServicesPage() {
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState('newest');
    const [priceFilter, setPriceFilter] = useState('');
    const router = useRouter();

    // Fetch only published/verified specialists for the public marketplace
    const { data, isLoading } = useSpecialists({
        page,
        limit: 12,
        isDraft: false, // Only published specialists
        sortBy: sortBy as 'price' | 'rating' | 'newest' | 'alphabetical',
    });

    const specialists = data?.items || [];
    const pagination = data?.pagination;

    // Loading skeleton
    if (isLoading) {
        return (
            <Box>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Skeleton variant="text" width={200} height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width={350} height={40} />
                    <Skeleton variant="text" width={280} height={24} />
                </Box>

                {/* Filter skeletons */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Skeleton variant="rounded" width={100} height={40} />
                    <Skeleton variant="rounded" width={100} height={40} />
                </Box>

                {/* Card grid skeletons */}
                <Grid container spacing={3}>
                    {[...Array(8)].map((_, idx) => (
                        <Grid key={idx} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <Card sx={{ height: 360 }}>
                                <Skeleton variant="rectangular" height={200} />
                                <CardContent>
                                    <Skeleton variant="text" width="60%" height={20} />
                                    <Skeleton variant="text" width="100%" height={16} />
                                    <Skeleton variant="text" width="80%" height={16} />
                                    <Skeleton variant="text" width={80} height={24} sx={{ mt: 1 }} />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    return (
        <Box>
            {/* Breadcrumb Navigation */}
            <Breadcrumbs
                separator={<ChevronRight size={14} />}
                sx={{ mb: 2 }}
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
                    Register a New Company
                </Typography>
            </Breadcrumbs>

            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
                    Register a New Company
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Get Your Company Registered with a Trusted Specialist
                </Typography>
            </Box>

            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <FormControl size="small" sx={{ minWidth: 100 }}>
                    <Select
                        value={priceFilter}
                        onChange={(e) => setPriceFilter(e.target.value)}
                        displayEmpty
                        sx={{
                            bgcolor: 'white',
                            '& .MuiSelect-select': { py: 1, px: 1.5 },
                            borderRadius: 2
                        }}
                    >
                        <MenuItem value="">Price ▾</MenuItem>
                        <MenuItem value="low">Under RM 1,000</MenuItem>
                        <MenuItem value="mid">RM 1,000 - RM 5,000</MenuItem>
                        <MenuItem value="high">Above RM 5,000</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 100 }}>
                    <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        displayEmpty
                        sx={{
                            bgcolor: 'white',
                            '& .MuiSelect-select': { py: 1, px: 1.5 },
                            borderRadius: 2
                        }}
                    >
                        <MenuItem value="newest">Sort by ▾</MenuItem>
                        <MenuItem value="price-low">Price: Low to High</MenuItem>
                        <MenuItem value="price-high">Price: High to Low</MenuItem>
                        <MenuItem value="popular">Most Popular</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Specialist Cards Grid */}
            <Grid container spacing={3}>
                {specialists.map((specialist: Specialist) => (
                    <Grid key={specialist.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                cursor: 'pointer',
                                border: 'none',
                                boxShadow: 'none',
                                bgcolor: 'transparent',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                }
                            }}
                            onClick={() => router.push(`/services/${specialist.id}`)}
                        >
                            {/* Specialist Image */}
                            <Box
                                sx={{
                                    position: 'relative',
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    aspectRatio: '4/3',
                                    bgcolor: '#f5f5f5'
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={`https://picsum.photos/seed/${specialist.id}/400/300`}
                                    alt={specialist.title}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                                {/* Rating Badge */}
                                {specialist.averageRating && (
                                    <Chip
                                        icon={<Star size={12} fill="#FFB800" color="#FFB800" />}
                                        label={Number(specialist.averageRating).toFixed(1)}
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            bgcolor: 'rgba(255,255,255,0.95)',
                                            fontWeight: 600,
                                            fontSize: '0.75rem'
                                        }}
                                    />
                                )}
                            </Box>

                            {/* Card Content */}
                            <CardContent sx={{ px: 0, py: 1.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                {/* Verified Badge + Title */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                    {specialist.isVerified && (
                                        <Avatar
                                            sx={{
                                                width: 20,
                                                height: 20,
                                                bgcolor: '#E8F5E9',
                                                border: '1px solid #4CAF50',
                                                fontSize: '0.6rem',
                                                fontWeight: 600,
                                                color: '#4CAF50'
                                            }}
                                        >
                                            ✓
                                        </Avatar>
                                    )}
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 600,
                                            color: 'text.primary',
                                            fontSize: '0.875rem',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {specialist.title}
                                    </Typography>
                                </Box>

                                {/* Description */}
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        fontSize: '0.8rem',
                                        lineHeight: 1.4,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        mb: 1,
                                        minHeight: 36
                                    }}
                                >
                                    {specialist.description}
                                </Typography>

                                {/* Duration */}
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ mb: 0.5 }}
                                >
                                    {specialist.durationDays} day{specialist.durationDays !== 1 ? 's' : ''} delivery
                                </Typography>

                                {/* Price */}
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        mt: 'auto',
                                        fontSize: '1rem',
                                        color: 'text.primary'
                                    }}
                                >
                                    {formatPrice(specialist.finalPrice)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Empty State */}
            {specialists.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No specialists found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Check back later for new specialists
                    </Typography>
                </Box>
            )}

            {/* Pagination */}
            {pagination && specialists.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Pagination pagination={pagination} onPageChange={setPage} />
                </Box>
            )}
        </Box>
    );
}
