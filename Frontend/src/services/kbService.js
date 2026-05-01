import api from './api';

const KB_API = '/kb';

const normalizeItem = (item) => {
    if (!item) return item;
    const normalized = { ...item };

    if (normalized.category && !normalized.categories) {
        normalized.categories = [normalized.category];
    }
    if (normalized.categories && !Array.isArray(normalized.categories)) {
        normalized.categories = [normalized.categories];
    }
    if (Array.isArray(normalized.categories) && normalized.categories.length > 0) {
        normalized.category = normalized.categories[0];
    }

    return normalized;
};

const normalizeItems = (items = []) => items.map(normalizeItem);

export const getKBHome = async () => {
    const response = await api.get(KB_API);
    return {
        recommended: normalizeItems(response.data?.recommended || []),
        trending: normalizeItems(response.data?.trending || []),
        featured: normalizeItems(response.data?.featured || []),
    };
};

export const getKBItem = async (itemId) => {
    const response = await api.get(`${KB_API}/items/${itemId}`);
    return normalizeItem(response.data);
};

export const getKBItems = async (params = {}) => {
    const normalizedParams = {
        ...params,
        q: params.q || params.search,
        categoryId: params.categoryId || params.category,
    };
    delete normalizedParams.search;
    delete normalizedParams.category;

    const response = await api.get(`${KB_API}/items`, { params: normalizedParams });
    if (Array.isArray(response.data)) return normalizeItems(response.data);
    return {
        ...response.data,
        items: normalizeItems(response.data?.items || []),
    };
};

export const getRecommendedItems = async () => {
    const response = await api.get(`${KB_API}/items/recommended`);
    return normalizeItems(response.data?.items || response.data || []);
};

export const getTrendingItems = async () => {
    const response = await api.get(`${KB_API}/items/trending`);
    return normalizeItems(response.data?.items || response.data || []);
};

export const getFeaturedItems = async () => {
    const response = await api.get(`${KB_API}/items/featured`);
    return normalizeItems(response.data?.items || response.data || []);
};

export const getRelatedItems = async (itemId, limit = 5) => {
    const response = await api.get(`${KB_API}/items/${itemId}/related`, {
        params: { limit },
    });
    return normalizeItems(response.data?.items || response.data || []);
};

export const submitFeedback = async (itemId, feedbackData) => {
    const response = await api.post(`${KB_API}/items/${itemId}/feedback`, feedbackData);
    return response.data;
};

export const downloadPDF = (itemId) => `${api.defaults.baseURL}${KB_API}/items/${itemId}/download`;

export const getAdminKBList = async (params = {}) => {
    const response = await api.get(`${KB_API}/admin/items`, { params });
    return {
        ...response.data,
        items: normalizeItems(response.data?.items || []),
    };
};

export const createKBItem = async (itemData) => {
    const response = await api.post(`${KB_API}/admin/items`, itemData);
    return response.data;
};

export const updateKBItem = async (itemId, itemData) => {
    const response = await api.put(`${KB_API}/admin/items/${itemId}`, itemData);
    return response.data;
};

export const archiveKBItem = async (itemId) => {
    const response = await api.patch(`${KB_API}/admin/items/${itemId}/archive`);
    return response.data;
};

export const unarchiveKBItem = async (itemId) => {
    const response = await api.patch(`${KB_API}/admin/items/${itemId}/unarchive`);
    return response.data;
};

export const deleteKBItem = async (itemId) => {
    const response = await api.delete(`${KB_API}/admin/items/${itemId}`);
    return response.data;
};

export const publishKBItem = async (itemId) => {
    const response = await api.patch(`${KB_API}/admin/items/${itemId}/publish`);
    return response.data;
};

export const unpublishKBItem = async (itemId) => {
    const response = await api.patch(`${KB_API}/admin/items/${itemId}/unpublish`);
    return response.data;
};

export const uploadPDF = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`${KB_API}/admin/upload-pdf`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};
