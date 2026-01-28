import { useQuery } from '@tanstack/react-query';
import { Specialist } from '@/lib/types';

// Mock Data matching the UI image
const MOCK_SPECIALISTS: Specialist[] = [
    {
        id: '1',
        title: 'Incorporation of a new company',
        price: 2000,
        currency: 'RM',
        purchases: 20,
        duration: '3 Days',
        approvalStatus: 'Approved',
        publishStatus: 'Published',
    },
    {
        id: '2',
        title: 'Incorporation of a new company',
        price: 2000,
        currency: 'RM',
        purchases: 0,
        duration: '1 Day',
        approvalStatus: 'Under Review',
        publishStatus: 'Published',
    },
    {
        id: '3',
        title: 'Incorporation of a new company',
        price: 2000,
        currency: 'RM',
        purchases: 431,
        duration: '14 Days',
        approvalStatus: 'Approved',
        publishStatus: 'Not Published', // Assuming Red means Not Published based on image context
    },
    {
        id: '4',
        title: 'Incorporation of a new company',
        price: 2000,
        currency: 'RM',
        purchases: 0,
        duration: '7 Days',
        approvalStatus: 'Under Review',
        publishStatus: 'Published',
    },
    {
        id: '5',
        title: 'Incorporation of a new company',
        price: 2000,
        currency: 'RM',
        purchases: 1283,
        duration: '4 Days',
        approvalStatus: 'Rejected',
        publishStatus: 'Not Published',
    },
    {
        id: '6',
        title: 'Incorporation of a new company',
        price: 2000,
        currency: 'RM',
        purchases: 9180,
        duration: '5 Days',
        approvalStatus: 'Rejected',
        publishStatus: 'Not Published',
    },
];

export const useSpecialists = (filterStatus: string, searchQuery: string) => {
    return useQuery({
        queryKey: ['specialists', filterStatus, searchQuery],
        queryFn: async () => {
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 500));

            let data = [...MOCK_SPECIALISTS];

            if (filterStatus !== 'All') {
                // Simplistic filter logic for demo
                if (filterStatus === 'Drafts') {
                    // Assuming Drafts maps to Not Published for this demo or we'd need a Draft status
                    data = data.filter(s => s.publishStatus === 'Not Published');
                } else if (filterStatus === 'Published') {
                    data = data.filter(s => s.publishStatus === 'Published');
                }
            }

            if (searchQuery) {
                data = data.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));
            }

            return data;
        },
    });
};
