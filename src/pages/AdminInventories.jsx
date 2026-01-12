import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listInventories, updateInventory, createInventory } from '../services/inventoryService';
import PageContainer from '../components/ui/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';

export default function AdminInventories() {
    const navigate = useNavigate();
    const [inventories, setInventories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [newInventory, setNewInventory] = useState({ name: '', description: '' });

    useEffect(() => {
        const fetchInventories = async () => {
            try {
                const response = await listInventories();
                const data = response.data.data;
                setInventories(Array.isArray(data) ? data : data?.inventories || []);
            } catch (error) {
                console.error('Error fetching inventories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchInventories();
    }, []);

    const toggleStatus = (inventory) => {
        setPendingAction({ inventory, newStatus: inventory.status === 'Open' ? 'Closed' : 'Open' });
        setShowConfirm(true);
    };

    const handleCreate = async () => {
        if (!newInventory.name.trim()) return;
        try {
            await createInventory(newInventory);
            setNewInventory({ name: '', description: '' });
            // Refresh list
            const response = await listInventories();
            const data = response.data.data;
            setInventories(Array.isArray(data) ? data : data?.inventories || []);
        } catch (error) {
            console.error('Error creating inventory:', error);
        }
    };

    const confirmToggle = async () => {
        const { inventory, newStatus } = pendingAction;
        setShowConfirm(false);
        setPendingAction(null);
        try {
            await updateInventory(inventory.id, { name: inventory.name, status: newStatus });
            setInventories(inventories.map(inv => inv.id === inventory.id ? { ...inv, status: newStatus } : inv));
        } catch (error) {
            console.error('Error updating inventory:', error);
        }
    };

    if (loading) return <PageContainer><p>Loading inventories...</p></PageContainer>;

    const openInventories = inventories.filter(inv => inv.status === 'Open');
    const closedInventories = inventories.filter(inv => inv.status === 'Closed');

    return (
        <PageContainer>
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">Gerenciamento de Inventários</h2>
                        <p className="text-sm text-gray-600">Listar e gerenciar status dos inventários.</p>
                    </div>
                    <Button variant="ghost" onClick={() => navigate('/admin')}>Voltar</Button>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Criar Novo Inventário</h3>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Nome do Inventário"
                            value={newInventory.name}
                            onChange={(e) => setNewInventory({ ...newInventory, name: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="Descrição (opcional)"
                            value={newInventory.description}
                            onChange={(e) => setNewInventory({ ...newInventory, description: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <Button onClick={handleCreate} variant="primary">Criar</Button>
                    </div>
                </div>

                <div className="bg-white border rounded-lg divide-y">
                    {openInventories.length > 0 && (
                        <>
                            <h3 className="px-4 py-3 text-lg font-semibold text-green-700 bg-green-50">Inventários Abertos</h3>
                            {openInventories.map((inventory) => (
                                <div key={inventory.id} className="flex items-center justify-between p-4">
                                    <div>
                                        <div className="font-medium text-gray-900">{inventory.name}</div>
                                        <div className="text-sm text-gray-500">ID: {inventory.id}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={`px-3 py-1 rounded-full text-sm border ${inventory.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {inventory.status}
                                        </div>
                                        <Button onClick={() => toggleStatus(inventory)} variant={inventory.status === 'Open' ? 'danger' : 'primary'}>
                                            {inventory.status === 'Open' ? 'Fechar' : 'Reabrir'}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                    {closedInventories.length > 0 && (
                        <>
                            <h3 className="px-4 py-3 text-lg font-semibold text-red-700 bg-red-50">Inventários Fechados</h3>
                            {closedInventories.map((inventory) => (
                                <div key={inventory.id} className="flex items-center justify-between p-4">
                                    <div>
                                        <div className="font-medium text-gray-900">{inventory.name}</div>
                                        <div className="text-sm text-gray-500">ID: {inventory.id}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={`px-3 py-1 rounded-full text-sm border ${inventory.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {inventory.status}
                                        </div>
                                        <Button onClick={() => toggleStatus(inventory)} variant={inventory.status === 'Open' ? 'danger' : 'primary'}>
                                            {inventory.status === 'Open' ? 'Fechar' : 'Reabrir'}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                    {inventories.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                            <p>Nenhum inventário disponível.</p>
                        </div>
                    )}
                </div>
            </Card>

            <ConfirmDialog
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={confirmToggle}
                title="Confirmar Ação"
                message={`Você tem certeza que deseja ${pendingAction?.newStatus === 'Closed' ? 'fechar' : 'reabrir'} este inventário?`}
                confirmText={pendingAction?.newStatus === 'Closed' ? 'Fechar' : 'Reabrir'}
                confirmVariant="primary"
            />
        </PageContainer>
    );
}