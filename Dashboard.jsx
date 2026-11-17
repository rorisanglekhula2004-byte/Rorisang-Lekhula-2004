import { useEffect, useState } from 'react';
import { api } from '../api.js';
import BookCard, { LOW_STOCK_LIMIT } from '../components/BookCard.jsx';
import Message from '../components/Message.jsx';

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('cards');

  useEffect(() => {
    api.getBooks().then(setBooks).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const lowStock = books.filter((b) => b.quantity < LOW_STOCK_LIMIT);
  const totalCopies = books.reduce((sum, b) => sum + b.quantity, 0);

  return (
    <section>
      <h2>Dashboard</h2>
      <Message>{error}</Message>
      {loading ? <p>Loading…</p> : (
        <>
          <div className="stats">
            <div className="card stat"><span>{books.length}</span>Titles</div>
            <div className="card stat"><span>{totalCopies}</span>Total copies</div>
            <div className="card stat danger"><span>{lowStock.length}</span>Low stock</div>
          </div>

          {lowStock.length > 0 && (
            <Message type="warning">
              ⚠ Low stock: {lowStock.map((b) => b.title).join(', ')}
            </Message>
          )}

          <div className="toolbar">
            <h3>Book Availability</h3>
            <div>
              <button className={`btn ${view === 'cards' ? 'btn-primary' : ''}`} onClick={() => setView('cards')}>Cards</button>
              <button className={`btn ${view === 'table' ? 'btn-primary' : ''}`} onClick={() => setView('table')}>Table</button>
            </div>
          </div>

          {view === 'cards' ? (
            <div className="grid">{books.map((b) => <BookCard key={b.id} book={b} />)}</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Title</th><th>Author</th><th>Genre</th><th>Available</th></tr></thead>
                <tbody>
                  {books.map((b) => (
                    <tr key={b.id} className={b.quantity < LOW_STOCK_LIMIT ? 'row-low' : ''}>
                      <td>{b.title}</td><td>{b.author}</td><td>{b.genre}</td><td>{b.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
}
