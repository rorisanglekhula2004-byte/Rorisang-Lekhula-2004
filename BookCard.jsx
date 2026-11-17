export const LOW_STOCK_LIMIT = 2; // fewer than 2 copies = low stock

export default function BookCard({ book }) {
  const low = book.quantity < LOW_STOCK_LIMIT;
  return (
    <div className={`card book-card ${low ? 'low' : ''}`}>
      <h4>{book.title}</h4>
      <p className="muted">{book.author} · {book.genre}</p>
      <p className="muted small">ISBN: {book.isbn}</p>
      <div className="stock-row">
        <span className={`badge ${low ? 'badge-danger' : 'badge-ok'}`}>
          {book.quantity === 0 ? 'Out of stock' : low ? 'Low stock' : 'In stock'}
        </span>
        <strong>{book.quantity} copies</strong>
      </div>
    </div>
  );
}
