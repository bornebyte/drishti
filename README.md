# Drishti Factory Safety Monitoring System

Phase 1 foundation for a production-grade factory safety platform built for Indian factories. This repo contains:

- `frontend/`: Next.js 14 admin dashboard and worker-facing mobile complaint app
- `backend/`: Flask API, Flask-SocketIO realtime alerts, Celery task stubs, and storage/auth service wiring
- `docker-compose.yml`: local Redis, backend, and frontend setup

## Phase 1 scope

Implemented:

- Admin dashboard for incidents, employees, cameras, zones, alerts, media, reports, and settings
- Worker mobile flow for voice complaint submission with native-script language selector
- JWT auth skeleton with refresh token storage in Redis and cookie support
- Role-based access control, rate limiting, consistent API envelopes, soft deletes, audit logs
- Camera heartbeat endpoints, offline camera detection, phone camera registration token and QR generation
- Realtime high/critical alerts over WebSocket
- R2 presign service wiring with safe local fallback
- D1 and Redis service wrappers with development fallback paths
- Celery task enqueue flow for frame and audio jobs

Intentionally stubbed for Phase 2:

- `backend/app/services/ai_service.py`
- Actual frame analysis and audio processing task bodies
- AI analysis cards in incident detail UI
- Transcript, translation, and structured report results in report UI

## Local setup

### Option 1: Docker Compose

1. Copy environment examples if you want custom values.
2. Start services:

```bash
docker compose up --build
```

3. Open:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api/v1/health`

### Option 2: Manual development

Backend:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python run.py
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Seed login

- Email: `admin@drishti.local`
- Password: `password123`

## API conventions

Every API response follows:

```json
{
  "success": true,
  "data": {},
  "message": "",
  "pagination": null
}
```

## Important implementation notes

- The Flask backend uses an in-memory fallback store in development when D1 is not configured, so the UI can still function locally.
- R2 upload and download flows rely on presigned URLs. Raw storage credentials are never intended for frontend use.
- Public and auth-sensitive endpoints are rate-limited.
- Most destructive actions are soft deletes. Super admin hard-delete flows are not implemented in Phase 1.
- The frontend includes fallback data so page rendering remains stable even if the backend is offline during design/development.

## Suggested next Phase 2 work

1. Replace `ai_service.py` stubs with Whisper, GPT-4o, YOLOv8, and Gemini integrations.
2. Persist all repositories to D1 instead of the in-memory fallback store.
3. Move camera frame ingestion to a dedicated streaming/worker path.
4. Add full file upload and playback flows around R2 presigned uploads in the frontend.
5. Expand tests for auth, RBAC, media validation, and optimistic UI rollback paths.
