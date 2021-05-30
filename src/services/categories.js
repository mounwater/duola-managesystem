import { get, post, put, del } from '../utils/request';

export const getCategories = () => get('/api/v1/admin/productcategory');

export const addCategories = (data) =>
  post('/api/v1/admin/productcategory', data);

export const modifyCategories = (id, data) =>
  put(`/api/v1/admin/productcategory/${id}`, data);

export const delCategories = (id) => del(`/api/v1/admin/productcategory/${id}`);
