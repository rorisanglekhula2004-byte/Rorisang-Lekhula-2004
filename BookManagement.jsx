import { useEffect, useState, useCallback } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import BookForm from '../components/BookForm.jsx';
import BookList from '../components/BookList.jsx';
import Message from '../components/Message.jsx';

export default function BookManagement() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = useCallback(() => {
    api.getBooks().then(setBooks).catch((e) => setError(e.message));
  }, []);

  useEffect(() => { load(); }, [load]);

  const notify = (msg) => { setSuccess(msg); setError(''); };

  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await api.updateBook(editing.id, data);
        notify('Book updated.');
        setEditing(null);
      } else {
        await api.addBook(data);
        notify('Book added.');
      }
      load();
      return true;
    } catch (e) { setError(e.message); setSuccess(''); return false; }
  };

  const handleDelete = async (book) => {
    if (!window.confirm(`Delete "${book.title}"? This also removes its transaction history.`)) return;
    try { await api.deleteBook(book.id); notify('Book deleted.'); load(); }
    catch (e) { setError(e.message); }
  };

  if (user.role !== 'admin') {
    return (
      <section>
        <h2>Book Management</h2>
        <Message type="warning">Only administrators can add, update or delete books.</Message>
        <BookList books={books} readOnly />
      </section>
    );
  }

  return (
    <section>
      <h2>Book Management</h2>
      <Message>{error}</Message>
      <Message type="success">{success}</Message>
      <BookForm initialBook={editing} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />
      <h3>All Books</h3>
      <BookList
        books={books}
        onUpdate={(b) => { setEditing(b); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        onDelete={handleDelete}
      />
    </section>
  );
}
