import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://anycomp-server.vercel.app/api/v1/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptors if needed (e.g., for auth tokens)

export default api;
