# Library Management System (BIWA2110 – Web Application Development)

React (Vite) frontend + Express backend + MySQL database.

## Features
- **Books**: add / update / delete (title, author, genre, ISBN, quantity)
- **Availability**: stock tracking; dashboard highlights books with fewer than 2 copies
- **Transactions**: add stock (new arrivals) and borrow (deducts stock) with a history log;
  stock updates run inside a database transaction and cannot go below zero
- **Users**: login, add / update / delete users (name, membership ID, role, password – hashed with bcrypt)
- **React**: hooks (`useState`, `useEffect`, `useCallback`, `useContext`), reusable components,
  controlled forms with validation, React Router, Fetch API

## Setup

### 1. Database
```bash
mysql -u root -p < backend/schema.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env      # edit DB_PASSWORD etc.
npm install
npm run seed              # creates admin + sample books
npm start                 # http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

**Default login:** Membership ID `ADMIN001`, password `admin123`

## API
| Method | Route | Purpose |
|---|---|---|
| GET/POST | `/books` | list / create |
| GET/PUT/DELETE | `/books/:id` | read / update / delete |
| GET/POST | `/users` | list / create |
| PUT/DELETE | `/users/:id` | update / delete |
| POST | `/users/login` | login |
| GET/POST | `/transactions` | history / record ADD_STOCK or BORROW |

## Structure
```
backend/   server.js, db.js, schema.sql, seed.js, routes/{books,users,transactions}.js
frontend/  src/{api.js, App.jsx, context/, components/, pages/, styles.css}
```
