import api from '@/lib/api';
import { LoginCredentials, RegisterData, User } from '@/lib/types';

export const authService = {
    async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
        const response = await api.post('/auth/login', credentials);
        return response.data.data;
    },

    async register(data: RegisterData): Promise<{ user: User; token: string }> {
        const response = await api.post('/auth/register', data);
        return response.data.data;
    },

    async getMe(): Promise<User> {
        const response = await api.get('/auth/me');
        return response.data.data;
    },

    logout() {
        localStorage.removeItem('token');
        window.location.href = '/login';
    },
};
