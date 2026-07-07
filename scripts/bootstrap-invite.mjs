import crypto from "node:crypto"
import pg from "pg"

const BOOTSTRAP_WORKSPACE_ID = "__bootstrap__"
const INVITE_TTL_DAYS = 14

async function main() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error("DATABASE_URL is required")
    process.exit(1)
  }

  const email = (process.env.BOOTSTRAP_ADMIN_EMAIL ?? process.argv[2] ?? "").trim().toLowerCase()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("Usage: BOOTSTRAP_ADMIN_EMAIL=you@example.com npm run db:bootstrap")
    process.exit(1)
  }

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? process.env.BETTER_AUTH_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  )

  const pool = new pg.Pool({ connectionString: databaseUrl })
  try {
    const existing = await pool.query(
      `SELECT id FROM team_invites WHERE email = $1 AND status = 'Pending' AND "expiresAt" > NOW() LIMIT 1`,
      [email],
    )

    let token
    if (existing.rows[0]?.id) {
      token = existing.rows[0].id
      console.log(`Reusing existing pending invite for ${email}`)
    } else {
      token = `tinv_${crypto.randomBytes(24).toString("hex")}`
      const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000)
      await pool.query(
        `INSERT INTO team_invites (
          id, "workspaceId", email, role, status, "invitedByUserId", "invitedByName", "createdAt", "expiresAt"
        ) VALUES ($1, $2, $3, 'admin', 'Pending', 'bootstrap', 'Nula CRM Setup', NOW(), $4)`,
        [token, BOOTSTRAP_WORKSPACE_ID, email, expiresAt],
      )
      console.log(`Created bootstrap invite for ${email}`)
    }

    console.log("")
    console.log("Accept invite URL:")
    console.log(`${appUrl}/accept-invite/${token}`)
    console.log("")
    console.log("Next: open the URL, create your password, then sign in at /login")
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  console.error("Bootstrap invite failed:", error)
  process.exit(1)
})
