-- Rename agency "clients" to CRM contacts and extend fields (idempotent)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'clients'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'contacts'
  ) THEN
    ALTER TABLE clients RENAME TO contacts;
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'clients'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'contacts'
  ) THEN
    -- Legacy clients table recreated by 001 after migration; contacts is canonical
    DROP TABLE clients;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'contacts' AND column_name = 'contactName'
  ) THEN
    ALTER TABLE contacts RENAME COLUMN "contactName" TO "legacyContactName";
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'contacts' AND column_name = 'contactEmail'
  ) THEN
    ALTER TABLE contacts RENAME COLUMN "contactEmail" TO email;
  END IF;
END $$;

ALTER TABLE contacts ADD COLUMN IF NOT EXISTS "firstName" TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS "lastName" TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS address TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS city TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS state TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS zip TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS "lifecycleStage" TEXT NOT NULL DEFAULT 'New Lead';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS "leadStatus" TEXT NOT NULL DEFAULT 'Open';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS "customerStatus" TEXT NOT NULL DEFAULT 'Prospect';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS "lastContactedAt" TIMESTAMP;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS "lastActivityAt" TIMESTAMP;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS "lastPurchaseAt" TIMESTAMP;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS "totalRevenueCents" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS "productsPurchased" TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS "communicationPreference" TEXT NOT NULL DEFAULT 'email';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS "optInStatus" TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS "leadScore" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS "aiSummary" TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS "recommendedNextAction" TEXT NOT NULL DEFAULT '';

-- Backfill first/last name from legacy fields
UPDATE contacts
SET
  "firstName" = COALESCE(NULLIF(split_part(COALESCE(NULLIF("legacyContactName", ''), name), ' ', 1), ''), name, 'Contact'),
  "lastName" = COALESCE(NULLIF(trim(substring(COALESCE(NULLIF("legacyContactName", ''), name) FROM position(' ' IN COALESCE(NULLIF("legacyContactName", ''), name)) + 1)), ''), '')
WHERE "firstName" = '' OR "firstName" IS NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'activities' AND column_name = 'clientId'
  ) THEN
    ALTER TABLE activities RENAME COLUMN "clientId" TO "contactId";
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'oklch(0.6 0.16 250)',
  description TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS groups (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'audience',
  "isSystem" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_tags (
  "contactId" TEXT NOT NULL,
  "tagId" TEXT NOT NULL,
  "addedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "addedBy" TEXT NOT NULL DEFAULT '',
  PRIMARY KEY ("contactId", "tagId")
);

CREATE TABLE IF NOT EXISTS contact_groups (
  "contactId" TEXT NOT NULL,
  "groupId" TEXT NOT NULL,
  "addedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "addedBy" TEXT NOT NULL DEFAULT '',
  PRIMARY KEY ("contactId", "groupId")
);

CREATE TABLE IF NOT EXISTS deals (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "contactId" TEXT NOT NULL,
  title TEXT NOT NULL,
  "offerInterest" TEXT NOT NULL DEFAULT '',
  stage TEXT NOT NULL DEFAULT 'New Lead',
  "estimatedValueCents" INTEGER NOT NULL DEFAULT 0,
  probability INTEGER NOT NULL DEFAULT 0,
  "nextStep" TEXT NOT NULL DEFAULT '',
  "ownerId" TEXT NOT NULL DEFAULT '',
  "closeDate" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'email',
  status TEXT NOT NULL DEFAULT 'draft',
  goal TEXT NOT NULL DEFAULT '',
  audience TEXT NOT NULL DEFAULT '',
  "groupId" TEXT,
  sequence JSONB NOT NULL DEFAULT '[]',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_actions (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "actorId" TEXT NOT NULL DEFAULT '',
  command TEXT NOT NULL,
  intent TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  preview JSONB NOT NULL DEFAULT '{}',
  result JSONB NOT NULL DEFAULT '{}',
  summary TEXT NOT NULL DEFAULT '',
  reversible BOOLEAN NOT NULL DEFAULT FALSE,
  "undoPayload" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "executedAt" TIMESTAMP,
  "undoneAt" TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workspace_settings (
  "workspaceId" TEXT PRIMARY KEY,
  "businessType" TEXT NOT NULL DEFAULT 'iv-therapy',
  "onboardingComplete" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
