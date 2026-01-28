import { useQuery, useMutation } from '@tanstack/react-query';
import { Specialist } from '@/lib/types';
import api from '@/lib/api';

export const useSpecialists = (filterStatus: string, searchQuery: string, page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ['specialists', filterStatus, searchQuery, page, limit],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', limit.toString());

            if (filterStatus !== 'All') {
                params.append('status', filterStatus);
            }
            if (searchQuery) {
                params.append('search', searchQuery);
            }

            const { data } = await api.get(`/specialists?${params.toString()}`);

            // Map backend entity to frontend Specialist interface if needed
            // Assuming backend returns keys like basePrice, durationDays etc.
            // We might need to transform if the table expects 'duration' string and 'price'
            const items = data.data.items.map((item: any) => ({
                ...item,
                price: item.basePrice || item.price,
                duration: item.durationDays ? `${item.durationDays} Days` : item.duration,
                currency: 'RM', // Hardcode for now as per design
                approvalStatus: item.verificationStatus === 'verified' ? 'Approved' : item.verificationStatus === 'rejected' ? 'Rejected' : 'Under Review',
                publishStatus: item.isDraft ? 'Not Published' : 'Published',
            }));

            return { ...data.data, items };
        },
    });
};

export const useOneSpecialist = (id: string) => {
    return useQuery({
        queryKey: ['specialist', id],
        queryFn: async () => {
            const { data } = await api.get(`/specialists/${id}`);
            const item = data.data;
            return {
                ...item,
                price: item.basePrice,
                duration: item.durationDays ? `${item.durationDays} Days` : item.duration,
                currency: 'RM',
                approvalStatus: item.verificationStatus === 'verified' ? 'Approved' : item.verificationStatus === 'rejected' ? 'Rejected' : 'Under Review',
                publishStatus: item.isDraft ? 'Not Published' : 'Published',
            };
        },
        enabled: !!id,
    });
};

export const useCreateSpecialist = () => {
    return useMutation({
        mutationFn: async (data: any) => {
            // ensure numeric types
            const payload = {
                ...data,
                basePrice: Number(data.basePrice),
                durationDays: Number(data.durationDays),
            };
            return await api.post('/specialists', payload);
        },
    });
};

export const useUpdateSpecialist = () => {
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const payload = {
                ...data,
                basePrice: Number(data.basePrice),
                durationDays: Number(data.durationDays),
            };
            return await api.patch(`/specialists/${id}`, payload);
        },
    });
};
