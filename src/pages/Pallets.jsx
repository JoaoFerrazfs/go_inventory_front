import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import palletService from '../services/palletService';
import PageContainer from '../components/ui/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Pallets() {
    const navigate = useNavigate();
    const [pallets, setPallets] = useState([]);
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [filters, setFilters] = useState({ palletRackId: '', productId: '' });
    const [exportLoading, setExportLoading] = useState(false);

    const fetchPallets = useCallback(async () => {
        try {
            const data = await palletService.listPallets(filters);
            setPallets(data);
        } catch (error) {
            console.error('Error fetching pallets:', error);
        }
    }, [filters]);

    useEffect(() => {
        fetchPallets();
    }, [fetchPallets]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        fetchPallets();
    };

    const clearFilters = () => {
        setFilters({ palletRackId: '', productId: '' });
        fetchPallets();
    };

    const exportResults = async () => {
        setExportLoading(true);
        try {
            const response = await palletService.exportPallets(filters);
            const downloadUrl = response.data.url;
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = 'pallets_export.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error exporting pallets:', error);
        } finally {
            setExportLoading(false);
        }
    };

    const toggleExpand = (id) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const printQR = (url) => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`<html><head><title>Imprimir QR Code</title></head><body style="margin:0; display:flex; justify-content:center; align-items:center; height:100vh;"><img src="${url}" style="max-width:80%; max-height:80%;"/></body></html>`);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <PageContainer>
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">Pallets</h2>
                        <p className="text-sm text-gray-600">Listagem de pallets com produtos.</p>
                    </div>
                    <Button variant="ghost" onClick={() => navigate('/admin')}>Voltar</Button>
                </div>

                <div className="mb-4 flex gap-4 items-end">
                    <div>
                        <label htmlFor="palletRackId" className="block text-sm font-medium text-gray-700">Rack ID</label>
                        <input
                            type="number"
                            id="palletRackId"
                            name="palletRackId"
                            value={filters.palletRackId}
                            onChange={handleFilterChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Digite o ID do rack"
                        />
                    </div>
                    <div>
                        <label htmlFor="productId" className="block text-sm font-medium text-gray-700">Product ID</label>
                        <input
                            type="number"
                            id="productId"
                            name="productId"
                            value={filters.productId}
                            onChange={handleFilterChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Digite o ID do produto"
                        />
                    </div>
                    <Button variant="primary" onClick={applyFilters}>Filtrar</Button>
                    <Button variant="ghost" onClick={clearFilters}>Limpar Filtros</Button>
                    <Button variant="primary" onClick={exportResults} disabled={exportLoading}>
                        {exportLoading ? 'Exportando...' : 'Exportar Resultado'}
                    </Button>
                </div>

                <div className="bg-white border rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rack</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código QR</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {pallets.map(pallet => (
                                <React.Fragment key={pallet.id}>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pallet.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pallet.palletRackName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <img src={pallet.qr_code_url} alt="Código QR" className="w-16 h-16 cursor-pointer hover:opacity-75" onClick={() => printQR(pallet.qr_code_url)} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-2">
                                                <Button variant="ghost" onClick={() => toggleExpand(pallet.id)} className="flex-1">
                                                    {expandedRows.has(pallet.id) ? 'Recolher' : 'Expandir'} Produtos
                                                </Button>
                                                <Button variant="primary" onClick={() => navigate(`/racks/${pallet.palletRackId}`)} className="flex-1">
                                                    Ver Rack
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedRows.has(pallet.id) && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4">
                                                <div className="bg-gray-50 p-4 rounded">
                                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Produtos</h4>
                                                    {pallet.palletizedProduct && pallet.palletizedProduct.length > 0 ? (
                                                        <table className="min-w-full divide-y divide-gray-200">
                                                            <thead className="bg-gray-100">
                                                                <tr>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">EAN</th>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white divide-y divide-gray-200">
                                                                {pallet.palletizedProduct.map(product => (
                                                                    <tr key={product.ID}>
                                                                        <td className="px-4 py-2 text-sm text-gray-900">{product.ean}</td>
                                                                        <td className="px-4 py-2 text-sm text-gray-900">{product.quantity}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    ) : (
                                                        <p className="text-sm text-gray-500">Nenhum produto</p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </PageContainer>
    );
}