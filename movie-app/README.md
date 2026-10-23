# Ethan Vale — Cinema Archive

Full-stack film & TV site: Express + MongoDB + vanilla JS frontend (no build step).

## Setup
```bash
npm install
# edit .env — set MONGO_URI (local or MongoDB Atlas) and JWT_SECRET
npm run seed     # loads 21 titles
npm start        # http://localhost:3000   (npm run dev for auto-reload)
```

## Routes (hash-routed SPA)
`/#/archive` · `/#/home` · `/#/detail?id=shawshank` · `/#/player?id=breakingbad&ep=2` · `/#/search` · `/#/profile`

## API
- `POST /api/auth/register` `{name,email,password}` · `POST /api/auth/login` · `GET /api/auth/me`
- `GET /api/titles` · `GET /api/titles/:id` · `GET /api/titles/search?q=&genre=&type=&year=`
- *(Bearer token)* `GET /api/user/watchlist` · `POST /api/user/watchlist/:id` (toggle) · `GET /api/user/history` · `POST /api/user/history/:id`

## Deploy
Render/Railway/Fly: set `MONGO_URI`, `JWT_SECRET`; build `npm install && npm run seed`; start `npm start`.
