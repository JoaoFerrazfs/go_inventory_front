import axios from 'axios';
import { GO_INVETORY_BACK_HOST } from '../config/api';
import storage from './storage';

const AUTH_BASE = `${GO_INVETORY_BACK_HOST}/api/v1`;

export async function login(email, password) {
    const resp = await axios.post(`${AUTH_BASE}/auth/login`, { email, password });
    const { token, refreshToken } = resp.data;
    if (token) await storage.setItem('token', token);
    if (refreshToken) await storage.setItem('refreshToken', refreshToken);
    return resp.data;
}

export async function refreshToken() {
    const refreshToken = await storage.getItem('refreshToken');
    if (!refreshToken) throw new Error('no refresh token');
    const resp = await axios.post(`${AUTH_BASE}/auth/refreshToken`, { refreshToken });
    const { token: newToken, refreshToken: newRefreshToken } = resp.data;
    if (newToken) await storage.setItem('token', newToken);
    if (newRefreshToken) await storage.setItem('refreshToken', newRefreshToken);
    return resp.data;
}

export async function logout() {
    await storage.removeItem('token');
    await storage.removeItem('refreshToken');
}

export default { login, refreshToken, logout };
