import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://anycomp-server.vercel.app/api/v1/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptors if needed (e.g., for auth tokens)
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Check if error response exists and status is 401 or 403
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Clear token from localStorage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                // Redirect to login page
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
