import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/ui/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function UserManagement() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([
        { id: 1, name: 'Alice Silva', email: 'alice@example.com', role: 'admin' },
        { id: 2, name: 'Bruno Costa', email: 'bruno@example.com', role: 'user' },
        { id: 3, name: 'Carla Souza', email: 'carla@example.com', role: 'user' },
    ]);

    const toggleRole = (id) => {
        setUsers(users.map(u => u.id === id ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u));
    };

    return (
        <PageContainer>
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">Gerenciamento de Usuários</h2>
                        <p className="text-sm text-gray-600">Controle de usuários e permissões.</p>
                    </div>
                    <Button variant="ghost" onClick={() => navigate('/admin')}>Voltar</Button>
                </div>

                <div className="bg-white border rounded-lg divide-y">
                    {users.map(u => (
                        <div key={u.id} className="flex items-center justify-between p-4">
                            <div>
                                <div className="font-medium text-gray-900">{u.name}</div>
                                <div className="text-sm text-gray-500">{u.email}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="px-3 py-1 rounded-full text-sm border">{u.role}</div>
                                <button onClick={() => toggleRole(u.id)} className="text-sm text-blue-600">Alternar Função</button>
                                <button className="text-sm text-red-500">Remover</button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </PageContainer>
    );
}