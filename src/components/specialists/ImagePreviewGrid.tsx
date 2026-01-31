'use client';

import { Box, IconButton, Typography, CircularProgress, Paper } from '@mui/material';
import { X } from 'lucide-react';
import { Media } from '@/lib/types';
import Image from 'next/image';

interface ImagePreviewGridProps {
    images: Media[];
    onDelete: (id: string) => void;
    isDeleting?: string; // ID of image being deleted
    baseUrl?: string;
}

export default function ImagePreviewGrid({ images, onDelete, isDeleting, baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001' }: ImagePreviewGridProps) {
    if (images.length === 0) {
        return null;
    }

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Uploaded Images ({images.length})
            </Typography>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'repeat(2, 1fr)',
                        sm: 'repeat(3, 1fr)',
                        md: 'repeat(4, 1fr)',
                    },
                    gap: 2,
                }}
            >
                {images.map((media) => (
                    <Paper
                        key={media.id}
                        elevation={0}
                        sx={{
                            position: 'relative',
                            paddingTop: '100%', // 1:1 aspect ratio
                            border: '1px solid #E0E0E0',
                            borderRadius: 2,
                            overflow: 'hidden',
                            '&:hover .delete-button': {
                                opacity: 1,
                            },
                        }}
                    >
                        {/* Image */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                            }}
                        >
                            <Image
                                src={`${baseUrl}${media.publicUrl}`}
                                alt={media.fileName}
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </Box>

                        {/* Delete Button */}
                        <IconButton
                            className="delete-button"
                            onClick={() => onDelete(media.id)}
                            disabled={isDeleting === media.id}
                            sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                bgcolor: 'rgba(0, 0, 0, 0.6)',
                                color: 'white',
                                opacity: 0,
                                transition: 'opacity 0.2s',
                                '&:hover': {
                                    bgcolor: 'error.main',
                                },
                                width: 32,
                                height: 32,
                            }}
                        >
                            {isDeleting === media.id ? (
                                <CircularProgress size={16} color="inherit" />
                            ) : (
                                <X size={18} />
                            )}
                        </IconButton>

                        {/* Display Order Badge */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 4,
                                left: 4,
                                bgcolor: 'rgba(0, 0, 0, 0.6)',
                                color: 'white',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: 12,
                                fontWeight: 600,
                            }}
                        >
                            #{media.displayOrder + 1}
                        </Box>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
}

