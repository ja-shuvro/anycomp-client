'use client';

import React from 'react';
import { Drawer, Box, Typography, IconButton } from '@mui/material';
import { X } from 'lucide-react';
import SpecialistForm from './SpecialistForm';
import { useCreateSpecialist, useUpdateSpecialist } from '@/lib/queries/specialists';
import { useUploadMedia } from '@/lib/queries/media';
import { Specialist } from '@/lib/types';
import { useQueryClient } from '@tanstack/react-query';

interface SpecialistDrawerProps {
    open: boolean;
    onClose: () => void;
    specialist?: Specialist | null; // If provided, we are in edit mode
}

export default function SpecialistDrawer({ open, onClose, specialist }: SpecialistDrawerProps) {
    const isEdit = !!specialist;
    const queryClient = useQueryClient();
    const [isUploading, setIsUploading] = React.useState(false);
    const { mutateAsync: createSpecialist, isPending: isCreating } = useCreateSpecialist();
    const { mutateAsync: updateSpecialist, isPending: isUpdating } = useUpdateSpecialist();
    const { mutateAsync: uploadMedia } = useUploadMedia();

    const handleSubmit = async (data: any, files: File[]) => {
        try {
            let specialistId: string;

            // Step 1: Create or update the specialist first
            if (isEdit && specialist?.id) {
                // Update existing specialist
                await updateSpecialist({ id: specialist.id, data });
                specialistId = specialist.id;
            } else {
                // Create new specialist
                const newSpecialist = await createSpecialist(data);
                specialistId = newSpecialist.id;
            }

            // Step 2: Upload images if any files were selected
            if (files.length > 0) {
                setIsUploading(true);
                try {
                    // Upload all files sequentially
                    await Promise.all(
                        files.map((file, index) =>
                            uploadMedia({
                                specialistId,
                                file,
                                displayOrder: index,
                            })
                        )
                    );
                } catch (uploadError) {
                    console.error('Failed to upload some images:', uploadError);
                    // Note: Specialist is already created, just images failed
                    alert('Specialist saved, but some images failed to upload. Please try adding them again.');
                } finally {
                    setIsUploading(false);
                }
            }

            // Step 3: Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['specialists'] });
            queryClient.invalidateQueries({ queryKey: ['specialist', specialistId] });
            queryClient.invalidateQueries({ queryKey: ['specialist-media', specialistId] });

            onClose();
        } catch (error) {
            console.error('Failed to save specialist:', error);
            alert('Failed to save specialist. Please try again.');
        }
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: { xs: '100%', sm: 600 }, p: 0 }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, borderBottom: '1px solid #eee', bgcolor: 'background.paper', zIndex: 1 }}>
                <Typography variant="h6" fontWeight={600}>
                    {isEdit ? 'Edit Specialist' : 'New Specialist'}
                </Typography>
                <IconButton onClick={onClose}>
                    <X size={24} />
                </IconButton>
            </Box>

            <Box sx={{ p: 3 }}>
                <SpecialistForm
                    initialData={specialist ? {
                        title: specialist.title,
                        description: specialist.description,
                        basePrice: specialist.basePrice,
                        durationDays: specialist.durationDays,
                        slug: specialist.slug,
                    } : undefined}
                    isEdit={isEdit}
                    specialistId={specialist?.id}
                    isLoading={isCreating || isUpdating || isUploading}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                />
            </Box>
        </Drawer>
    );
}
