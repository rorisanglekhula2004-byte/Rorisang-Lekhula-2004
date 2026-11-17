import { useState, useEffect } from 'react';

const EMPTY = { title: '', author: '', genre: '', isbn: '', quantity: '' };

// Controlled form used for both adding and editing a book.
export default function BookForm({ initialBook, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const editing = Boolean(initialBook);

  useEffect(() => {
    setForm(initialBook ? { ...initialBook, quantity: String(initialBook.quantity) } : EMPTY);
    setErrors({});
  }, [initialBook]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.author.trim()) e.author = 'Author is required';
    if (!form.genre.trim()) e.genre = 'Genre is required';
    if (!/^[0-9-]{10,17}$/.test(form.isbn.trim())) e.isbn = 'ISBN must be 10–13 digits (hyphens allowed)';
    if (form.quantity === '' || !Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 0)
      e.quantity = 'Quantity must be a whole number, 0 or more';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    const ok = await onSubmit({ ...form, quantity: Number(form.quantity) });
    if (ok && !editing) setForm(EMPTY);
  };

  const field = (name, label, type = 'text') => (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} value={form[name]} onChange={handleChange}
             min={type === 'number' ? 0 : undefined} className={errors[name] ? 'invalid' : ''} />
      {errors[name] && <small className="error-text">{errors[name]}</small>}
    </div>
  );

  return (
    <form className="card form-grid" onSubmit={handleSubmit} noValidate>
      <h3 className="full">{editing ? 'Update Book' : 'Add New Book'}</h3>
      {field('title', 'Title')}
      {field('author', 'Author')}
      {field('genre', 'Genre')}
      {field('isbn', 'ISBN')}
      {field('quantity', editing ? 'Quantity' : 'Initial Quantity', 'number')}
      <div className="form-actions full">
        <button className="btn btn-primary" type="submit">{editing ? 'Save Changes' : 'Add Book'}</button>
        {editing && <button className="btn" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
