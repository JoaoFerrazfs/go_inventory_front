import api from '../client/api';

// Mocked admin service. Real backend should return { url: 'https://...' }
export async function requestReport(type = 'inventory') {
    // Try to call backend; fallback to mocked link when request fails or endpoint absent
    try {
        const resp = await api.post('/admin/reports/', { type });
        return resp.data; // expected { url: 'https://...' }
    } catch (err) {
        // return a mocked pre-signed url (data URI or a public placeholder)
        const now = new Date().toISOString();
        const filename = `${type}-report-${now}.csv`;
        // create a blob URL with minimal CSV so browser can download
        const csv = 'id,name,qty\n1,Produto A,10\n2,Produto B,5\n';
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        return { url, filename };
    }
}

export default { requestReport };
