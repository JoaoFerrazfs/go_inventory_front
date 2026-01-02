import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import API from "../client/api"; // <- Axios com interceptors
import PageContainer from '../components/ui/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';

function PalletDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pallet, setPallet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: "", palletRackId: "" });
    const [productEdit, setProductEdit] = useState(null);
    const [productQuantity, setProductQuantity] = useState(0);

    const [showAddProductForm, setShowAddProductForm] = useState(false);
    const [newProductForm, setNewProductForm] = useState({ ean: "", quantity: 0 });
    const [showConfirmDeletePallet, setShowConfirmDeletePallet] = useState(false);
    const [showConfirmDeleteProduct, setShowConfirmDeleteProduct] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        const fetchPallet = async () => {
            try {
                const res = await API.get(`/pallets/${id}`);
                const fetchedPallet =
                    res.data.pallets?.find((p) => p.id === parseInt(id)) || res.data;
                setPallet(fetchedPallet);
                setForm({
                    name: fetchedPallet?.name || "",
                    palletRackId: fetchedPallet?.palletRackId || "",
                });
            } catch (err) {
                let message = "Erro ao carregar pallet. Tente novamente.";
                if (err?.response?.status === 404) {
                    message = "Pallet não encontrado.";
                } else if (err?.response?.data?.message) {
                    const backendMsg = err.response.data.message.toLowerCase();
                    if (backendMsg.includes('not found')) {
                        message = "Pallet não encontrado.";
                    } else {
                        message = "Erro: " + err.response.data.message;
                    }
                }
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchPallet();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const res = await API.patch(`/pallets/${id}`, {
                name: form.name,
                palletRackId: parseInt(form.palletRackId, 10),
            });

            setPallet(res.data);
            toast.success("Pallet atualizado com sucesso!");
            setEditing(false);
        } catch (err) {
            let message = "Erro ao salvar pallet. Tente novamente.";
            if (err?.response?.status === 400) {
                message = "Dados inválidos. Verifique os campos.";
            } else if (err?.response?.data?.message) {
                const backendMsg = err.response.data.message.toLowerCase();
                if (backendMsg.includes('validation') || backendMsg.includes('invalid')) {
                    message = "Dados inválidos. Verifique os campos.";
                } else {
                    message = "Erro: " + err.response.data.message;
                }
            }
            toast.error(message);
        }
    };

    const handleProductEdit = (prod) => {
        setProductEdit(prod.ID);
        setProductQuantity(prod.quantity);
    };

    const handleProductSave = async (prod) => {
        try {
            const res = await API.patch(`/pallet/products/${pallet.id}`, {
                EAN: prod.ean,
                Quantity: parseInt(productQuantity, 10),
            });

            setPallet(res.data);
            setProductEdit(null);
        } catch (err) {
            let message = "Erro ao atualizar produto. Tente novamente.";
            if (err?.response?.status === 400) {
                message = "Dados inválidos. Verifique a quantidade.";
            } else if (err?.response?.status === 404) {
                message = "Produto não encontrado.";
            } else if (err?.response?.data?.message) {
                const backendMsg = err.response.data.message.toLowerCase();
                if (backendMsg.includes('not found')) {
                    message = "Produto não encontrado.";
                } else if (backendMsg.includes('invalid')) {
                    message = "Dados inválidos.";
                } else {
                    message = "Erro: " + err.response.data.message;
                }
            }
            toast.error(message);
        }
    };

    const handleProductDelete = async (prod) => {
        setProductToDelete(prod);
        setShowConfirmDeleteProduct(true);
    };

    const confirmDeleteProduct = async () => {
        const prod = productToDelete;
        setShowConfirmDeleteProduct(false);
        setProductToDelete(null);
        try {
            await API.delete(`/pallet/products/${pallet.id}/${prod.ean}`);

            setPallet((prev) => ({
                ...prev,
                palletizedProduct: prev.palletizedProduct.filter((p) => p.ID !== prod.ID),
            }));
        } catch (err) {
            console.log(err);
            let message = "Erro ao deletar produto. Tente novamente.";
            if (err?.response?.status === 404) {
                message = "Produto não encontrado.";
            } else if (err?.response?.data?.message) {
                const backendMsg = err.response.data.message.toLowerCase();
                if (backendMsg.includes('not found')) {
                    message = "Produto não encontrado.";
                } else {
                    message = "Erro: " + err.response.data.message;
                }
            }
            toast.error(message);
        }
    };

    const handleNewProductChange = (e) => {
        const { name, value } = e.target;
        setNewProductForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const res = await API.patch(`/pallet/products/${pallet.id}`, {
                EAN: parseInt(newProductForm.ean, 10),
                Quantity: parseInt(newProductForm.quantity, 10),
            });

            setPallet(res.data);
            setNewProductForm({ ean: "", quantity: 0 });
            setShowAddProductForm(false);
            toast.success("Produto adicionado com sucesso!");
        } catch (err) {
            let message = "Erro ao adicionar produto. Tente novamente.";
            if (err?.response?.status === 400) {
                message = "Dados inválidos. Verifique EAN e quantidade.";
            } else if (err?.response?.status === 409) {
                message = "Produto já existe no pallet.";
            } else if (err?.response?.data?.message) {
                const backendMsg = err.response.data.message.toLowerCase();
                if (backendMsg.includes('duplicate') || backendMsg.includes('exists')) {
                    message = "Produto já existe no pallet.";
                } else if (backendMsg.includes('invalid')) {
                    message = "Dados inválidos.";
                } else {
                    message = "Erro: " + err.response.data.message;
                }
            }
            toast.error(message);
        }
    };

    const handleDeletePallet = async () => {
        setShowConfirmDeletePallet(true);
    };

    const confirmDeletePallet = async () => {
        setShowConfirmDeletePallet(false);
        try {
            await API.delete(`/pallets/${id}`);
            toast.success("Pallet deletado com sucesso!");
            navigate("/racks");
        } catch (err) {
            let message = "Erro ao deletar pallet. Tente novamente.";
            if (err?.response?.status === 404) {
                message = "Pallet não encontrado.";
            } else if (err?.response?.data?.message) {
                const backendMsg = err.response.data.message.toLowerCase();
                if (backendMsg.includes('not found')) {
                    message = "Pallet não encontrado.";
                } else {
                    message = "Erro: " + err.response.data.message;
                }
            }
            toast.error(message);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64 text-gray-500">Carregando...</div>;
    if (error) return <div className="flex justify-center items-center h-64 text-red-600">Erro ao carregar pallet: {error}</div>;
    if (!pallet) return null;

    return (
        <PageContainer>
            <div className="max-w-lg mx-auto">
                <button onClick={() => navigate(-1)} className="text-sm text-blue-700 mb-4 flex items-center gap-1">← Voltar</button>

                <Card className="mb-5">
                    <div className="flex justify-between items-center mb-3">
                        <h1 className="text-2xl font-semibold text-gray-900">Detalhes do Pallet</h1>
                        <div className="flex gap-2">
                            <Button onClick={() => setEditing(!editing)}>{editing ? 'Cancelar' : 'Editar'}</Button>
                            <Button variant="danger" onClick={handleDeletePallet}>Deletar</Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm text-gray-700"><strong>Nome:</strong>
                            {editing ? (
                                <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500" />
                            ) : (
                                <p className="text-gray-800">{pallet.name}</p>
                            )}
                        </label>

                        <label className="block text-sm text-gray-700"><strong>ID do Rack:</strong>
                            {editing ? (
                                <input type="number" name="palletRackId" value={form.palletRackId} onChange={handleChange} className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500" />
                            ) : (
                                <p className="text-gray-800">{pallet.palletRackId}</p>
                            )}
                        </label>
                    </div>

                    {editing && <Button onClick={handleSave} className="w-full mt-4">Salvar Alterações</Button>}
                </Card>

                <Card>
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-lg font-semibold text-gray-800">Produtos Paletizados</h2>
                        <Button onClick={() => setShowAddProductForm(!showAddProductForm)}>{showAddProductForm ? 'Cancelar' : 'Adicionar Produto'}</Button>
                    </div>

                    {showAddProductForm && (
                        <form onSubmit={handleAddProduct} className="mb-4 bg-gray-50 p-3 rounded-lg space-y-2">
                            <input type="number" name="ean" placeholder="EAN" value={newProductForm.ean} onChange={handleNewProductChange} required className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500" />
                            <input type="number" name="quantity" placeholder="Quantidade" value={newProductForm.quantity} onChange={handleNewProductChange} required className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500" />
                            <Button type="submit" className="w-full">Salvar Produto</Button>
                        </form>
                    )}

                    {pallet.palletizedProduct?.length > 0 ? (
                        pallet.palletizedProduct.map((prod) => (
                            <div key={prod.ID} className="flex justify-between items-center text-sm text-gray-600 border-b border-gray-200 py-2">
                                <div>
                                    <span>EAN: {prod.ean}</span>
                                    {productEdit === prod.ID ? (
                                        <input type="number" value={productQuantity} onChange={(e) => setProductQuantity(e.target.value)} className="ml-2 w-20 border rounded-lg p-1" />
                                    ) : (
                                        <span className="ml-2">Qtd: {prod.quantity}</span>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    {productEdit === prod.ID ? (
                                        <Button onClick={() => handleProductSave(prod)} variant="primary">Salvar</Button>
                                    ) : (
                                        <Button onClick={() => handleProductEdit(prod)} variant="primary">Editar</Button>
                                    )}
                                    <Button variant="danger" onClick={() => handleProductDelete(prod)}>Deletar</Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center text-sm">Nenhum produto neste pallet.</p>
                    )}
                </Card>
            </div>
            <ConfirmDialog
                isOpen={showConfirmDeletePallet}
                onClose={() => setShowConfirmDeletePallet(false)}
                onConfirm={confirmDeletePallet}
                title="Deletar Pallet"
                message="Tem certeza que deseja deletar este pallet? Esta ação não pode ser desfeita."
            />
            <ConfirmDialog
                isOpen={showConfirmDeleteProduct}
                onClose={() => setShowConfirmDeleteProduct(false)}
                onConfirm={confirmDeleteProduct}
                title="Deletar Produto"
                message="Tem certeza que quer deletar este produto do pallet?"
            />
        </PageContainer>
    );
}

export default PalletDetails;
