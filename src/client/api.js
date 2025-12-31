import axios from 'axios';
import { GO_INVETORY_BACK_HOST } from '../config/api';
import storage from '../services/storage';
import authService from '../services/authService';

const API = axios.create({
    baseURL: `${GO_INVETORY_BACK_HOST}/api/v1`,
    timeout: 10000,
});

// Attach token from storage
API.interceptors.request.use(async (config) => {
    try {
        const token = await storage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (e) {
        // ignore storage errors
    }
    return config;
});

// Refresh token handling with queueing to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axios(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            isRefreshing = true;

            try {
                const data = await authService.refreshToken();
                const newToken = data.token || data.accessToken || null;
                processQueue(null, newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axios(originalRequest);
            } catch (err) {
                processQueue(err, null);
                // cleanup and redirect to login
                try {
                    await authService.logout();
                } catch (e) {
                    // ignore
                }
                window.location.href = '/login';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default API;
