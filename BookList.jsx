// List of books with Update and Delete buttons (hidden when readOnly).
export default function BookList({ books, onUpdate, onDelete, readOnly = false }) {
  if (!books.length) return <p className="muted">No books yet.</p>;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th><th>Qty</th>
            {!readOnly && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.genre}</td>
              <td>{b.isbn}</td>
              <td>{b.quantity}</td>
              {!readOnly && (
                <td className="actions">
                  <button className="btn btn-primary" onClick={() => onUpdate(b)}>Update</button>
                  <button className="btn btn-danger" onClick={() => onDelete(b)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
