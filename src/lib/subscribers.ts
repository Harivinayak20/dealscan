import { getCloudflareContext } from "@opennextjs/cloudflare";

// Newsletter/email-alert signups. No sending yet — see outreach/newsletter-template.md.

async function getDB(): Promise<D1Database | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return env.DB ?? null;
  } catch {
    return null;
  }
}

export async function addSubscriber(email: string, source: string): Promise<boolean> {
  const db = await getDB();
  if (!db) return false;
  try {
    await db
      .prepare("INSERT OR IGNORE INTO subscribers (email, created_at, source) VALUES (?,?,?)")
      .bind(email.toLowerCase(), Date.now(), source)
      .run();
    return true;
  } catch {
    return false;
  }
}
