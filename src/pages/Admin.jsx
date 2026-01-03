import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import adminService from '../services/adminService';
import PageContainer from '../components/ui/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Admin() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const exportMockReport = async () => {
        const resp = await adminService.requestReport('movement');
        if (resp && resp.url) window.open(resp.url, '_blank');
    };

    const exportInventoryCSV = async () => {
        const resp = await adminService.requestReport('inventory');
        if (resp && resp.url) {
            // if backend provides filename, use it; otherwise fallback
            const a = document.createElement('a');
            a.href = resp.url;
            a.target = '_blank';
            if (resp.filename) a.download = resp.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    return (
        <PageContainer>
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">Painel de Administração</h2>
                        <p className="text-sm text-gray-600">Ferramentas simuladas para relatórios e controle de usuários.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="primary" onClick={exportMockReport}>Export Report</Button>
                        <Button variant="ghost" onClick={exportInventoryCSV}>Export Inventory</Button>
                        <Button variant="danger" onClick={logout}>Logout</Button>
                    </div>
                </div>

                <section className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Gerenciamento</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4">
                            <div className="text-sm text-gray-600">Usuários</div>
                            <div className="mt-3 font-semibold text-gray-900">Gerenciar usuários e permissões</div>
                            <div className="mt-4"><Button variant="primary" onClick={() => navigate('/admin/users')} className="w-full">Ir para Usuários</Button></div>
                        </Card>

                        <Card className="p-4">
                            <div className="text-sm text-gray-600">Pallets</div>
                            <div className="mt-3 font-semibold text-gray-900">Listar e gerenciar pallets</div>
                            <div className="mt-4"><Button variant="primary" onClick={() => navigate('/admin/pallets')} className="w-full">Ir para Pallets</Button></div>
                        </Card>
                    </div>
                </section>
            </Card>
        </PageContainer>
    );
}
