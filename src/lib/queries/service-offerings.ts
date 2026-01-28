import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ServiceOffering } from '@/lib/types';

// Mock Data
const MOCK_SERVICE_OFFERINGS: ServiceOffering[] = [
    { id: '1', name: 'Incorporation (Sdn Bhd)', description: 'Full incoporation package', basePrice: 1500, isActive: true },
    { id: '2', name: 'Annual Return Filing', description: 'Yearly filing service', basePrice: 500, isActive: true },
    { id: '3', name: 'Strike Off', description: 'Company closing service', basePrice: 800, isActive: true },
];

export const useServiceOfferings = () => {
    return useQuery({
        queryKey: ['service-offerings'],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return MOCK_SERVICE_OFFERINGS;
        },
    });
};

export const useServiceOffering = (id: string) => {
    return useQuery({
        queryKey: ['service-offerings', id],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return MOCK_SERVICE_OFFERINGS.find(s => s.id === id);
        }
    });
};

export const useCreateServiceOffering = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Omit<ServiceOffering, 'id'>) => {
            console.log('Creating Offering:', data);
            await new Promise(resolve => setTimeout(resolve, 1000));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['service-offerings'] });
        }
    });
};

export const useUpdateServiceOffering = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<ServiceOffering> }) => {
            console.log('Updating Offering:', id, data);
            await new Promise(resolve => setTimeout(resolve, 1000));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['service-offerings'] });
        }
    });
}
