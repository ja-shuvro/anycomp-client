import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlatformFee } from '@/lib/types';

// Mock Data
const MOCK_PLATFORM_FEES: PlatformFee[] = [
    { id: '1', tierName: 'Standard Tier', percentage: 10, fixedAmount: 0, isActive: true },
    { id: '2', tierName: 'Premium Tier', percentage: 15, fixedAmount: 50, isActive: true },
    { id: '3', tierName: 'Enterprise', percentage: 5, fixedAmount: 200, isActive: false },
];

export const usePlatformFees = () => {
    return useQuery({
        queryKey: ['platform-fees'],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return MOCK_PLATFORM_FEES;
        },
    });
};

export const usePlatformFee = (id: string) => {
    return useQuery({
        queryKey: ['platform-fees', id],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return MOCK_PLATFORM_FEES.find(p => p.id === id);
        }
    });
};

// Mock Mutations (Logging only)
export const useCreatePlatformFee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Omit<PlatformFee, 'id'>) => {
            console.log('Creating Fee:', data);
            await new Promise(resolve => setTimeout(resolve, 1000));
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
            console.log('Updating Fee:', id, data);
            await new Promise(resolve => setTimeout(resolve, 1000));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['platform-fees'] });
        }
    });
}
