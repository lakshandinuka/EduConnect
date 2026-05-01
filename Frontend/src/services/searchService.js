import api from './api';

const SEARCH_API = '/kb/items';

export const searchKB = async (query, filters = {}) => {
  const params = {
    q: query,
    ...filters
  };
  const res = await api.get(SEARCH_API, { params });
  return res.data;
};
