import React from "react";
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
    const { isAuthenticated, logout } = useAuth();
    return (
        <header className="backdrop-blur-sm bg-white/40 border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img src={`${process.env.PUBLIC_URL}/img/logo2.png`} alt="Logo" className="h-10 w-auto object-contain" />
                    <Link to="/" className="text-lg font-semibold text-gray-900">Go Inventory</Link>
                </div>

                <nav className="flex items-center gap-4">
                    <Link to="/" className="text-sm text-gray-700 hover:text-gray-900">Pagina Inicial</Link>
                    <Link to="/racks" className="text-sm text-gray-700 hover:text-gray-900">Racks</Link>
                    {isAuthenticated && (
                        <Link to="/admin" className="text-sm text-gray-700 hover:text-gray-900">Admin</Link>
                    )}
                    {!isAuthenticated ? (
                        <Link to="/login" className="ml-4 text-sm text-blue-600">Login</Link>
                    ) : (
                        <button onClick={logout} className="ml-4 text-sm text-red-600">Logout</button>
                    )}
                </nav>
            </div>
        </header>
    );
}
