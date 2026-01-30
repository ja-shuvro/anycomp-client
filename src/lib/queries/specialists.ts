import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateSpecialistData, UpdateSpecialistData, SpecialistFilters } from '@/lib/types';
import { specialistService } from '@/lib/services/specialist.service';

/**
 * Hook to fetch all specialists with filtering and pagination
 */
export const useSpecialists = (filters?: SpecialistFilters) => {
    return useQuery({
        queryKey: ['specialists', filters],
        queryFn: () => specialistService.getAll(filters),
    });
};

/**
 * Hook to fetch a single specialist by ID
 */
export const useOneSpecialist = (id: string) => {
    return useQuery({
        queryKey: ['specialist', id],
        queryFn: () => specialistService.getById(id),
        enabled: !!id,
    });
};

/**
 * Hook to create a new specialist
 */
export const useCreateSpecialist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateSpecialistData) => specialistService.create(data),
        onSuccess: () => {
            // Invalidate specialists list to refetch
            queryClient.invalidateQueries({ queryKey: ['specialists'] });
        },
    });
};

/**
 * Hook to update an existing specialist
 */
export const useUpdateSpecialist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateSpecialistData }) =>
            specialistService.update(id, data),
        onSuccess: (_, variables) => {
            // Invalidate both the list and the specific specialist
            queryClient.invalidateQueries({ queryKey: ['specialists'] });
            queryClient.invalidateQueries({ queryKey: ['specialist', variables.id] });
        },
    });
};

/**
 * Hook to publish a specialist
 */
export const usePublishSpecialist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => specialistService.publish(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['specialists'] });
            queryClient.invalidateQueries({ queryKey: ['specialist', id] });
        },
    });
};

/**
 * Hook to delete a specialist
 */
export const useDeleteSpecialist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => specialistService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['specialists'] });
        },
    });
};
