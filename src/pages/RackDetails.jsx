import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from 'react-hot-toast';
import API from "../client/api"; // <- Axios
import * as rackService from '../services/rackService';
import * as palletService from '../services/palletService';
import PageContainer from '../components/ui/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';

function RackDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [rack, setRack] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showProducts, setShowProducts] = useState(false);
    const [showAddPalletForm, setShowAddPalletForm] = useState(false);
    const [newPalletForm, setNewPalletForm] = useState({ name: "" });
    const [showConfirmDeleteRack, setShowConfirmDeleteRack] = useState(false);

    useEffect(() => {
        let mounted = true;
        const fetchRack = async () => {
            try {
                const data = await rackService.getRack(id);
                if (mounted) setRack(data);
            } catch (err) {
                let message = "Erro ao carregar rack. Tente novamente.";
                if (err?.response?.status === 404) {
                    message = "Rack não encontrado.";
                } else if (err?.response?.data?.message) {
                    const backendMsg = err.response.data.message.toLowerCase();
                    if (backendMsg.includes('not found')) {
                        message = "Rack não encontrado.";
                    } else {
                        message = "Erro: " + err.response.data.message;
                    }
                }
                if (mounted) setError(message);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchRack();
        return () => { mounted = false; };
    }, [id]);

    const handleNewPalletChange = (e) => {
        const { name, value } = e.target;
        setNewPalletForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddPallet = async (e) => {
        e.preventDefault();
        try {
            const res = await palletService.createPallet({ name: newPalletForm.name, palletRackId: parseInt(id, 10) });
            setRack((prev) => ({ ...prev, pallets: [...(prev.pallets || []), res] }));
            setShowAddPalletForm(false);
            setNewPalletForm({ name: "" });
            toast.success('Pallet adicionado com sucesso!');
        } catch (err) {
            let message = "Erro ao adicionar pallet. Tente novamente.";
            if (err?.response?.status === 400) {
                message = "Dados inválidos. Verifique o nome.";
            } else if (err?.response?.status === 409) {
                message = "Pallet com esse nome já existe.";
            } else if (err?.response?.data?.message) {
                const backendMsg = err.response.data.message.toLowerCase();
                if (backendMsg.includes('duplicate') || backendMsg.includes('exists')) {
                    message = "Pallet já existe.";
                } else if (backendMsg.includes('invalid')) {
                    message = "Dados inválidos.";
                } else {
                    message = "Erro: " + err.response.data.message;
                }
            }
            toast.error(message);
        }
    };

    const handleDeleteRack = async () => {
        setShowConfirmDeleteRack(true);
    };

    const confirmDeleteRack = async () => {
        setShowConfirmDeleteRack(false);
        try {
            await API.delete(`/racks/${id}`);
            toast.success('Rack deletado com sucesso!');
            navigate('/racks');
        } catch (err) {
            let message = "Erro ao deletar rack. Tente novamente.";
            if (err?.response?.status === 404) {
                message = "Rack não encontrado.";
            } else if (err?.response?.data?.message) {
                const backendMsg = err.response.data.message.toLowerCase();
                if (backendMsg.includes('not found')) {
                    message = "Rack não encontrado.";
                } else {
                    message = "Erro: " + err.response.data.message;
                }
            }
            toast.error(message);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64 text-gray-500">Carregando...</div>;
    if (error) return <div className="flex justify-center items-center h-64 text-red-600">Erro ao carregar rack: {error}</div>;
    if (!rack) return null;

    const used = rack.pallets?.length || 0;

    return (
        <PageContainer>
            <div className="max-w-xl mx-auto">
                <div className="mb-4">
                    <button onClick={() => navigate('/racks')} className="text-sm text-blue-700 mb-2 flex items-center gap-1">← Voltar</button>
                    <Card>
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2 text-center">{rack.name}</h1>
                        <div className="text-gray-700 text-sm space-y-1">
                            <p><strong>Localização:</strong> {rack.location}</p>
                            <p><strong>Capacidade total:</strong> {rack.total_capacity}</p>
                            <p><strong>Pallets ocupados:</strong> {used}</p>
                        </div>

                        <div className="mt-4">
                            <Button onClick={() => setShowAddPalletForm(!showAddPalletForm)} className="w-full">{showAddPalletForm ? 'Cancelar' : 'Adicionar Pallet'}</Button>
                        </div>

                        {rack.pallets.length === 0 && (
                            <div className="mt-3">
                                <Button variant="danger" onClick={handleDeleteRack} className="w-full">Deletar Rack</Button>
                            </div>
                        )}

                        {showAddPalletForm && (
                            <form onSubmit={handleAddPallet} className="mt-4 bg-gray-50 p-3 rounded-lg space-y-3">
                                <label className="block text-sm text-gray-700">Nome do Pallet
                                    <input type="text" name="name" value={newPalletForm.name} onChange={handleNewPalletChange} required className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500" />
                                </label>
                                <Button type="submit" className="w-full">Salvar Pallet</Button>
                            </form>
                        )}
                    </Card>
                </div>

                <Card>
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-lg font-semibold text-gray-800">Pallets</h2>
                        <Button onClick={() => setShowProducts(!showProducts)}>{showProducts ? 'Ocultar Produtos' : 'Ver Produtos'}</Button>
                    </div>

                    {rack.pallets.length === 0 ? (
                        <p className="text-gray-500 text-center text-sm py-4">Nenhum pallet cadastrado neste rack.</p>
                    ) : (
                        rack.pallets.map((pallet) => (
                            <div key={pallet.id} className="border-t border-gray-200 pt-4 mt-4">
                                <Link to={`/pallets/${pallet.id}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-blue-50 transition">
                                    <div>
                                        <h3 className="text-md font-semibold text-gray-800">{pallet.name}</h3>
                                        <p className="text-xs text-gray-500">ID: {pallet.id}</p>
                                    </div>
                                    {pallet.qr_code_url && <img src={pallet.qr_code_url} alt="QR Code" className="w-16 h-16 rounded-lg border object-contain" />}
                                </Link>

                                {showProducts && pallet.palletizedProduct?.length > 0 && (
                                    <div className="mt-3 bg-gray-50 rounded-lg p-3">
                                        <p className="text-sm font-semibold text-gray-700 mb-2">Produtos:</p>
                                        {pallet.palletizedProduct.map((prod) => (
                                            <div key={prod.ID} className="flex justify-between text-sm text-gray-600 border-b border-gray-200 py-1">
                                                <span>EAN: {prod.ean}</span>
                                                <span>Qtd: {prod.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </Card>
            </div>
            <ConfirmDialog
                isOpen={showConfirmDeleteRack}
                onClose={() => setShowConfirmDeleteRack(false)}
                onConfirm={confirmDeleteRack}
                title="Deletar Rack"
                message="Tem certeza que deseja deletar este rack? Esta ação não pode ser desfeita."
            />
        </PageContainer>
    );
}

export default RackDetails;