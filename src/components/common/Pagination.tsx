import { Box, Typography } from '@mui/material';
import { Button as MuiButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '@/lib/types';

interface PaginationProps {
    pagination?: PaginationMeta;
    onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, onPageChange }: PaginationProps) {
    const { currentPage = 1, totalPages = 1 } = pagination || {};

    if (totalPages <= 1) return null;

    // Helper to generate page numbers
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3, gap: 1 }}>
            <MuiButton
                startIcon={<ChevronLeft />}
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 600 }}
            >
                Previous
            </MuiButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mx: 2 }}>
                {getPageNumbers().map((pageNum, index) => (
                    pageNum === '...' ? (
                        <Typography key={`ellipsis-${index}`} color="text.secondary">...</Typography>
                    ) : (
                        <Box
                            key={`page-${pageNum}`}
                            onClick={() => onPageChange(pageNum as number)}
                            sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                bgcolor: currentPage === pageNum ? '#0f2c59' : 'transparent',
                                color: currentPage === pageNum ? '#ffffff' : 'text.primary',
                                fontWeight: currentPage === pageNum ? 700 : 400,
                                '&:hover': {
                                    bgcolor: currentPage === pageNum ? '#0f2c59' : '#f5f5f5'
                                }
                            }}
                        >
                            {pageNum}
                        </Box>
                    )
                ))}
            </Box>

            <MuiButton
                endIcon={<ChevronRight />}
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 600 }}
            >
                Next
            </MuiButton>
        </Box>
    );
}
