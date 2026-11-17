import { useState } from 'react';

export default function TransactionForm({ books, isAdmin, onSubmit }) {
  const [form, setForm] = useState({ book_id: '', type: 'BORROW', quantity: '1' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = {};
    if (!form.book_id) e.book_id = 'Select a book';
    if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 1) e.quantity = 'Enter a whole number of 1 or more';
    setErrors(e);
    if (Object.keys(e).length) return;
    const ok = await onSubmit({ ...form, book_id: Number(form.book_id), quantity: Number(form.quantity) });
    if (ok) setForm({ ...form, quantity: '1' });
  };

  return (
    <form className="card form-grid" onSubmit={handleSubmit} noValidate>
      <h3 className="full">Record Transaction</h3>
      <div className="form-group">
        <label htmlFor="book_id">Book</label>
        <select id="book_id" name="book_id" value={form.book_id} onChange={handleChange}
                className={errors.book_id ? 'invalid' : ''}>
          <option value="">-- Select book --</option>
          {books.map((b) => <option key={b.id} value={b.id}>{b.title} ({b.quantity} in stock)</option>)}
        </select>
        {errors.book_id && <small className="error-text">{errors.book_id}</small>}
      </div>
      <div className="form-group">
        <label htmlFor="type">Type</label>
        <select id="type" name="type" value={form.type} onChange={handleChange}>
          <option value="BORROW">Borrow (deduct stock)</option>
          {isAdmin && <option value="ADD_STOCK">New arrival (add stock)</option>}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="quantity">Quantity</label>
        <input id="quantity" name="quantity" type="number" min="1" value={form.quantity}
               onChange={handleChange} className={errors.quantity ? 'invalid' : ''} />
        {errors.quantity && <small className="error-text">{errors.quantity}</small>}
      </div>
      <div className="form-actions full">
        <button className="btn btn-primary" type="submit">Submit</button>
      </div>
    </form>
  );
}
