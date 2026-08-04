import { fetchApi } from './apiClient';

export const getAllBookings = async () => {
  return fetchApi('/admin/bookings');
};

export const updateCabinPrice = async (cabinId, price_per_night) => {
  return fetchApi(`/admin/cabins/${cabinId}/price`, {
    method: 'PUT',
    body: JSON.stringify({ price_per_night }),
  });
};

export const addCabin = async (formData) => {
  return fetchApi('/admin/cabins', {
    method: 'POST',
    body: formData, // FormData handles its own content type
  });
};

export const getStats = async () => {
  return fetchApi('/admin/stats');
};

export const updateBookingStatus = async (bookingId, status) => {
  return fetchApi(`/admin/bookings/${bookingId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
};

export const getAllReviews = async () => {
  return fetchApi('/admin/reviews');
};

export const deleteReview = async (id) => {
  return fetchApi(`/admin/reviews/${id}`, {
    method: 'DELETE',
  });
};

export const replyToReview = async (id, reply) => {
  return fetchApi(`/admin/reviews/${id}/reply`, {
    method: 'POST',
    body: JSON.stringify({ reply }),
  });
};

export const getContactMessages = async () => {
  return fetchApi('/admin/messages');
};

export const updateMessageStatus = async (id, status) => {
  return fetchApi(`/admin/messages/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
};

export const deleteMessage = async (id) => {
  return fetchApi(`/admin/messages/${id}`, {
    method: 'DELETE',
  });
};
