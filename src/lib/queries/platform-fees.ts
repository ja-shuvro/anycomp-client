import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlatformFee } from '@/lib/types';
import api from '@/lib/api';

export const usePlatformFees = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ['platform-fees', page, limit],
        queryFn: async () => {
            const { data } = await api.get(`/platform-fees?page=${page}&limit=${limit}`);
            return data.data; // Returns { items: [], pagination: {} }
        },
    });
};

export const usePlatformFee = (id: string) => {
    return useQuery({
        queryKey: ['platform-fees', id],
        queryFn: async () => {
            const { data } = await api.get(`/platform-fees/${id}`);
            return data.data;
        },
        enabled: !!id,
    });
};

export const useCreatePlatformFee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Omit<PlatformFee, 'id'>) => {
            const response = await api.post('/platform-fees', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['platform-fees'] });
        }
    });
};

export const useUpdatePlatformFee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<PlatformFee> }) => {
            const response = await api.patch(`/platform-fees/${id}`, data);
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['platform-fees'] });
            queryClient.invalidateQueries({ queryKey: ['platform-fees', variables.id] });
        }
    });
};

export const useDeletePlatformFee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/platform-fees/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['platform-fees'] });
        }
    });
};
