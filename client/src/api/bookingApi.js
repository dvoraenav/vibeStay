import { fetchApi } from './apiClient';

export const createBooking = async (bookingData) => {
  return fetchApi('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });
};

export const checkAvailability = async (cabin_id, check_in, check_out) => {
  return fetchApi('/bookings/check-availability', {
    method: 'POST',
    body: JSON.stringify({ cabin_id, check_in, check_out }),
  });
};

export const getMyBookings = async () => {
  return fetchApi('/bookings/my-bookings');
};

export const addReview = async (reviewData) => {
  return fetchApi('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
};

export const getCabinReviews = async (cabinId) => {
  return fetchApi(`/reviews/cabin/${cabinId}`);
};
