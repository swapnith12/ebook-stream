const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

let authToken: string | null = localStorage.getItem('authToken');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => authToken;

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

// Books - Paybook API endpoints
export const getBooks = () => apiCall('/books/allBooks');
export const getBook = (id: string) => apiCall(`/books/${id}`);

// Auth - Paybook API endpoints
export const login = (email: string, password: string) =>
  apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }).then(data => {
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  });

export const verifyToken = () => apiCall('/auth/me');

export const logout = () =>
  apiCall('/auth/logout', { method: 'POST' }).then(() => {
    setAuthToken(null);
  });

// Book management (Admin)
export const uploadBook = (formData: FormData) =>
  apiCall('/books/upload', {
    method: 'POST',
    body: formData,
    headers: {}, // Let browser set Content-Type for multipart
  });

export const updateBook = (id: string, formData: FormData) =>
  apiCall(`/books/update/${id}`, {
    method: 'PUT',
    body: formData,
    headers: {}, // Let browser set Content-Type for multipart
  });

export const deleteBook = (id: string) =>
  apiCall(`/books/delete/${id}`, { method: 'DELETE' });

// Stream/Progress endpoints
export const getProgress = (bookId: string) =>
  apiCall(`/stream/progress/${bookId}`);

export const updateProgress = (bookId: string, page: number) =>
  apiCall(`/stream/progress/${bookId}`, {
    method: 'POST',
    body: JSON.stringify({ currentPage: page }),
  });

export const streamBook = (bookId: string) =>
  apiCall(`/stream/${bookId}`);
