// Creates a default admin and sample books. Run once: npm run seed
const bcrypt = require('bcryptjs');
const pool = require('./db');

(async () => {
  const hash = await bcrypt.hash('admin123', 10);
  await pool.query(
    `INSERT IGNORE INTO users (name, membership_id, role, password_hash) VALUES (?,?,?,?)`,
    ['Administrator', 'ADMIN001', 'admin', hash]
  );
  const books = [
    ['Things Fall Apart', 'Chinua Achebe', 'Fiction', '9780385474542', 5],
    ['Clean Code', 'Robert C. Martin', 'Technology', '9780132350884', 1],
    ['Atomic Habits', 'James Clear', 'Self-help', '9780735211292', 3],
  ];
  for (const b of books) {
    await pool.query(
      `INSERT IGNORE INTO books (title, author, genre, isbn, quantity) VALUES (?,?,?,?,?)`, b);
  }
  console.log('Seeded. Login -> membership ID: ADMIN001 / password: admin123');
  process.exit(0);
})();
