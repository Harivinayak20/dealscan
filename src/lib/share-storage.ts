import { getCloudflareContext } from "@opennextjs/cloudflare";

export type SharePayload = {
  score: number;
  verdict: string;
  vehicle: string;
  summary: string;
  reasons: string[];
  analysisMode: "groq" | "gemini" | "local";
  askingPrice: number | null;
  fairValueLow: number | null;
  fairValueHigh: number | null;
  suggestedOfferLow: number | null;
  suggestedOfferHigh: number | null;
  mileage: number | null;
};

export type ShareRecord = {
  token: string;
  payload: SharePayload;
  createdAt: number;
  expiresAt: number;
};

const RETENTION_DAYS = 90;
const TOKEN_BYTES = 24;
const SECRET_BYTES = 16;
export const MAX_REASONS = 3;
export const MAX_REASON_LENGTH = 120;
export const MAX_SUMMARY_LENGTH = 240;
export const MAX_VEHICLE_LENGTH = 100;

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_PATTERN = /(?<!\d)(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}(?!\d)/g;
const VIN_PATTERN = /\b[A-HJ-NPR-Z0-9]{17}\b/gi;
const URL_PATTERN = /https?:\/\/\S+/gi;

function generateToken(): string {
  const bytes = new Uint8Array(TOKEN_BYTES);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function generateDeletionSecret(): string {
  const bytes = new Uint8Array(SECRET_BYTES);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hashSecret(secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(secret);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer), (b) => b.toString(16).padStart(2, "0")).join("");
}

function sanitizeText(value: string, maxLength: number): string {
  return value
    .replace(EMAIL_PATTERN, "[redacted]")
    .replace(PHONE_PATTERN, "[redacted]")
    .replace(VIN_PATTERN, "[redacted]")
    .replace(URL_PATTERN, "[redacted]")
    .replace(/[<>"']/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength)
    .trim();
}

export function sanitizeReason(reason: string): string {
  return sanitizeText(reason, MAX_REASON_LENGTH);
}

export function sanitizeSummary(summary: string): string {
  return sanitizeText(summary, MAX_SUMMARY_LENGTH);
}

export function sanitizeVehicle(vehicle: string): string {
  return sanitizeText(vehicle, MAX_VEHICLE_LENGTH);
}

export function verdictForScore(score: number): string {
  if (score >= 85) return "Great Deal";
  if (score >= 70) return "Decent Deal";
  if (score >= 55) return "Proceed with Caution";
  if (score >= 40) return "Red Flags Present";
  return "Avoid";
}

function isNullableAmount(value: unknown): value is number | null {
  return value === null || (typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 10_000_000);
}

export function validatePayload(payload: unknown): payload is SharePayload {
  if (!payload || typeof payload !== "object") return false;
  const p = payload as Record<string, unknown>;
  if (typeof p.score !== "number" || !Number.isInteger(p.score) || p.score < 0 || p.score > 100) return false;
  if (p.verdict !== verdictForScore(p.score)) return false;
  if (typeof p.vehicle !== "string" || p.vehicle.length === 0 || p.vehicle.length > MAX_VEHICLE_LENGTH) return false;
  if (typeof p.summary !== "string" || p.summary.length === 0 || p.summary.length > MAX_SUMMARY_LENGTH) return false;
  if (!Array.isArray(p.reasons) || p.reasons.length === 0 || p.reasons.length > MAX_REASONS) return false;
  if (!p.reasons.every((r) => typeof r === "string" && r.length > 0 && r.length <= MAX_REASON_LENGTH)) return false;
  if (!["groq", "gemini", "local"].includes(p.analysisMode as string)) return false;
  if (![p.askingPrice, p.fairValueLow, p.fairValueHigh, p.suggestedOfferLow, p.suggestedOfferHigh, p.mileage].every(isNullableAmount)) return false;
  return true;
}

async function getDB(): Promise<D1Database | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return env.DB ?? null;
  } catch {
    return null;
  }
}

export async function createShare(payload: SharePayload): Promise<{ token: string; deletionSecret: string; expiresAt: number } | null> {
  if (!validatePayload(payload)) return null;

  const db = await getDB();
  if (!db) return null;

  const token = generateToken();
  const deletionSecret = generateDeletionSecret();
  const deletionSecretHash = await hashSecret(deletionSecret);
  const now = Date.now();
  const expiresAt = now + RETENTION_DAYS * 86400000;

  const sanitizedPayload: SharePayload = {
    ...payload,
    vehicle: sanitizeVehicle(payload.vehicle),
    summary: sanitizeSummary(payload.summary),
    reasons: payload.reasons.map(sanitizeReason),
  };
  if (!validatePayload(sanitizedPayload)) return null;

  try {
    await db.prepare("DELETE FROM shares WHERE expires_at < ?").bind(now).run();
    await db
      .prepare(
        "INSERT INTO shares (token, payload, created_at, expires_at, deletion_secret_hash) VALUES (?, ?, ?, ?, ?)",
      )
      .bind(token, JSON.stringify(sanitizedPayload), now, expiresAt, deletionSecretHash)
      .run();
    return { token, deletionSecret, expiresAt };
  } catch {
    return null;
  }
}

export async function getShare(token: string): Promise<ShareRecord | null> {
  if (!token || token.length !== TOKEN_BYTES * 2) return null;

  const db = await getDB();
  if (!db) return null;

  try {
    const row = await db
      .prepare("SELECT token, payload, created_at, expires_at FROM shares WHERE token = ?")
      .bind(token)
      .first<{ token: string; payload: string; created_at: number; expires_at: number }>();

    if (!row) return null;
    if (row.expires_at < Date.now()) {
      await db.prepare("DELETE FROM shares WHERE token = ?").bind(token).run();
      return null;
    }

    return {
      token: row.token,
      payload: JSON.parse(row.payload) as SharePayload,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
    };
  } catch {
    return null;
  }
}

export async function deleteShare(token: string, deletionSecret: string): Promise<boolean> {
  if (!token || token.length !== TOKEN_BYTES * 2) return false;
  if (!deletionSecret || deletionSecret.length !== SECRET_BYTES * 2) return false;

  const db = await getDB();
  if (!db) return false;

  try {
    const row = await db
      .prepare("SELECT deletion_secret_hash FROM shares WHERE token = ?")
      .bind(token)
      .first<{ deletion_secret_hash: string }>();

    if (!row) return false;

    const providedHash = await hashSecret(deletionSecret);
    if (providedHash !== row.deletion_secret_hash) return false;

    await db.prepare("DELETE FROM shares WHERE token = ?").bind(token).run();
    return true;
  } catch {
    return false;
  }
}

export async function cleanupExpiredShares(): Promise<number> {
  const db = await getDB();
  if (!db) return 0;

  try {
    const result = await db.prepare("DELETE FROM shares WHERE expires_at < ?").bind(Date.now()).run();
    const changes = (result.meta as Record<string, unknown>).changes as number | undefined;
    return changes ?? 0;
  } catch {
    return 0;
  }
}
