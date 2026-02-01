'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { Plus, Edit, Trash2, MoreVertical } from 'lucide-react';
import { usePlatformFees, useDeletePlatformFee } from '@/lib/queries/platform-fees';
import { PlatformFee } from '@/lib/types';
import Pagination from '@/components/common/Pagination';
import PlatformFeeDrawer from '@/components/admin/PlatformFeeDrawer';

export default function PlatformFeesPage() {
    const [page, setPage] = useState(1);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedFee, setSelectedFee] = useState<PlatformFee | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingFee, setEditingFee] = useState<PlatformFee | null>(null);

    const { data, isLoading } = usePlatformFees(page);
    const { mutate: deleteFee } = useDeletePlatformFee();

    const fees = data?.items || [];
    const pagination = data?.pagination;

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, fee: PlatformFee) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedFee(fee);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedFee(null);
    };

    const handleEdit = () => {
        if (selectedFee) {
            setEditingFee(selectedFee);
            setDrawerOpen(true);
        }
        handleMenuClose();
    };

    const handleDelete = () => {
        if (selectedFee && confirm('Are you sure you want to delete this platform fee tier?')) {
            deleteFee(selectedFee.id);
        }
        handleMenuClose();
    };

    const handleCreateNew = () => {
        setEditingFee(null);
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setEditingFee(null);
    };

    if (isLoading) return <Typography>Loading...</Typography>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={700}>Platform Fees</Typography>
                <Button
                    variant="contained"
                    onClick={handleCreateNew}
                    startIcon={<Plus size={18} />}
                    sx={{ bgcolor: '#0f2c59', textTransform: 'none' }}
                >
                    Create New Fee
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#FAFAFA' }}>
                            <TableCell sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>TIER NAME</TableCell>
                            <TableCell sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>PRICE RANGE</TableCell>
                            <TableCell sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>FEE PERCENTAGE</TableCell>
                            <TableCell sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>ACTION</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fees?.map((fee: PlatformFee) => (
                            <TableRow
                                key={fee.id}
                                hover
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: '#F5F5F5' }
                                }}
                            >
                                <TableCell>
                                    <Chip
                                        label={fee.tierName.toUpperCase()}
                                        size="small"
                                        sx={{
                                            bgcolor: '#E3F2FD',
                                            color: '#1976D2',
                                            fontWeight: 600,
                                            fontSize: '0.75rem'
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={500}>
                                        RM {fee.minValue?.toLocaleString() || '0'} - RM {fee.maxValue?.toLocaleString() || '0'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600}>
                                        {fee.platformFeePercentage}%
                                    </Typography>
                                </TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleMenuOpen(e, fee)}
                                    >
                                        <MoreVertical size={16} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!fees || fees.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No platform fees found.</TableCell>
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

            {/* Platform Fee Drawer */}
            <PlatformFeeDrawer
                open={drawerOpen}
                onClose={handleDrawerClose}
                platformFee={editingFee}
            />

            {pagination && (
                <Pagination pagination={pagination} onPageChange={setPage} />
            )}
        </Box>
    );
}
