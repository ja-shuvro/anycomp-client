'use client';

import React from 'react';
import { Drawer, Box, Typography, IconButton } from '@mui/material';
import { X } from 'lucide-react';
import ServiceOfferingForm from '../admin/ServiceOfferingForm';
import { useCreateServiceOffering, useUpdateServiceOffering } from '@/lib/queries/service-offerings';
import { ServiceOffering } from '@/lib/types';
import { useQueryClient } from '@tanstack/react-query';

interface ServiceOfferingDrawerProps {
    open: boolean;
    onClose: () => void;
    offering?: ServiceOffering | null; // If provided, we are in edit mode
}

export default function ServiceOfferingDrawer({ open, onClose, offering }: ServiceOfferingDrawerProps) {
    const isEdit = !!offering;
    const queryClient = useQueryClient();
    const { mutateAsync: createOffering, isPending: isCreating } = useCreateServiceOffering();
    const { mutateAsync: updateOffering, isPending: isUpdating } = useUpdateServiceOffering();

    const handleSubmit = async (formData: any) => {
        try {
            const data = {
                ...formData,
                specialistId: formData.specialistIds?.[0] || formData.specialistId,
            };
            delete data.specialistIds;

            if (isEdit && offering?.id) {
                // Update existing offering
                await updateOffering({ id: offering.id, data });
            } else {
                // Create new offering
                await createOffering(data);
            }

            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['service-offerings'] });

            onClose();
        } catch (error) {
            console.error('Failed to save service offering:', error);
            alert('Failed to save service offering. Please try again.');
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
                    {isEdit ? 'Edit Service Offering' : 'New Service Offering'}
                </Typography>
                <IconButton onClick={onClose}>
                    <X size={24} />
                </IconButton>
            </Box>

            <Box sx={{ p: 3 }}>
                <ServiceOfferingForm
                    initialData={offering ? {
                        title: offering.title,
                        description: offering.description,
                        specialistId: offering.serviceOfferings?.[0]?.specialists || '',
                        s3Key: offering.s3Key || undefined,
                        bucketName: offering.bucketName || undefined,
                    } : undefined}
                    isEdit={isEdit}
                    isLoading={isCreating || isUpdating}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                />
            </Box>
        </Drawer>
    );
}
