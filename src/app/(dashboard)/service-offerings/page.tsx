'use client';

import { useState } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Plus, Edit, Trash2, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { useServiceOfferings } from '@/lib/queries/service-offerings';
import { ServiceOffering } from '@/lib/types';
import Pagination from '@/components/common/Pagination';
import { useRouter } from 'next/navigation';

export default function ServiceOfferingsPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedOffering, setSelectedOffering] = useState<string | null>(null);
    const { data, isLoading } = useServiceOfferings(page);

    const offerings = data?.items || [];
    const pagination = data?.pagination;

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, offeringId: string) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedOffering(offeringId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedOffering(null);
    };

    const handleEdit = () => {
        if (selectedOffering) {
            router.push(`/service-offerings/${selectedOffering}/edit`);
        }
        handleMenuClose();
    };

    const handleDelete = () => {
        if (selectedOffering && confirm('Are you sure you want to delete this service offering?')) {
            // TODO: Implement delete mutation
            console.log('Delete offering:', selectedOffering);
        }
        handleMenuClose();
    };

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
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#FAFAFA' }}>
                            <TableCell sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>TITLE</TableCell>
                            <TableCell sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>SPECIALISTS</TableCell>
                            <TableCell sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>CREATED</TableCell>
                            <TableCell sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>ACTION</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {offerings?.map((offering: ServiceOffering) => (
                            <TableRow
                                key={offering.id}
                                hover
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: '#F5F5F5' }
                                }}
                            >
                                <TableCell width="30%">
                                    <Typography variant="body2" fontWeight={500}>{offering.title}</Typography>
                                </TableCell>
                                <TableCell width="35%">
                                    {offering.serviceOfferings && offering.serviceOfferings.length > 0 ? (
                                        <Box>
                                            {offering.serviceOfferings.map((so, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={so.specialist?.title || 'Unknown'}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ mr: 0.5, mb: 0.5 }}
                                                />
                                            ))}
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">No specialists</Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(offering.createdAt).toLocaleDateString()}
                                    </Typography>
                                </TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleMenuOpen(e, offering.id)}
                                    >
                                        <MoreVertical size={16} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!offerings || offerings.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No service offerings found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                        <Edit size={16} />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                        <Trash2 size={16} color="red" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>

            {pagination && (
                <Pagination pagination={pagination} onPageChange={setPage} />
            )}
        </Box>
    );
}
