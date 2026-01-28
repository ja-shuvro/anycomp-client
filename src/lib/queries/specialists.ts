import { useQuery } from '@tanstack/react-query';
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
            return data.data; // Now returns { items: [], pagination: {} }
        },
    });
};
