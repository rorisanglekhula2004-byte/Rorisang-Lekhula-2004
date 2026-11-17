export default function UserList({ users, currentUserId, onUpdate, onDelete }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Name</th><th>Membership ID</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.membership_id}</td>
              <td><span className={`badge ${u.role === 'admin' ? 'badge-warn' : 'badge-ok'}`}>{u.role}</span></td>
              <td className="actions">
                <button className="btn btn-primary" onClick={() => onUpdate(u)}>Update</button>
                <button className="btn btn-danger" disabled={u.id === currentUserId} onClick={() => onDelete(u)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
