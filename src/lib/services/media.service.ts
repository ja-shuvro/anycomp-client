import api from '../api';
import { Media } from '../types';

/**
 * Upload an image for a specialist
 */
export const uploadMedia = async (
    specialistId: string,
    file: File,
    displayOrder?: number
): Promise<Media> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('specialistId', specialistId);
    if (displayOrder !== undefined) {
        formData.append('displayOrder', displayOrder.toString());
    }

    const response = await api.post('/media/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.data;
};

/**
 * Get all media for a specialist
 */
export const getSpecialistMedia = async (specialistId: string): Promise<Media[]> => {
    const response = await api.get(`/media/specialist/${specialistId}`);
    return response.data.data;
};

/**
 * Delete media by ID
 */
export const deleteMedia = async (id: string): Promise<void> => {
    await api.delete(`/media/${id}`);
};

/**
 * Reorder media
 */
export const reorderMedia = async (id: string, displayOrder: number): Promise<Media> => {
    const response = await api.patch(`/media/${id}/reorder`, { displayOrder });
    return response.data.data;
};
