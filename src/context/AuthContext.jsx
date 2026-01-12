import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';
import storage from '../services/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedInventory, setSelectedInventoryState] = useState(null);

    useEffect(() => {
        let mounted = true;
        async function init() {
            try {
                const token = await storage.getItem('token');
                const inventory = await storage.getItem('selectedInventory');
                if (token && mounted) {
                    setUser({}); // minimal placeholder; could fetch profile if endpoint exists
                }
                if (inventory && mounted) {
                    setSelectedInventoryState(JSON.parse(inventory));
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
        setSelectedInventoryState(null);
        await storage.removeItem('selectedInventory');
        window.location.href = '/login';
    };

    const setSelectedInventory = async (inventory) => {
        setSelectedInventoryState(inventory);
        if (inventory) {
            await storage.setItem('selectedInventory', JSON.stringify(inventory));
        } else {
            await storage.removeItem('selectedInventory');
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        selectedInventory,
        setSelectedInventory,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}

export default AuthContext;
