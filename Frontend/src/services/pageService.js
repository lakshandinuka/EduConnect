import api from './api';

export const getPageContent = async (slug) => {
  const res = await api.get(`/pages/${slug}`);
  return res.data;
};

export const updatePageContent = async (slug, contentObj) => {
  const res = await api.put(`/pages/${slug}`, {
    contentJson: JSON.stringify(contentObj)
  });
  return res.data;
};
