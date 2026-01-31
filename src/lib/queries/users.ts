import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User } from '@/lib/types';

interface UsersResponse {
    items: User[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export const useUsers = (page: number = 1, limit: number = 10) => {
    return useQuery<UsersResponse>({
        queryKey: ['users', page, limit],
        queryFn: async () => {
            const response = await api.get(`/users?page=${page}&limit=${limit}`);
            return response.data.data;
        },
    });
};

export const useUser = (id: string) => {
    return useQuery<User>({
        queryKey: ['user', id],
        queryFn: async () => {
            const response = await api.get(`/users/${id}`);
            return response.data.data;
        },
        enabled: !!id,
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/users/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};
