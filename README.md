# Next.js Fullstack Template

A modern, scalable fullstack template using:

- **Next.js (App Router)** in `client/`
- **Express + MongoDB** via Mongoose in `server/`
- **Socket.IO** (client & server)
- **Redux** (classic structure with actions/reducers)
- **Material-UI (MUI)**
- **i18n** with `next-i18next`
- **TypeScript (frontend only)**

---

## 📁 Project Structure

```
project-root/
├── client/ # Frontend app (Next.js)
│ ├── public/
│ ├── src/
│ │ ├── app/
│ │ ├── components/
│ │ ├── constants/
│ │ ├── hooks/
│ │ ├── lib/
│ │ ├── locales/
│ │ ├── store/
│ │ ├── theme/
│ │ ├── types/
│ │ └── utils/
│ ├── middleware.ts
│ └── package.json
│
├── server/ # Backend app (Express + Socket.IO + MongoDB)
│ ├── app/
│ │ ├── routes/
│ │ ├── sockets/
│ │ ├── models/
│ │ └── index.js
│ ├── .env
│ └── package.json
│
└── README.md

```

---

## 🧰 Scripts

### In `client/` (Next.js)

```bash
yarn dev          # Start frontend dev server
yarn build        # Build frontend for production
yarn start        # Start frontend server
```

### In `server/` (Express)

```bash
yarn dev          # Start backend dev server with nodemon or ts-node-dev
yarn start        # Start compiled backend (e.g. node dist/index.js)
```

---

## 🌐 Environment Variables

### client/.env.local

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### server/.env

```env
MONGODB_URI=mongodb://localhost:27017/mydb
PORT=3000
```

---

## 🌍 i18n

Localized via `next-i18next` under `client/public/locales/{lang}`. Default: `en`, `de`.

---

## 🧠 Redux

Redux is split by feature (classic structure) under `client/src/store/`:

- `actions/`
- `reducers/`
- `types/`

---

## 🔌 Socket.IO

- Client setup: `client/src/lib/services/socketClient.ts`
- Server events: `server/app/sockets/`

---

## ✅ License

MIT — free to use and modify.
