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
    const [uploadingFiles, setUploadingFiles] = React.useState<Set<string>>(new Set());
    const [failedFiles, setFailedFiles] = React.useState<Set<string>>(new Set());
    const [draftSpecialistId, setDraftSpecialistId] = React.useState<string | null>(null);
    const { mutateAsync: createSpecialist, isPending: isCreating } = useCreateSpecialist();
    const { mutateAsync: updateSpecialist, isPending: isUpdating } = useUpdateSpecialist();
    const { mutateAsync: uploadMedia } = useUploadMedia();

    // Create draft specialist when drawer opens in create mode
    React.useEffect(() => {
        const createDraft = async () => {
            if (open && !isEdit && !draftSpecialistId) {
                try {
                    // Create a draft specialist with minimal data
                    const draft = await createSpecialist({
                        title: 'Draft Specialist',
                        description: 'This is a draft specialist. Please update the details.',
                        basePrice: 0,
                        durationDays: 1,
                        isDraft: true,
                    });
                    setDraftSpecialistId(draft.id);
                } catch (error) {
                    console.error('Failed to create draft specialist:', error);
                }
            }
        };
        createDraft();
    }, [open, isEdit, draftSpecialistId, createSpecialist]);

    // Reset draft ID when drawer closes
    React.useEffect(() => {
        if (!open) {
            setDraftSpecialistId(null);
            setUploadingFiles(new Set());
            setFailedFiles(new Set());
        }
    }, [open]);

    // Handle immediate upload for selected files
    const handleFilesSelected = async (files: File[]) => {
        const targetSpecialistId = isEdit ? specialist?.id : draftSpecialistId;

        if (!targetSpecialistId) {
            console.error('No specialist ID available for upload');
            return;
        }

        setIsUploading(true);

        // Track each file being uploaded and remove from failed if retrying
        const newUploadingFiles = new Set(uploadingFiles);
        files.forEach(file => {
            newUploadingFiles.add(file.name);
            // Remove from failed if retrying
            setFailedFiles(prev => {
                const updated = new Set(prev);
                updated.delete(file.name);
                return updated;
            });
        });
        setUploadingFiles(newUploadingFiles);

        try {
            const existingMediaCount = 0; // You can get this from the form or query

            // Upload files and track individual failures
            await Promise.allSettled(
                files.map((file, index) =>
                    uploadMedia({
                        specialistId: targetSpecialistId,
                        file,
                        displayOrder: existingMediaCount + index,
                    }).then(() => {
                        // Remove file from uploading set when done
                        setUploadingFiles(prev => {
                            const updated = new Set(prev);
                            updated.delete(file.name);
                            return updated;
                        });
                    }).catch((error) => {
                        console.error(`Failed to upload ${file.name}:`, error);
                        // Add to failed files
                        setFailedFiles(prev => new Set(prev).add(file.name));
                        // Remove from uploading
                        setUploadingFiles(prev => {
                            const updated = new Set(prev);
                            updated.delete(file.name);
                            return updated;
                        });
                        throw error;
                    })
                )
            );

            // Refresh the media query to show newly uploaded images
            queryClient.invalidateQueries({ queryKey: ['specialist-media', targetSpecialistId] });
        } catch (error) {
            console.error('Some uploads failed:', error);
        } finally {
            setIsUploading(false);
        }
    };

    // Handle retry for a specific file
    const handleRetry = async (file: File) => {
        await handleFilesSelected([file]);
    };

    const handleSubmit = async (data: any, files: File[]) => {
        try {
            const targetId = isEdit ? specialist?.id : draftSpecialistId;

            if (!targetId) {
                console.error('No specialist ID available');
                return;
            }

            // Update the specialist (whether it's existing or the draft we created)
            await updateSpecialist({ id: targetId, data: { ...data, isDraft: false } });

            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['specialists'] });
            queryClient.invalidateQueries({ queryKey: ['specialist-media', targetId] });

            onClose();
        } catch (error) {
            console.error('Failed to save specialist:', error);
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
                    specialistId={specialist?.id || draftSpecialistId || undefined}
                    isLoading={isCreating || isUpdating || isUploading}
                    isUploading={isUploading}
                    uploadingFiles={uploadingFiles}
                    failedFiles={failedFiles}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                    onFilesSelected={handleFilesSelected}
                    onRetry={handleRetry}
                />
            </Box>
        </Drawer>
    );
}
