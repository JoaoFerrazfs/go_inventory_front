import axios from "axios";
import { GO_INVETORY_BACK_HOST } from "../config/api";

const API = axios.create({
    baseURL: `${GO_INVETORY_BACK_HOST}/api/v1`,
});

// Intercepta todas as requisições para adicionar o token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Intercepta respostas para tratar token expirado
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Se for 401 e não for retry ainda
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
                try {
                    const res = await axios.post(
                        `${GO_INVETORY_BACK_HOST}/api/v1/auth/refreshToken`,
                        { RefreshToken: refreshToken }
                    );

                    const { token: newToken, refreshToken: newRefreshToken } = res.data;

                    localStorage.setItem("token", newToken);
                    if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);

                    originalRequest.headers.Authorization = `Bearer ${newToken}`;

                    // Refaz a requisição original
                    return axios(originalRequest);
                } catch (err) {
                    console.error("Refresh token falhou", err);
                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");
                    window.location.href = "/login"; // redireciona pro login
                }
            } else {
                window.location.href = "/login"; // sem refreshToken, manda pro login
            }
        }

        return Promise.reject(error);
    }
);

export default API;
