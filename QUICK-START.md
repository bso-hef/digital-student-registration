# Quick Start — Testing Guide

This guide gets the application running locally with Docker so you can click
through it. Estimated time: **~10 minutes** including the image build.

> Looking to develop (run from source, hot reload)? See
> [`docs/development/SETUP.md`](./docs/development/SETUP.md) instead.

## Prerequisites

- **Docker** 20.10+ and **Docker Compose** 2.0+ — [install Docker](https://docs.docker.com/get-docker/)

## 1. Configure environment

The stack requires a few secrets — there are **no insecure defaults**. Copy the
env template and fill in the placeholders:

```bash
cp .env.example .env
```

At minimum, set real values for these in `.env`:

| Variable          | What to set it to                                   |
| ----------------- | --------------------------------------------------- |
| `MONGO_USER`      | Any username, e.g. `admin`                          |
| `MONGO_PASSWORD`  | A strong password (no default — required)           |
| `REDIS_PASSWORD`  | A strong password (no default — required)           |
| `NEXTAUTH_SECRET` | A random 64-char string — `openssl rand -base64 48` |
| `APP_PORT`        | Host port to expose (default `3000`)                |

For local testing you can leave the `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_API_URL`
/ `NEXTAUTH_URL` values at `http://localhost:3000`.

## 2. Build the application image

Compose runs a **pre-built** image (`dsr-app:latest`, `pull_policy: never`) — it
does not build on `up`. Build it first:

```bash
# Linux / macOS
./scripts/docker-build.sh

# Windows (PowerShell)
.\scripts\docker-build.ps1
```

## 3. Start the stack

The app services are gated behind Compose **profiles** (`linux` / `windows`), so
you must name one. A bare `docker compose up -d` would start only MongoDB and
Redis.

```bash
# Linux / macOS
docker compose --profile linux up -d

# Windows containers
docker compose --profile windows up -d
```

Check status and wait for the app to become healthy:

```bash
docker compose ps
docker compose --profile linux logs -f app-linux
```

The container serves **HTTP** on port 3000 (TLS is terminated by a reverse proxy
in production — see [`DOCKER.md`](./DOCKER.md)). Open:

➡️ **[http://localhost:3000](http://localhost:3000)**

## 4. Create the first admin account

There are **no hardcoded credentials**. On first launch the app runs a one-time
**setup wizard** to create the initial administrator:

1. You'll be redirected to `/setup`.
2. Create the admin account (name, email, password).
3. Complete setup — you'll land on the admin dashboard.

From there you can log in at `/login` with the credentials you just created.

## 5. Test scenarios

Suggested flows to exercise:

- **Admin dashboard** — drag-and-drop the dashboard widgets; check the stats.
- **Class management** — create a class (grades 1–14), add students.
- **Student onboarding** — open a student's registration link and walk through
  the multi-step onboarding wizard.
- **Data export** — export a class or student list to PDF / Excel / CSV.
- **Bilingual UI** — switch between English and German.
- **Accessibility** — toggle dark mode and the dyslexia-friendly font.

## 6. Stop / reset

```bash
docker compose --profile linux down       # stop, keep data
docker compose --profile linux down -v     # stop AND wipe the database volumes
```

Wiping volumes resets the setup wizard, so you can test the first-run flow again.

## Troubleshooting

| Symptom                            | Fix                                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------------------- |
| Only `mongo` + `redis` start       | You omitted `--profile linux` (or `--profile windows`).                             |
| `image "dsr-app:latest" not found` | Run the build script in step 2 first.                                               |
| `port is already allocated`        | Change `APP_PORT` in `.env`, or free port 3000.                                     |
| App container keeps restarting     | `docker compose --profile linux logs app-linux` — usually a missing/invalid `.env`. |

For more detail see [`DOCKER.md`](./DOCKER.md) and
[`docs/development/TROUBLESHOOTING.md`](./docs/development/TROUBLESHOOTING.md).
