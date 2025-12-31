import React from 'react';

export default function Card({ children, className = '' }) {
    return (
        <div className={`backdrop-blur-sm bg-white/60 rounded-2xl shadow-md p-6 ${className}`}>
            {children}
        </div>
    );
}
