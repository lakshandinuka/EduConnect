import api from './api';

const POLICY_API = '/policies';

// User endpoints (view policies assigned to KB items)
export const getPoliciesForItem = async (itemId) => {
    const response = await api.get(`${POLICY_API}/items/${itemId}`);
    return response.data;
};

// Admin endpoints
export const getAccessPolicies = async () => {
    const response = await api.get(`${POLICY_API}/admin`);
    return response.data;
};

export const getAccessPolicy = async (policyId) => {
    const response = await api.get(`${POLICY_API}/admin/${policyId}`);
    return response.data;
};

export const createAccessPolicy = async (policyData) => {
    const response = await api.post(`${POLICY_API}/admin`, policyData);
    return response.data;
};

export const updateAccessPolicy = async (policyId, policyData) => {
    const response = await api.put(`${POLICY_API}/admin/${policyId}`, policyData);
    return response.data;
};

export const deleteAccessPolicy = async (policyId) => {
    const response = await api.delete(`${POLICY_API}/admin/${policyId}`);
    return response.data;
};

export const getPolicyTemplates = async () => {
    const response = await api.get(`${POLICY_API}/templates`);
    return response.data;
};
