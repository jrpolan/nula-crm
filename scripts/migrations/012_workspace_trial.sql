-- 7-day trial: track plan + trial expiry per workspace. Idempotent.
ALTER TABLE workspace_settings ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'trial';
ALTER TABLE workspace_settings ADD COLUMN IF NOT EXISTS "trialEndsAt" TIMESTAMP;

-- Backfill existing trial workspaces with a fresh 7-day window so no one is
-- locked out the moment this ships.
UPDATE workspace_settings
  SET "trialEndsAt" = NOW() + INTERVAL '7 days'
  WHERE "trialEndsAt" IS NULL AND plan = 'trial';
