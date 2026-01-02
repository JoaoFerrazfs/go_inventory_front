import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../client/api"; // <- usamos o Axios com interceptors
import PageContainer from '../components/ui/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

function NewRack() {
    const [form, setForm] = useState({ Name: "", Location: "", TotalCapacity: "" });
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

            navigate("/racks");
        } catch (err) {
            let message = "Erro ao salvar o rack. Tente novamente.";
            if (err?.response?.status === 400) {
                message = "Dados inválidos. Verifique os campos.";
            } else if (err?.response?.status === 409) {
                message = "Rack já existe com esse nome.";
            } else if (err?.response?.data?.message) {
                const backendMsg = err.response.data.message.toLowerCase();
                if (backendMsg.includes('validation') || backendMsg.includes('invalid')) {
                    message = "Dados inválidos. Verifique os campos.";
                } else if (backendMsg.includes('duplicate') || backendMsg.includes('exists')) {
                    message = "Rack já existe.";
                } else {
                    message = "Erro: " + err.response.data.message;
                }
            }
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer>
            <div className="max-w-lg mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900 mb-4">Novo Rack</h1>

                <Card>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nome</label>
                            <input type="text" name="Name" value={form.Name} onChange={handleChange} required className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Localização</label>
                            <input type="text" name="Location" value={form.Location} onChange={handleChange} required className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Capacidade Total</label>
                            <input type="number" name="TotalCapacity" value={form.TotalCapacity} onChange={handleChange} required min="1" className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                        <Button type="submit" variant="primary" className="w-full">{loading ? 'Salvando...' : 'Salvar'}</Button>
                    </form>
                </Card>
            </div>
        </PageContainer>
    );
}

export default NewRack;
