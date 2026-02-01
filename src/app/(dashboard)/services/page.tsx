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
    InputLabel,
    Avatar
} from '@mui/material';
import { useServiceOfferings } from '@/lib/queries/service-offerings';
import { ServiceOffering } from '@/lib/types';
import Pagination from '@/components/common/Pagination';
import { useRouter } from 'next/navigation';

export default function ServicesPage() {
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState('newest');
    const router = useRouter();

    const { data, isLoading } = useServiceOfferings(page, 12);

    const services = data?.items || [];
    const pagination = data?.pagination;

    if (isLoading) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography>Loading services...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Register a New Company
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Get Your Company Registered with a Trusted Specialist
                </Typography>
            </Box>

            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Price</InputLabel>
                    <Select label="Price" defaultValue="">
                        <MenuItem value="">All Prices</MenuItem>
                        <MenuItem value="low">Under RM 1,000</MenuItem>
                        <MenuItem value="mid">RM 1,000 - RM 5,000</MenuItem>
                        <MenuItem value="high">Above RM 5,000</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Sort by</InputLabel>
                    <Select
                        label="Sort by"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <MenuItem value="newest">Newest</MenuItem>
                        <MenuItem value="price-low">Price: Low to High</MenuItem>
                        <MenuItem value="price-high">Price: High to Low</MenuItem>
                        <MenuItem value="popular">Most Popular</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Service Cards Grid */}
            <Grid container spacing={3}>
                {services.map((service: ServiceOffering) => (
                    <Grid key={service.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4
                                }
                            }}
                            onClick={() => router.push(`/services/${service.id}`)}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={service.s3Key || 'https://via.placeholder.com/400x200?text=Service'}
                                alt={service.title}
                                sx={{ objectFit: 'cover', bgcolor: '#f0f0f0' }}
                            />
                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {/* Provider Info */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Avatar
                                        sx={{
                                            width: 24,
                                            height: 24,
                                            bgcolor: '#E3F2FD',
                                            color: '#1976D2',
                                            fontSize: '0.75rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        {service.title.charAt(0)}
                                    </Avatar>
                                    <Typography variant="caption" color="text.secondary">
                                        Company Secretary
                                    </Typography>
                                </Box>

                                {/* Service Title */}
                                <Typography variant="h6" fontWeight={600} sx={{ fontSize: '1rem', lineHeight: 1.3 }}>
                                    {service.title}
                                </Typography>

                                {/* Description */}
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        mb: 1,
                                        minHeight: 40
                                    }}
                                >
                                    {service.description}
                                </Typography>

                                {/* Price */}
                                <Typography variant="h6" fontWeight={700} color="primary" sx={{ mt: 'auto' }}>
                                    RM 1,600
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Empty State */}
            {services.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No services found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Check back later for new service offerings
                    </Typography>
                </Box>
            )}

            {/* Pagination */}
            {pagination && services.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Pagination pagination={pagination} onPageChange={setPage} />
                </Box>
            )}
        </Box>
    );
}
