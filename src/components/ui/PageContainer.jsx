import React from 'react';

export default function PageContainer({ children, className = '' }) {
    return (
        <div className={`min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 font-sans p-6 ${className}`}>
            <div className="max-w-6xl mx-auto">
                {children}
            </div>
        </div>
    );
}
