import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

    useEffect(() => {
        fetch(`http://localhost:3000/api/v1/pallets/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                const fetchedPallet =
                    data.pallets?.find((p) => p.id === parseInt(id)) || data;
                setPallet(fetchedPallet);
                setForm({
                    name: fetchedPallet?.name || "",
                    palletRackId: fetchedPallet?.palletRackId || "",
                });
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/v1/pallets/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    palletRackId: parseInt(form.palletRackId, 10),
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `Erro HTTP: ${res.status}`);
            }

            alert("Pallet atualizado com sucesso!");
            setEditing(false);
        } catch (err) {
            alert(`Erro ao salvar: ${err.message}`);
        }
    };

    const handleProductEdit = (prod) => {
        setProductEdit(prod.ID);
        setProductQuantity(prod.quantity);
    };

    const handleProductSave = async (prod) => {
        try {
            const res = await fetch(
                `http://localhost:3000/api/v1/pallet/products/${pallet.id}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        EAN: prod.ean,
                        Quantity: parseInt(productQuantity, 10),
                    }),
                }
            );

            if (!res.ok) throw new Error(`Erro ao atualizar produto`);

            const updatedPallet = await res.json();

            setPallet(updatedPallet);
            setProductEdit(null);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleProductDelete = async (prod) => {
        if (!window.confirm("Tem certeza que quer deletar este produto?")) return;

        try {
            const res = await fetch(
                `http://localhost:3000/api/v1/pallet/products/${pallet.id}/${prod.ean}`,
                { method: "DELETE" }
            );
            if (!res.ok) throw new Error("Erro ao deletar produto");

            // Atualiza localmente removendo o produto
            setPallet((prev) => ({
                ...prev,
                palletizedProduct: prev.palletizedProduct.filter((p) => p.ID !== prod.ID),
            }));
        } catch (err) {
            alert(err.message);
        }
    };

    const handleNewProductChange = (e) => {
        const { name, value } = e.target;
        setNewProductForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(
                `http://localhost:3000/api/v1/pallet/products/${pallet.id}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        EAN: parseInt(newProductForm.ean, 10),
                        Quantity: parseInt(newProductForm.quantity, 10),
                    }),
                }
            );
            if (!res.ok) throw new Error("Erro ao adicionar produto");

            const updatedPallet = await res.json();

            setPallet(updatedPallet); // Aqui atualizamos o pallet completo
            setNewProductForm({ ean: "", quantity: 0 });
            setShowAddProductForm(false);
            alert("Produto adicionado com sucesso!");
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeletePallet = async () => {
        if (!window.confirm("Tem certeza que deseja deletar este pallet?")) return;

        try {
            const res = await fetch(`http://localhost:3000/api/v1/pallets/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Erro ao deletar pallet");

            alert("Pallet deletado com sucesso!");
            navigate("/racks");
        } catch (err) {
            alert(err.message);
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
                Erro ao carregar pallet: {error}
            </div>
        );

    if (!pallet) return null;

    return (
        <div className="p-4 max-w-md mx-auto bg-gray-50 min-h-screen">
            <button
                onClick={() => navigate(-1)}
                className="text-blue-700 text-sm mb-4 flex items-center gap-1"
            >
                ← Voltar
            </button>

            {/* Detalhes do pallet */}
            <div className="bg-white rounded-2xl shadow-lg p-5 mb-5">
                <div className="flex justify-between items-center mb-3">
                    <h1 className="text-2xl font-bold text-blue-900">Detalhes do Pallet</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setEditing(!editing)}
                            className={`text-sm px-4 py-2 rounded-full shadow-md transition ${editing
                                    ? "bg-gray-500 text-white hover:bg-gray-600"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                        >
                            {editing ? "Cancelar" : "Editar"}
                        </button>
                        <button
                            onClick={handleDeletePallet}
                            className="text-sm px-4 py-2 rounded-full shadow-md bg-red-600 text-white hover:bg-red-700 transition"
                        >
                            Deletar
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm text-gray-700">
                        <strong>Nome:</strong>
                        {editing ? (
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <p className="text-gray-800">{pallet.name}</p>
                        )}
                    </label>

                    <label className="block text-sm text-gray-700">
                        <strong>ID do Rack:</strong>
                        {editing ? (
                            <input
                                type="number"
                                name="palletRackId"
                                value={form.palletRackId}
                                onChange={handleChange}
                                className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <p className="text-gray-800">{pallet.palletRackId}</p>
                        )}
                    </label>
                </div>

                {editing && (
                    <button
                        onClick={handleSave}
                        className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-full transition"
                    >
                        Salvar Alterações
                    </button>
                )}
            </div>

            {/* Produtos */}
            <div className="bg-white rounded-2xl shadow-lg p-5">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Produtos Paletizados
                    </h2>
                    <button
                        onClick={() => setShowAddProductForm(!showAddProductForm)}
                        className="text-sm bg-green-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-green-700 transition"
                    >
                        {showAddProductForm ? "Cancelar" : "Adicionar Produto"}
                    </button>
                </div>

                {/* Formulário de novo produto */}
                {showAddProductForm && (
                    <form
                        onSubmit={handleAddProduct}
                        className="mb-4 bg-gray-50 p-3 rounded-lg space-y-2"
                    >
                        <input
                            type="number"
                            name="ean"
                            placeholder="EAN"
                            value={newProductForm.ean}
                            onChange={handleNewProductChange}
                            required
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="number"
                            name="quantity"
                            placeholder="Quantidade"
                            value={newProductForm.quantity}
                            onChange={handleNewProductChange}
                            required
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-full transition"
                        >
                            Salvar Produto
                        </button>
                    </form>
                )}

                {pallet.palletizedProduct?.length > 0 ? (
                    pallet.palletizedProduct.map((prod) => (
                        <div
                            key={prod.ID}
                            className="flex justify-between items-center text-sm text-gray-600 border-b border-gray-200 py-2"
                        >
                            <div>
                                <span>EAN: {prod.ean}</span>
                                {productEdit === prod.ID ? (
                                    <input
                                        type="number"
                                        value={productQuantity}
                                        onChange={(e) => setProductQuantity(e.target.value)}
                                        className="ml-2 w-20 border rounded-lg p-1"
                                    />
                                ) : (
                                    <span className="ml-2">Qtd: {prod.quantity}</span>
                                )}
                            </div>

                            <div className="flex gap-2">
                                {productEdit === prod.ID ? (
                                    <button
                                        onClick={() => handleProductSave(prod)}
                                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-xs"
                                    >
                                        Salvar
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleProductEdit(prod)}
                                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-xs"
                                    >
                                        Editar
                                    </button>
                                )}
                                <button
                                    onClick={() => handleProductDelete(prod)}
                                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-xs"
                                >
                                    Deletar
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center text-sm">
                        Nenhum produto neste pallet.
                    </p>
                )}
            </div>
        </div>
    );
}

export default PalletDetails;
