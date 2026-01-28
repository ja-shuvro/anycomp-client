'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Chip,
    IconButton,
    Box,
    Typography,
} from '@mui/material';
import { MoreVertical } from 'lucide-react';
import { Specialist, PurchaseStatus, PublishStatus, PaginationMeta } from '@/lib/types';
import Pagination from '@/components/common/Pagination';

interface SpecialistTableProps {
    data: Specialist[];
    isLoading: boolean;
    pagination?: PaginationMeta;
    onPageChange?: (page: number) => void;
}

const ApprovalStatusChip = ({ status }: { status: PurchaseStatus }) => {
    let bgcolor = '#E8F5E9'; // Green default
    let color = '#2E7D32';

    if (status === 'Under Review') {
        bgcolor = '#E0F7FA'; // Cyan light
        color = '#006064';
    } else if (status === 'Rejected') {
        bgcolor = '#FFEBEE'; // Red light
        color = '#C62828';
    }

    return (
        <Chip
            label={status}
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

const PublishStatusChip = ({ status }: { status: PublishStatus }) => {
    const isPublished = status === 'Published';
    return (
        <Chip
            label={isPublished ? 'Published' : 'Not Published'}
            size="small"
            sx={{
                bgcolor: isPublished ? '#00C853' : '#D50000',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.75rem',
                borderRadius: '4px',
                height: 24,
            }}
        />
    );
};

export default function SpecialistTable({ data, isLoading, pagination, onPageChange }: SpecialistTableProps) {
    if (isLoading) {
        return <Box sx={{ p: 4, textAlign: 'center' }}>Loading...</Box>;
    }

    return (
        <Box>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="specialist table">
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#FAFAFA' }}>
                            <TableCell padding="checkbox">
                                <Checkbox size="small" />
                            </TableCell>
                            <TableCell sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>SERVICE</TableCell>
                            <TableCell sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>PRICE</TableCell>
                            <TableCell sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>PURCHASES</TableCell>
                            <TableCell sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>DURATION</TableCell>
                            <TableCell sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>APPROVAL STATUS</TableCell>
                            <TableCell sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>PUBLISH STATUS</TableCell>
                            <TableCell sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>ACTION</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#F5F5F5' } }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox size="small" />
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {/* Placeholder Icon Square */}
                                        <Box sx={{ width: 24, height: 24, bgcolor: '#0f2c59', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Typography variant="caption" sx={{ color: 'white', fontSize: 10 }}>S</Typography>
                                        </Box>
                                        <Typography variant="body2" fontWeight={500}>
                                            {row.title}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600}>
                                        {row.currency} {row.price ? row.price.toLocaleString() : '0.00'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{row.purchases}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{row.duration}</Typography>
                                </TableCell>
                                <TableCell>
                                    <ApprovalStatusChip status={row.approvalStatus} />
                                </TableCell>
                                <TableCell>
                                    <PublishStatusChip status={row.publishStatus} />
                                </TableCell>
                                <TableCell>
                                    <IconButton size="small">
                                        <MoreVertical size={16} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {onPageChange && pagination && (
                <Pagination
                    pagination={pagination}
                    onPageChange={onPageChange}
                />
            )}
        </Box>
    );
}
