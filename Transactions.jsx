import { useEffect, useState, useCallback } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionLog from '../components/TransactionLog.jsx';
import Message from '../components/Message.jsx';

export default function Transactions() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = useCallback(async () => {
    try {
      const [b, t] = await Promise.all([api.getBooks(), api.getTransactions()]);
      setBooks(b);
      setTransactions(t);
    } catch (e) { setError(e.message); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (data) => {
    try {
      await api.addTransaction({ ...data, user_id: user.id });
      setSuccess(data.type === 'BORROW' ? 'Book borrowed. Stock deducted.' : 'Stock added.');
      setError('');
      load();
      return true;
    } catch (e) { setError(e.message); setSuccess(''); return false; }
  };

  return (
    <section>
      <h2>Transactions</h2>
      <Message>{error}</Message>
      <Message type="success">{success}</Message>
      <TransactionForm books={books} isAdmin={user.role === 'admin'} onSubmit={handleSubmit} />
      <h3>Transaction History</h3>
      <TransactionLog transactions={transactions} />
    </section>
  );
}
