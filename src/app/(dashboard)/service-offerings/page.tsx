'use client';

import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton } from '@mui/material';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useServiceOfferings } from '@/lib/queries/service-offerings';

export default function ServiceOfferingsPage() {
    const { data: offerings, isLoading } = useServiceOfferings();

    if (isLoading) return <Typography>Loading...</Typography>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={700}>Service Offerings</Typography>
                <Button
                    variant="contained"
                    component={Link}
                    href="/service-offerings/create"
                    startIcon={<Plus size={18} />}
                    sx={{ bgcolor: '#0f2c59', textTransform: 'none' }}
                >
                    Create New Offering
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#FAFAFA' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Base Price</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {offerings?.map((offering) => (
                            <TableRow key={offering.id}>
                                <TableCell width="25%">
                                    <Typography variant="body2" fontWeight={500}>{offering.name}</Typography>
                                </TableCell>
                                <TableCell width="35%">
                                    <Typography variant="body2" color="text.secondary" noWrap>{offering.description}</Typography>
                                </TableCell>
                                <TableCell>RM {offering.basePrice.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={offering.isActive ? 'Active' : 'Inactive'}
                                        size="small"
                                        color={offering.isActive ? 'success' : 'default'}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton component={Link} href={`/service-offerings/${offering.id}/edit`} size="small">
                                        <Edit2 size={16} />
                                    </IconButton>
                                    <IconButton size="small" color="error">
                                        <Trash2 size={16} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!offerings || offerings.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No service offerings found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
