// Small wrapper around the Fetch API used by every page.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  getBooks: () => request('/books'),
  addBook: (book) => request('/books', { method: 'POST', body: book }),
  updateBook: (id, book) => request(`/books/${id}`, { method: 'PUT', body: book }),
  deleteBook: (id) => request(`/books/${id}`, { method: 'DELETE' }),

  getUsers: () => request('/users'),
  addUser: (user) => request('/users', { method: 'POST', body: user }),
  updateUser: (id, user) => request(`/users/${id}`, { method: 'PUT', body: user }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  login: (credentials) => request('/users/login', { method: 'POST', body: credentials }),

  getTransactions: () => request('/transactions'),
  addTransaction: (tx) => request('/transactions', { method: 'POST', body: tx }),
};
