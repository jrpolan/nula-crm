# Nula CRM — dedicated Cursor Cloud workspace

Nula CRM runs in its **own** Cursor Cloud environment, separate from VS Spackle.

## Create the environment

1. Open [Cursor Cloud environment setup for Nula CRM](https://cursor.com/onboard?repository=https%3A%2F%2Fgithub.com%2FVandalsSmile%2Fnula-crm)
2. Confirm the repository is **`VandalsSmile/nula-crm`** (not the `vs-spackle` marketing repo)
3. Add secrets:

| Secret | Purpose |
|--------|---------|
| `GH_TOKEN` | GitHub PAT with **Contents: Read and write** on `VandalsSmile/nula-crm` |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Auth secret (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | `https://nula-crm.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | Same as `BETTER_AUTH_URL` |
| `BLOB_READ_WRITE_TOKEN` | Optional — Vercel Blob for uploads |

4. Save the environment and start new agent runs from it.

## What the install hook does

`.cursor/environment.json` runs:

```bash
npm install && bash scripts/ensure-github-auth.sh
```

`scripts/ensure-github-auth.sh` configures git/gh for **`VandalsSmile/nula-crm`** using your `GH_TOKEN`, not `cursor[bot]`.

## Production

- **App:** https://nula-crm.vercel.app/
- **Repo:** https://github.com/VandalsSmile/nula-crm
- **Vercel project:** `nula-crm` (vs-marketing team)

## Migrating from VS Spackle

If you previously worked on Nula inside the VS Spackle workspace:

- All Nula code now lives only in `VandalsSmile/nula-crm`
- Do **not** use `vandalssmile/vs-spackle` branches for Nula work
- Start a **new** Cloud Agent from the Nula environment above
