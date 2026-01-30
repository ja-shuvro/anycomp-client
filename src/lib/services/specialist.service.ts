import api from '@/lib/api';
import { Specialist, CreateSpecialistData, UpdateSpecialistData, SpecialistFilters, PaginatedResponse } from '@/lib/types';

export const specialistService = {
    /**
     * Get all specialists with optional filters and pagination
     * @param filters - Query parameters for filtering and pagination
     */
    async getAll(filters?: SpecialistFilters): Promise<PaginatedResponse<Specialist>> {
        const params = new URLSearchParams();

        if (filters) {
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.limit) params.append('limit', filters.limit.toString());
            if (filters.search) params.append('search', filters.search);
            if (filters.status) params.append('status', filters.status);
            if (filters.isDraft !== undefined) params.append('isDraft', filters.isDraft.toString());
            if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
        }

        const queryString = params.toString();
        const url = `/specialists${queryString ? `?${queryString}` : ''}`;

        const response = await api.get(url);

        console.log('=== SPECIALISTS API DEBUG ===');
        console.log('URL:', url);
        console.log('Full response.data:', response.data);
        console.log('response.data.data:', response.data.data);
        console.log('response.data.pagination:', response.data.pagination);
        console.log('Is response.data.data an array?', Array.isArray(response.data.data));

        // Handle different possible response structures
        // Backend might return { data: { items: [...], pagination: {...} } } or { data: [...], pagination: {...} }
        const responseData = response.data.data || response.data;

        // If responseData has items property, use it, otherwise assume it's the items array
        if (responseData.items && Array.isArray(responseData.items)) {
            console.log('Using responseData.items format');
            return {
                items: responseData.items,
                pagination: responseData.pagination || response.data.pagination
            };
        } else if (Array.isArray(responseData)) {
            console.log('Using array format, items count:', responseData.length);
            return {
                items: responseData,
                pagination: response.data.pagination
            };
        }

        // Fallback
        console.warn('WARNING: Using fallback empty array!');
        return {
            items: [],
            pagination: {
                currentPage: 1,
                totalPages: 1,
                totalItems: 0,
                itemsPerPage: 10,
                hasNextPage: false,
                hasPrevPage: false
            }
        };
    },

    /**
     * Get a single specialist by ID
     * @param id - Specialist UUID
     */
    async getById(id: string): Promise<Specialist> {
        const response = await api.get(`/specialists/${id}`);
        return response.data.data;
    },

    /**
     * Create a new specialist profile (requires authentication)
     * @param data - Specialist creation data
     */
    async create(data: CreateSpecialistData): Promise<Specialist> {
        const response = await api.post('/specialists', data);
        return response.data.data;
    },

    /**
     * Update an existing specialist (owner only)
     * @param id - Specialist UUID
     * @param data - Partial specialist update data
     */
    async update(id: string, data: UpdateSpecialistData): Promise<Specialist> {
        const response = await api.patch(`/specialists/${id}`, data);
        return response.data.data;
    },

    /**
     * Publish a specialist (transitions from draft to published)
     * @param id - Specialist UUID
     */
    async publish(id: string): Promise<Specialist> {
        const response = await api.patch(`/specialists/${id}/publish`);
        return response.data.data;
    },

    /**
     * Delete a specialist (soft delete, owner only)
     * @param id - Specialist UUID
     */
    async delete(id: string): Promise<void> {
        await api.delete(`/specialists/${id}`);
    },
};
