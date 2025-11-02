import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../client/api"; // <- Axios

function RackDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [rack, setRack] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showProducts, setShowProducts] = useState(false);
    const [showAddPalletForm, setShowAddPalletForm] = useState(false);
    const [newPalletForm, setNewPalletForm] = useState({ name: "" });

    useEffect(() => {
        const fetchRack = async () => {
            try {
                const res = await API.get(`/racks/${id}`);
                setRack(res.data);
            } catch (err) {
                const message = err.response?.data?.message || err.message || "Erro ao carregar rack";
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchRack();
    }, [id]);

    const handleNewPalletChange = (e) => {
        const { name, value } = e.target;
        setNewPalletForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddPallet = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post(`/pallets/`, {
                name: newPalletForm.name,
                palletRackId: parseInt(id, 10),
            });

            setRack((prev) => ({
                ...prev,
                pallets: [...prev.pallets, res.data],
            }));
            setShowAddPalletForm(false);
            setNewPalletForm({ name: "" });
            alert("Pallet adicionado com sucesso!");
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Erro ao adicionar pallet";
            alert(message);
        }
    };

    const handleDeleteRack = async () => {
        if (!window.confirm("Tem certeza que deseja deletar este rack?")) return;

        try {
            await API.delete(`/racks/${id}`);
            alert("Rack deletado com sucesso!");
            navigate("/racks");
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Erro ao deletar rack";
            alert(message);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen text-gray-500">
                Carregando...
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center h-screen text-red-600 text-center px-4">
                Erro ao carregar rack: {error}
            </div>
        );

    if (!rack) return null;

    const used = rack.pallets?.length || 0;

    return (
        <div className="p-4 max-w-md mx-auto bg-gray-50 min-h-screen">
            {/* Botão voltar */}
            <button
                onClick={() => navigate("/racks")}
                className="text-blue-700 text-sm mb-4 flex items-center gap-1"
            >
                ← Voltar
            </button>

            {/* Informações do Rack */}
            <div className="bg-white rounded-2xl shadow-lg p-5 mb-5">
                <h1 className="text-2xl font-bold text-blue-900 mb-2 text-center">
                    {rack.name}
                </h1>
                <div className="text-gray-700 text-sm space-y-1">
                    <p>
                        <strong>Localização:</strong> {rack.location}
                    </p>
                    <p>
                        <strong>Capacidade total:</strong> {rack.total_capacity}
                    </p>
                    <p>
                        <strong>Pallets ocupados:</strong> {used}
                    </p>
                </div>

                {/* Botão Adicionar Pallet */}
                <button
                    onClick={() => setShowAddPalletForm(!showAddPalletForm)}
                    className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-full transition"
                >
                    {showAddPalletForm ? "Cancelar" : "Adicionar Pallet"}
                </button>

                {/* Botão Deletar Rack */}
                {rack.pallets.length === 0 && (
                    <button
                        onClick={handleDeleteRack}
                        className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-full transition"
                    >
                        Deletar Rack
                    </button>
                )}

                {/* Formulário de Novo Pallet */}
                {showAddPalletForm && (
                    <form
                        onSubmit={handleAddPallet}
                        className="mt-4 bg-gray-50 p-3 rounded-lg space-y-3"
                    >
                        <label className="block text-sm text-gray-700">
                            Nome do Pallet
                            <input
                                type="text"
                                name="name"
                                value={newPalletForm.name}
                                onChange={handleNewPalletChange}
                                required
                                className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                            />
                        </label>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-full transition"
                        >
                            Salvar Pallet
                        </button>
                    </form>
                )}
            </div>

            {/* Seção de Pallets */}
            <div className="bg-white rounded-2xl shadow-lg p-5">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold text-gray-800">Pallets</h2>
                    <button
                        onClick={() => setShowProducts(!showProducts)}
                        className="text-sm bg-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-700 transition"
                    >
                        {showProducts ? "Ocultar Produtos" : "Ver Produtos"}
                    </button>
                </div>

                {rack.pallets.length === 0 ? (
                    <p className="text-gray-500 text-center text-sm py-4">
                        Nenhum pallet cadastrado neste rack.
                    </p>
                ) : (
                    rack.pallets.map((pallet) => (
                        <div key={pallet.id} className="border-t border-gray-200 pt-4 mt-4">
                            <Link
                                to={`/pallets/${pallet.id}`}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-blue-50 transition"
                            >
                                <div>
                                    <h3 className="text-md font-semibold text-gray-800">
                                        {pallet.name}
                                    </h3>
                                    <p className="text-xs text-gray-500">ID: {pallet.id}</p>
                                </div>
                                {pallet.qr_code_url && (
                                    <img
                                        src={pallet.qr_code_url}
                                        alt="QR Code"
                                        className="w-16 h-16 rounded-lg border object-contain"
                                    />
                                )}
                            </Link>

                            {showProducts && pallet.palletizedProduct?.length > 0 && (
                                <div className="mt-3 bg-gray-50 rounded-lg p-3">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">
                                        Produtos:
                                    </p>
                                    {pallet.palletizedProduct.map((prod) => (
                                        <div
                                            key={prod.ID}
                                            className="flex justify-between text-sm text-gray-600 border-b border-gray-200 py-1"
                                        >
                                            <span>EAN: {prod.ean}</span>
                                            <span>Qtd: {prod.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default RackDetails;
