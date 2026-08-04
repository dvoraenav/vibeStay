const BASE_URL = 'http://localhost:5000/api';

export const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If we are sending FormData (for file uploads), we should not set Content-Type manually,
  // the browser will set it automatically with the correct boundary.
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'שגיאה כללית בתקשורת עם השרת');
  }

  return response.json();
};

export const getImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/600x400?text=No+Image';
  if (url.startsWith('/uploads')) {
    return `http://localhost:5000${url}`;
  }
  return url;
};
