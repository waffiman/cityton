import bcrypt from "bcryptjs";

/**
 * Verify a submitted admin password against ADMIN_PASSWORD_HASH (preferred)
 * or the plaintext ADMIN_PASSWORD fallback. Node-only (bcrypt).
 */
export function verifyAdminPassword(input: string): boolean {
  if (!input) return false;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (hash) return bcrypt.compareSync(input, hash);
  const plain = process.env.ADMIN_PASSWORD;
  if (plain) return input === plain;
  throw new Error("Admin password is not configured (ADMIN_PASSWORD_HASH or ADMIN_PASSWORD).");
}
