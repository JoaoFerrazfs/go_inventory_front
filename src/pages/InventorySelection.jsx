import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listInventories } from '../services/inventoryService';
import PageContainer from '../components/ui/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const InventorySelection = () => {
    const { setSelectedInventory } = useAuth();
    const [inventories, setInventories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInventories = async () => {
            try {
                const response = await listInventories();
                const data = response.data.data;
                setInventories(Array.isArray(data) ? data : data?.inventories || []);
            } catch (error) {
                console.error('Error fetching inventories:', error);
                setInventories([]);
            } finally {
                setLoading(false);
            }
        };
        fetchInventories();
    }, []);

    const handleSelect = (inventory) => {
        setSelectedInventory(inventory);
        navigate('/racks');
    };

    if (loading) return <PageContainer><p>Loading inventories...</p></PageContainer>;

    const openInventories = inventories.filter(inv => inv.status === 'Open');
    const closedInventories = inventories.filter(inv => inv.status === 'Closed');

    return (
        <PageContainer>
            <h1 className="text-2xl font-bold mb-2">Seleção de Inventários</h1>
            <hr className="mb-6 border-gray-300" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {openInventories.length > 0 && (
                    <>
                        <h2 className="col-span-full text-lg font-semibold text-green-700 mb-4">Inventários Abertos</h2>
                        {openInventories.map((inventory) => (
                            <Card key={inventory.id} className="flex flex-col items-start p-6 shadow-lg border border-gray-200 rounded-lg bg-white hover:shadow-xl transition-shadow">
                                <h3 className="text-lg font-semibold mb-1">{inventory.name}</h3>
                                <p className="mb-4 text-sm text-gray-600">Status: <span className="font-medium">{inventory.status}</span></p>
                                <Button onClick={() => handleSelect(inventory)} className="mt-auto self-end">
                                    Selecionar
                                </Button>
                            </Card>
                        ))}
                    </>
                )}
                {closedInventories.length > 0 && (
                    <>
                        <h2 className="col-span-full text-lg font-semibold text-red-700 mb-4">Inventários Fechados</h2>
                        {closedInventories.map((inventory) => (
                            <Card key={inventory.id} className="flex flex-col items-start p-6 shadow-lg border border-gray-200 rounded-lg bg-gray-50">
                                <h3 className="text-lg font-semibold mb-1">{inventory.name}</h3>
                                <p className="mb-4 text-sm text-gray-600">Status: <span className="font-medium">{inventory.status}</span></p>
                                <Button onClick={() => handleSelect(inventory)} className="mt-auto self-end bg-gray-500 hover:bg-gray-600">
                                    Visualizar
                                </Button>
                            </Card>
                        ))}
                    </>
                )}
                {inventories.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 py-8">
                        <p>Nenhum inventário disponível.</p>
                    </div>
                )}
            </div>
        </PageContainer>
    );
};

export default InventorySelection;