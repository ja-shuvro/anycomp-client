import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { uploadMedia, getSpecialistMedia, deleteMedia, reorderMedia } from '../services/media.service';
import * as types from '../types';

/**
 * Hook to upload media
 */
export const useUploadMedia = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ specialistId, file, displayOrder }: { specialistId: string; file: File; displayOrder?: number }) =>
            uploadMedia(specialistId, file, displayOrder),
        onSuccess: (_, variables) => {
            // Invalidate the specialist's media query
            queryClient.invalidateQueries({ queryKey: ['specialist-media', variables.specialistId] });
        },
    });
};

/**
 * Hook to fetch specialist media
 */
export const useSpecialistMedia = (specialistId: string) => {
    return useQuery<types.Media[]>({
        queryKey: ['specialist-media', specialistId],
        queryFn: () => getSpecialistMedia(specialistId),
        enabled: !!specialistId,
    });
};

/**
 * Hook to delete media
 */
export const useDeleteMedia = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteMedia(id),
        onSuccess: () => {
            // Invalidate all specialist media queries
            queryClient.invalidateQueries({ queryKey: ['specialist-media'] });
        },
    });
};

/**
 * Hook to reorder media
 */
export const useReorderMedia = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, displayOrder }: { id: string; displayOrder: number }) =>
            reorderMedia(id, displayOrder),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['specialist-media'] });
        },
    });
};
