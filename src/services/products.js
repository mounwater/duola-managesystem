import { get, post, put, del } from '../utils/request';

export const loadProducts = (page = 1) => {
  return get('/api/v1/admin/product', { page });
};

export const addProduct = (data) => {
  return post('/api/v1/admin/product', { ...data });
};

export const modifyProduct = (id, data) => {
  return put(`/api/v1/admin/product/${id}`, { ...data });
};

export const delProduct = (id) => {
  return del(`/api/v1/admin/product/${id}`);
};
