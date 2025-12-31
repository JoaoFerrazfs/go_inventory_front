import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';
import storage from '../services/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        async function init() {
            try {
                const token = await storage.getItem('token');
                if (token && mounted) {
                    setUser({}); // minimal placeholder; could fetch profile if endpoint exists
                }
            } finally {
                if (mounted) setLoading(false);
            }
        }
        init();
        return () => {
            mounted = false;
        };
    }, []);

    const login = async (email, password) => {
        const resp = await authService.login(email, password);
        // Optionally load user info here
        setUser({});
        return resp;
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        window.location.href = '/login';
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}

export default AuthContext;
