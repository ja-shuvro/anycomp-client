import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ServiceOffering, CreateServiceOfferingRequest, UpdateServiceOfferingRequest } from '@/lib/types';
import api from '@/lib/api';

export const useServiceOfferings = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ['service-offerings', page, limit],
        queryFn: async () => {
            const { data } = await api.get(`/service-offerings?page=${page}&limit=${limit}`);
            return data.data; // Returns { items: [], pagination: {} }
        },
    });
};

export const useServiceOffering = (id: string) => {
    return useQuery({
        queryKey: ['service-offerings', id],
        queryFn: async () => {
            const { data } = await api.get(`/service-offerings/${id}`);
            return data.data;
        },
        enabled: !!id,
    });
};

export const useCreateServiceOffering = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateServiceOfferingRequest) => {
            const response = await api.post('/service-offerings', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['service-offerings'] });
        }
    });
};

export const useUpdateServiceOffering = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateServiceOfferingRequest }) => {
            const response = await api.patch(`/service-offerings/${id}`, data);
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['service-offerings'] });
            queryClient.invalidateQueries({ queryKey: ['service-offerings', variables.id] });
        }
    });
}
