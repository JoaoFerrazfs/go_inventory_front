// src/pages/Racks.jsx
import React, { useEffect, useState } from "react";
import API from "../client/api"; // ✅ correto

function Racks() {
    const [racks, setRacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchRacks = async () => {
            try {
                const res = await API.get("/racks/");
                if (isMounted) setRacks(res.data);
            } catch (err) {
                if (isMounted) setError(err?.message || "Erro desconhecido");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchRacks();

        return () => { isMounted = false; };
    }, []);



    const renderProgressBar = (percentage) => {
        let color = "bg-green-500";
        if (percentage > 80) color = "bg-red-500";
        else if (percentage > 50) color = "bg-yellow-500";
        return (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className={`h-2.5 rounded-full ${color}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        );
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-900">Racks</h1>
                <a href="#/racks/novo" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow">Novo</a>
            </div>

            {loading && (
                <p className="text-center text-gray-500">Carregando racks...</p>
            )}

            {error && (
                <div className="text-center p-6 bg-white rounded-2xl shadow mt-6 text-red-600">
                    <p className="text-lg">Erro ao carregar os dados. Tente novamente.</p>
                    <p className="text-sm">Detalhe: {error}</p>
                </div>
            )}

            {!loading && !error && racks.length === 0 && (
                <div className="text-center p-10 bg-white rounded-2xl shadow mt-6">
                    <p className="text-gray-500 text-lg">Nenhum rack cadastrado ainda. Comece adicionando um novo! 🚀</p>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
                {!loading && !error && racks.map((rack) => {
                    const slotsOcupados = rack.Pallets ? rack.Pallets.length : 0;
                    const percentage = parseFloat(rack.PercetageUsed || 0).toFixed(0);
                    return (
                        <a key={rack.ID} href={`#/racks/${rack.ID}`} className="block">
                            <div className="bg-white p-5 rounded-2xl shadow hover:shadow-xl transition border-t-4 border-blue-600">
                                <div className="flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V4a1 1 0 00-1-1H3zm1 2h12v2H4V5zm0 4h12v2H4V9zm0 4h12v2H4v-2z" clipRule="evenodd" />
                                    </svg>
                                </div>

                                <h2 className="text-xl font-semibold text-gray-900 mb-2 truncate" title={rack.Name}>{rack.Name}</h2>

                                <p className="text-sm text-gray-500 mb-1"><strong>Localização:</strong> <span className="font-medium text-gray-700">{rack.Location}</span></p>

                                <p className="text-sm text-gray-500 mb-3"><strong>Capacidade:</strong> <span className="font-medium text-gray-700">{slotsOcupados} / {rack.TotalCapacity} Pallets</span></p>

                                {renderProgressBar(percentage)}

                                <p className="text-xs text-right mt-1 text-gray-600">{percentage}% Ocupado</p>
                            </div>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

export default Racks;
