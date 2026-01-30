'use client';

import { Suspense, useState, useEffect } from 'react'; // Boundary
import { Box, Typography, Button, Tabs, Tab, TextField, InputAdornment } from '@mui/material';
import { Plus, Download, Search } from 'lucide-react';
import Link from 'next/link';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFilters, setSearchQuery } from '@/store/slices/specialistsSlice';
import { useSpecialists } from '@/lib/queries/specialists';
import SpecialistTable from '@/components/specialists/SpecialistTable';

export default function SpecialistsPage() {
    const dispatch = useAppDispatch();
    const [page, setPage] = useState(1);
    const filters = useAppSelector((state) => state.specialists);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [filters.search, filters.isDraft]);

    const { data, isLoading } = useSpecialists({ ...filters, page, limit: 10 });
    const specialists = data?.items || [];
    const pagination = data?.pagination;

    const handleTabChange = (event: React.SyntheticEvent, newValue: 'all' | 'drafts' | 'published') => {
        if (newValue === 'all') {
            dispatch(setFilters({ isDraft: undefined }));
        } else if (newValue === 'drafts') {
            dispatch(setFilters({ isDraft: true }));
        } else {
            dispatch(setFilters({ isDraft: false }));
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Create and publish your services for Client's & Companies
                </Typography>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs
                        value={filters.isDraft === undefined ? 'all' : filters.isDraft ? 'drafts' : 'published'}
                        onChange={handleTabChange}
                        aria-label="specialist tabs"
                        sx={{
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: 15,
                                minWidth: 80,
                            }
                        }}
                    >
                        <Tab label="All" value="all" />
                        <Tab label="Drafts" value="drafts" />
                        <Tab label="Published" value="published" />
                    </Tabs>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <TextField
                        placeholder="Search Services"
                        size="small"
                        variant="outlined"
                        value={filters.search || ''}
                        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                        sx={{
                            width: 300,
                            bgcolor: '#F5F5F5',
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            '& .MuiOutlinedInput-root': { borderRadius: 2 }
                        }}
                    />

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            component={Link}
                            href="/specialists/create"
                            startIcon={<Plus size={18} />}
                            sx={{
                                textTransform: 'none',
                                bgcolor: '#0f2c59',
                                borderRadius: 2,
                                boxShadow: 'none',
                                '&:hover': { bgcolor: '#0a1e3f' }
                            }}
                        >
                            Create
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Download size={18} />}
                            sx={{
                                textTransform: 'none',
                                bgcolor: '#0f2c59', // Dark color from image
                                borderRadius: 2,
                                boxShadow: 'none',
                                '&:hover': { bgcolor: '#000000' }
                            }}
                        >
                            Export
                        </Button>
                    </Box>
                </Box>

                <SpecialistTable
                    data={specialists}
                    isLoading={isLoading}
                    pagination={pagination}
                    onPageChange={setPage}
                />
            </Box>
        </Box>
    );
}
