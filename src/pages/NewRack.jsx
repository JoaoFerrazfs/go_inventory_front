import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../client/api"; // <- usamos o Axios com interceptors

function NewRack() {
    const [form, setForm] = useState({
        Name: "",
        Location: "",
        TotalCapacity: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await API.post("/racks/", {
                Name: form.Name,
                Location: form.Location,
                TotalCapacity: parseInt(form.TotalCapacity, 10),
            });

            // redireciona após salvar
            navigate("/racks");
        } catch (err) {
            // Axios coloca a resposta de erro em err.response
            const message = err.response?.data?.message || err.message || "Erro desconhecido";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-lg">
            <h1 className="text-2xl font-bold text-blue-900 mb-4">Novo Rack</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <input
                        type="text"
                        name="Name"
                        value={form.Name}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Localização</label>
                    <input
                        type="text"
                        name="Location"
                        value={form.Location}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Capacidade Total</label>
                    <input
                        type="number"
                        name="TotalCapacity"
                        value={form.TotalCapacity}
                        onChange={handleChange}
                        required
                        min="1"
                        className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {error && (
                    <p className="text-red-600 text-sm text-center">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full transition-colors w-full"
                >
                    {loading ? "Salvando..." : "Salvar"}
                </button>
            </form>
        </div>
    );
}

export default NewRack;
