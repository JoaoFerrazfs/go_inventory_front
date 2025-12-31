import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import adminService from '../services/adminService';
import PageContainer from '../components/ui/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Admin() {
    const { logout } = useAuth();
    const [users, setUsers] = useState([
        { id: 1, name: 'Alice Silva', email: 'alice@example.com', role: 'admin' },
        { id: 2, name: 'Bruno Costa', email: 'bruno@example.com', role: 'user' },
        { id: 3, name: 'Carla Souza', email: 'carla@example.com', role: 'user' },
    ]);

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

    const toggleRole = (id) => {
        setUsers(users.map(u => u.id === id ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u));
    };

    return (
        <PageContainer>
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h2>
                        <p className="text-sm text-gray-600">Mocked tools for reports and user control.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="primary" onClick={exportMockReport}>Export Report</Button>
                        <Button variant="ghost" onClick={exportInventoryCSV}>Export Inventory</Button>
                        <Button variant="danger" onClick={logout}>Logout</Button>
                    </div>
                </div>

                <section className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Reports</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-4">
                            <div className="text-sm text-gray-600">Quick Inventory</div>
                            <div className="mt-3 font-semibold text-gray-900">CSV export</div>
                            <div className="mt-4"><Button variant="primary" onClick={exportInventoryCSV} className="w-full">Export CSV</Button></div>
                        </Card>

                        <Card className="p-4">
                            <div className="text-sm text-gray-600">Movement Report</div>
                            <div className="mt-3 font-semibold text-gray-900">Mock data</div>
                            <div className="mt-4"><Button variant="primary" onClick={exportMockReport} className="w-full">Download</Button></div>
                        </Card>

                        <Card className="p-4">
                            <div className="text-sm text-gray-600">Custom Report</div>
                            <div className="mt-3 font-semibold text-gray-900">Build later</div>
                            <div className="mt-4"><Button className="w-full">Configure</Button></div>
                        </Card>
                    </div>
                </section>

                <section>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">User Management</h3>
                    <div className="bg-white border rounded-lg divide-y">
                        {users.map(u => (
                            <div key={u.id} className="flex items-center justify-between p-4">
                                <div>
                                    <div className="font-medium text-gray-900">{u.name}</div>
                                    <div className="text-sm text-gray-500">{u.email}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1 rounded-full text-sm border">{u.role}</div>
                                    <button onClick={() => toggleRole(u.id)} className="text-sm text-blue-600">Toggle Role</button>
                                    <button className="text-sm text-red-500">Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </Card>
        </PageContainer>
    );
}
