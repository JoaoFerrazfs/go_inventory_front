import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
    const base = 'px-4 py-2 rounded-md font-medium transition-colors';
    const styles = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        ghost: 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50',
        danger: 'text-red-600 bg-transparent hover:bg-red-50',
    };
    return (
        <button className={`${base} ${styles[variant] || styles.primary} ${className}`} {...props}>
            {children}
        </button>
    );
}
