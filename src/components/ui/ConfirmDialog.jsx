import React from 'react';
import Button from './Button';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
                <p className="text-gray-600 mb-4">{message}</p>
                <div className="flex gap-3 justify-end">
                    <Button onClick={onClose} variant="ghost">Cancelar</Button>
                    <Button onClick={onConfirm} variant="danger">Deletar</Button>
                </div>
            </div>
        </div>
    );
}