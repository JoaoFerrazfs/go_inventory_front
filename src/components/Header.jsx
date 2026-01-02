import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Grid3X3, Settings, LogIn, LogOut, Menu, X } from 'lucide-react';

export default function Header() {
    const { isAuthenticated, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="backdrop-blur-sm bg-white/40 border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img src={`${process.env.PUBLIC_URL}/img/logo2.png`} alt="Logo" className="h-10 w-auto object-contain" />
                    <Link to="/" className="text-lg font-semibold text-gray-900">Go Inventory</Link>
                </div>

                <nav className="hidden md:flex items-center gap-4">
                    {!isAuthenticated && (
                        <Link to="/" className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                            <Home size={16} /> Pagina Inicial
                        </Link>
                    )}
                    {isAuthenticated && (
                        <Link to="/racks" className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                            <Grid3X3 size={16} /> Racks
                        </Link>
                    )}
                    {isAuthenticated && (
                        <Link to="/admin" className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                            <Settings size={16} /> Admin
                        </Link>
                    )}
                    {!isAuthenticated ? (
                        <Link to="/login" className="flex items-center gap-2 ml-4 text-sm text-blue-600">
                            <LogIn size={16} /> Login
                        </Link>
                    ) : (
                        <button onClick={logout} className="flex items-center gap-2 ml-4 text-sm text-red-600">
                            <LogOut size={16} /> Logout
                        </button>
                    )}
                </nav>

                <button
                    className="md:hidden text-gray-700"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4">
                    <nav className="flex flex-col gap-4">
                        {!isAuthenticated && (
                            <Link to="/" className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900" onClick={() => setIsOpen(false)}>
                                <Home size={16} /> Pagina Inicial
                            </Link>
                        )}
                        {isAuthenticated && (
                            <Link to="/racks" className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900" onClick={() => setIsOpen(false)}>
                                <Grid3X3 size={16} /> Racks
                            </Link>
                        )}
                        {isAuthenticated && (
                            <Link to="/admin" className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900" onClick={() => setIsOpen(false)}>
                                <Settings size={16} /> Admin
                            </Link>
                        )}
                        {!isAuthenticated ? (
                            <Link to="/login" className="flex items-center gap-2 text-sm text-blue-600" onClick={() => setIsOpen(false)}>
                                <LogIn size={16} /> Login
                            </Link>
                        ) : (
                            <button onClick={() => { logout(); setIsOpen(false); }} className="flex items-center gap-2 text-sm text-red-600">
                                <LogOut size={16} /> Logout
                            </button>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
