# AI Usage Declaration

| Date | Tool | Purpose of prompt | What I changed / verified myself |
|------|------|-------------------|----------------------------------|
| 2026-11-14 | Claude Code (Claude Opus) | Bring up Docker Compose and debug startup (extra `}` in `nginx.conf`, Mongo healthcheck timeout) | Re-ran `docker compose up --build`; checked `/health`, deep-link refresh, mongo-express auth, persistence after `down`/`up` |
| 2026-11-14 | Claude Code (Claude Opus) | Keep one `backend/.env` for local and Docker (`MONGODB_URI` override in `docker-compose.yml`) | Started the backend both locally and in Docker and confirmed "MongoDB connected" in each |
| 2026-11-14 | Claude Code (Claude Opus) | Adapt the Postman collection to my A1 contract (`data` envelope, `DELETE ?eid=`, standalone rate-limit request) | Ran folders 1–8 (47/47 passing) and folder 9 × 11 (10 × 401 then 429 + `Retry-After`) |
| 2026-11-14 | Claude Code (Claude Opus) | Correct and complete the README (versions, API table, security notes, screenshot table, architecture diagram) | Checked every claim against the code and the running app |

