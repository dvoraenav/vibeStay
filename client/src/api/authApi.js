import { fetchApi } from './apiClient';

export const loginUser = async (email, password) => {
  return fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const registerUser = async (email, password, fullName) => {
  return fetchApi('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, fullName }),
  });
};
