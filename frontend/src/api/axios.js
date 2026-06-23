
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true // Crucial for sending/receiving cookies
});

// Inject in-memory access token into request headers
let memoryToken = null;
export const setMemoryToken = (token) => { memoryToken = token; };

API.interceptors.request.use((config) => {
    if (memoryToken) {
        config.headers.Authorization = `Bearer ${memoryToken}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Catch 401s and automatically refresh access token
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await axios.get('http://localhost:5000/api/auth/refresh', { withCredentials: true });
                setMemoryToken(data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return API(originalRequest); // Retry original request
            } catch (refreshError) {
                // Refresh token expired too -> kick user to login page
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default API;