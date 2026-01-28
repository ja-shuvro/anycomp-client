'use client';

import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton } from '@mui/material';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { usePlatformFees } from '@/lib/queries/platform-fees';

export default function PlatformFeesPage() {
    const { data: fees, isLoading } = usePlatformFees();

    if (isLoading) return <Typography>Loading...</Typography>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={700}>Platform Fees</Typography>
                <Button
                    variant="contained"
                    component={Link}
                    href="/platform-fees/create"
                    startIcon={<Plus size={18} />}
                    sx={{ bgcolor: '#0f2c59', textTransform: 'none' }}
                >
                    Create New Fee
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#FAFAFA' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Tier Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Percentage</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Fixed Amount</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fees?.map((fee) => (
                            <TableRow key={fee.id}>
                                <TableCell>{fee.tierName}</TableCell>
                                <TableCell>{fee.percentage}%</TableCell>
                                <TableCell>RM {fee.fixedAmount}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={fee.isActive ? 'Active' : 'Inactive'}
                                        size="small"
                                        color={fee.isActive ? 'success' : 'default'}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton component={Link} href={`/platform-fees/${fee.id}/edit`} size="small">
                                        <Edit2 size={16} />
                                    </IconButton>
                                    <IconButton size="small" color="error">
                                        <Trash2 size={16} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!fees || fees.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No platform fees found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
