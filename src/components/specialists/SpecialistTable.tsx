'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Box,
    Typography,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Specialist, VerificationStatus, PaginationMeta } from '@/lib/types';
import Pagination from '@/components/common/Pagination';
import { useRouter } from 'next/navigation';
import { useDeleteSpecialist } from '@/lib/queries/specialists';

interface SpecialistTableProps {
    data: Specialist[];
    isLoading: boolean;
    pagination?: PaginationMeta;
    onPageChange?: (page: number) => void;
    onEdit: (specialist: Specialist) => void;
}

const VerificationStatusChip = ({ status }: { status: VerificationStatus }) => {
    let bgcolor = '#E8F5E9'; // Green default
    let color = '#2E7D32';
    let label = 'Verified';

    if (status === 'pending') {
        bgcolor = '#E0F7FA'; // Cyan light
        color = '#006064';
        label = 'Pending';
    } else if (status === 'rejected') {
        bgcolor = '#FFEBEE'; // Red light
        color = '#C62828';
        label = 'Rejected';
    }

    return (
        <Chip
            label={label}
            size="small"
            sx={{
                bgcolor,
                color,
                fontWeight: 600,
                fontSize: '0.75rem',
                borderRadius: '4px',
                height: 24,
            }}
        />
    );
};

const DraftStatusChip = ({ isDraft }: { isDraft: boolean }) => {
    return (
        <Chip
            label={isDraft ? 'Draft' : 'Published'}
            size="small"
            sx={{
                bgcolor: isDraft ? '#D50000' : '#00C853',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.75rem',
                borderRadius: '4px',
                height: 24,
            }}
        />
    );
};

export default function SpecialistTable({ data, isLoading, pagination, onPageChange, onEdit }: SpecialistTableProps) {
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
    const { mutate: deleteSpecialist } = useDeleteSpecialist();

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, specialist: Specialist) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedSpecialist(specialist);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedSpecialist(null);
    };

    const handleEdit = () => {
        if (selectedSpecialist) {
            onEdit(selectedSpecialist);
        }
        handleMenuClose();
    };

    const handleDelete = () => {
        if (selectedSpecialist && confirm('Are you sure you want to delete this specialist?')) {
            deleteSpecialist(selectedSpecialist.id, {
                onSuccess: () => {
                    // Optionally show success toast
                },
                onError: (error) => {
                    console.error('Failed to delete specialist:', error);
                    // Optionally show error toast
                }
            });
        }
        handleMenuClose();
    };

    if (isLoading) {
        return <Box sx={{ p: 4, textAlign: 'center' }}>Loading...</Box>;
    }

    return (
        <Box>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="specialist table">
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#FAFAFA' }}>
                            <TableCell sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>SERVICE</TableCell>
                            <TableCell sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>PRICE</TableCell>
                            <TableCell sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>RATING</TableCell>
                            <TableCell sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>DURATION</TableCell>
                            <TableCell sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>VERIFICATION STATUS</TableCell>
                            <TableCell sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>STATUS</TableCell>
                            <TableCell sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>ACTION</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow
                                key={row.id}
                                hover
                                onClick={() => router.push(`/specialists/${row.id}`)}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: '#F5F5F5' }
                                }}
                            >
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body2" fontWeight={500}>
                                            {row.title}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600}>
                                        RM {row.finalPrice ? row.finalPrice.toLocaleString() : row.basePrice.toLocaleString()}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        ⭐ {row.averageRating ? Number(row.averageRating).toFixed(1) : '0.0'} ({row.totalNumberOfRatings || 0})
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{row.durationDays} days</Typography>
                                </TableCell>
                                <TableCell>
                                    <VerificationStatusChip status={row.verificationStatus} />
                                </TableCell>
                                <TableCell>
                                    <DraftStatusChip isDraft={row.isDraft} />
                                </TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleMenuOpen(e, row)}
                                    >
                                        <MoreVertical size={16} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
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

            {onPageChange && pagination && (
                <Pagination
                    pagination={pagination}
                    onPageChange={onPageChange}
                />
            )}
        </Box>
    );
}
