-- Per-user role for RBAC. Existing users default to Admin (they are the
-- workspace owners / early members). Idempotent.
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'Admin';
