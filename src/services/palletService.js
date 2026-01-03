import api from '../client/api';
import { normalizeAssetUrl } from '../utils/assetUrl';

export async function exportPallets(filters = {}) {
    const params = new URLSearchParams();
    if (filters.palletRackId) params.append('palletRackId', filters.palletRackId);
    if (filters.productId) params.append('productId', filters.productId);
    const queryString = params.toString();
    const url = queryString ? `/pallets/export?${queryString}` : '/pallets/export';
    const resp = await api.get(url);
    return resp.data;
}

export async function listPallets(filters = {}) {
    const params = new URLSearchParams();
    if (filters.palletRackId) params.append('palletRackId', filters.palletRackId);
    if (filters.productId) params.append('productId', filters.productId);
    const queryString = params.toString();
    const url = queryString ? `/pallets/?${queryString}` : '/pallets/';
    const resp = await api.get(url);
    const data = resp.data || [];
    return data.map((p) => ({ ...p, qr_code_url: normalizeAssetUrl(p.qr_code_url) }));
}

export async function getPallet(id) {
    const resp = await api.get(`/pallets/${id}/`);
    const data = resp.data;
    if (data) data.qr_code_url = normalizeAssetUrl(data.qr_code_url);
    return data;
}

export async function createPallet(payload) {
    const resp = await api.post('/pallets/', payload);
    const data = resp.data;
    if (data) data.qr_code_url = normalizeAssetUrl(data.qr_code_url);
    return data;
}

export async function updatePallet(id, payload) {
    const resp = await api.patch(`/pallets/${id}/`, payload);
    return resp.data;
}

export async function deletePallet(id) {
    const resp = await api.delete(`/pallets/${id}/`);
    return resp.data;
}

export async function addProductToPallet(palletId, { ean, quantity }) {
    const resp = await api.patch(`/pallet/products/${palletId}/`, { ean, quantity });
    return resp.data;
}

export async function removeProductFromPallet(palletId, productsEan) {
    const resp = await api.delete(`/pallet/products/${palletId}/${productsEan}/`);
    return resp.data;
}

export default {
    listPallets,
    exportPallets,
    getPallet,
    createPallet,
    updatePallet,
    deletePallet,
    addProductToPallet,
    removeProductFromPallet,
};
