/**
 * One-time secure admin seed.
 *
 * Public registration can only ever create customers. This script creates the
 * admin account from environment variables and then promotes it in MongoDB.
 *
 * Usage: npm run seed:admin
 */
import { MongoClient } from "mongodb"
import { auth } from "../lib/auth.ts"

const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD
const name = process.env.ADMIN_NAME || "SalonBook Administrator"

if (!email || !password) {
  console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env")
  process.exit(1)
}
if (password.length < 6) {
  console.error("ADMIN_PASSWORD must be at least 6 characters")
  process.exit(1)
}

try {
  await auth.api.signUpEmail({
    body: { name, email, password },
  })
  console.log(`Created account for ${email}`)
} catch (error) {
  const message =
    (error as { body?: { message?: string } })?.body?.message ||
    (error as Error)?.message ||
    "unknown error"
  if (/already exists/i.test(message)) {
    console.log(`Account for ${email} already exists — promoting it to admin.`)
  } else {
    console.warn(`Sign-up warning: ${message}`)
  }
}

const client = new MongoClient(process.env.DB_URI as string)
try {
  await client.connect()
  const db = client.db(process.env.DB_NAME || "SalonBook")
  const result = await db
    .collection("user")
    .updateOne({ email }, { $set: { role: "admin", isBlocked: false } })

  if (!result.matchedCount) {
    console.error(`No user found for ${email}. Admin seed failed.`)
    process.exitCode = 1
  } else {
    console.log(`Admin role assigned to ${email}`)
    console.log("You can now sign in with the ADMIN_EMAIL / ADMIN_PASSWORD credentials.")
  }
} finally {
  await client.close()
}

process.exit(0)
