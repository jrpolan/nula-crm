-- Lead Integration module, Phase 2: segmentation / routing rules. Idempotent.
CREATE TABLE IF NOT EXISTS lead_routing_rules (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  name TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  conditions JSONB NOT NULL DEFAULT '{}',
  actions JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lead_routing_rules_workspace_idx
  ON lead_routing_rules ("userId", priority);
