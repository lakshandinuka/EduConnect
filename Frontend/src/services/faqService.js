import api from './api';

const FAQ_API = '/faqs';

export const getFaqs = async () => {
  const res = await api.get(FAQ_API);
  return res.data;
};

// Admin
export const getFaqsAdmin = async () => {
  const res = await api.get(`${FAQ_API}/admin`);
  return res.data;
};

export const createFaq = async (faq) => {
  const res = await api.post(`${FAQ_API}/admin`, faq);
  return res.data;
};

export const updateFaq = async (id, faq) => {
  const res = await api.put(`${FAQ_API}/admin/${id}`, faq);
  return res.data;
};

export const deleteFaq = async (id) => {
  const res = await api.delete(`${FAQ_API}/admin/${id}`);
  return res.data;
};

export const reorderFaqs = async (items) => {
  const res = await api.post(`${FAQ_API}/admin/reorder`, { items });
  return res.data;
};
