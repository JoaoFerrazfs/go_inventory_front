import api from '../client/api';
import { normalizeAssetUrl } from '../utils/assetUrl';

export async function listRacks() {
    const resp = await api.get('/racks');
    return resp.data;
}

export async function getRack(id) {
    const resp = await api.get(`/racks/${id}`);
    const data = resp.data;
    if (data && Array.isArray(data.pallets)) {
        console.log('normalized pallets', data.pallets);

        data.pallets = data.pallets.map(p => ({ ...p, qr_code_url: normalizeAssetUrl(p.qr_code_url) }));
    }
    return data;
}

export async function createRack(payload) {
    const resp = await api.post('/racks', payload);
    return resp.data;
}

export async function deleteRack(id) {
    const resp = await api.delete(`/racks/${id}`);
    return resp.data;
}

export default { listRacks, getRack, createRack, deleteRack };
