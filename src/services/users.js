import { get, post, put, del } from '../utils/request';

export const getUsers = (page = 1) => {
  return get('/api/v1/admin/user', { page });
};

export const addUsers = (data) => {
  return post('/api/v1/auth/reg', data);
};

export const modifyUsers = (id, data) => {
  return put(`/api/v1/admin/user/${id}`, data);
};

export const delUsers = (id) => {
  return del(`/api/v1/admin/user/${id}`);
};

export const lockUsers = (id, isLocked) => {
  return put(`/api/v1/admin/user/${id}`, { isLocked: isLocked });
};
