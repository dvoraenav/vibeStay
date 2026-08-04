import { fetchApi } from './apiClient';

export const getAllCabins = async () => {
  return fetchApi('/cabins');
};

export const getCabinById = async (id) => {
  return fetchApi(`/cabins/${id}`);
};

export const getCabinReviews = async (cabinId) => {
  return fetchApi(`/cabins/${cabinId}/reviews`);
};
