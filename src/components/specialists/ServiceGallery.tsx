'use client';

import { Box, Typography, CircularProgress } from '@mui/material';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { useSpecialistMedia } from '@/lib/queries/media';
import Image from 'next/image';

interface ServiceGalleryProps {
    specialistId: string;
}

export default function ServiceGallery({ specialistId }: ServiceGalleryProps) {
    const { data: media, isLoading } = useSpecialistMedia(specialistId);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400, mb: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    // Sort media by display order
    const sortedMedia = media?.sort((a, b) => a.displayOrder - b.displayOrder) || [];
    const mainImage = sortedMedia[0];
    const sideImages = sortedMedia.slice(1, 3); // Get next 2 images

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 2, height: 400, mb: 4 }}>
            {/* Main Image */}
            <Box sx={{
                bgcolor: '#F5F5F5',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {mainImage && mainImage.publicUrl ? (
                    <Image
                        src={mainImage.publicUrl}
                        alt={mainImage.fileName || 'Service image'}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 60vw"
                    />
                ) : (
                    <>
                        <Camera size={48} color="#9E9E9E" />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, maxWidth: 200, textAlign: 'center' }}>
                            No images uploaded yet. Upload images in the Edit page.
                        </Typography>
                    </>
                )}
            </Box>

            {/* Side Images */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Second Image */}
                <Box sx={{
                    flex: 1,
                    borderRadius: 2,
                    overflow: 'hidden',
                    bgcolor: '#F5F5F5',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {sideImages[0] && sideImages[0].publicUrl ? (
                        <Image
                            src={sideImages[0].publicUrl}
                            alt={sideImages[0].fileName || 'Side image 1'}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 50vw, 30vw"
                        />
                    ) : (
                        <ImageIcon size={32} color="#9E9E9E" />
                    )}
                </Box>

                {/* Third Image */}
                <Box sx={{
                    flex: 1,
                    borderRadius: 2,
                    overflow: 'hidden',
                    bgcolor: '#F5F5F5',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {sideImages[1] && sideImages[1].publicUrl ? (
                        <Image
                            src={sideImages[1].publicUrl}
                            alt={sideImages[1].fileName || 'Side image 2'}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 50vw, 30vw"
                        />
                    ) : (
                        <ImageIcon size={32} color="#9E9E9E" />
                    )}
                </Box>
            </Box>
        </Box>
    );
}
