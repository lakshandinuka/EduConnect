import api from './api';

const CATEGORY_API = '/categories';

// User endpoints
export const getCategories = async () => {
    const response = await api.get(CATEGORY_API);
    return response.data;
};

export const getCategory = async (categoryId) => {
    const response = await api.get(`${CATEGORY_API}/${categoryId}`);
    return response.data;
};

export const getCategoryItems = async (categoryId, params = {}) => {
    const response = await api.get(`${CATEGORY_API}/${categoryId}/items`, { params });
    return response.data;
};

// Admin endpoints
export const getAdminCategories = async () => {
    const response = await api.get(`${CATEGORY_API}/admin`);
    return response.data;
};

export const createCategory = async (categoryData) => {
    const response = await api.post(`${CATEGORY_API}/admin`, categoryData);
    return response.data;
};

export const updateCategory = async (categoryId, categoryData) => {
    const response = await api.put(`${CATEGORY_API}/admin/${categoryId}`, categoryData);
    return response.data;
};

export const deleteCategory = async (categoryId) => {
    const response = await api.delete(`${CATEGORY_API}/admin/${categoryId}`);
    return response.data;
};
