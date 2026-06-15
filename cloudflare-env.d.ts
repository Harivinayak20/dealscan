// Minimal, hand-written Cloudflare binding types.
//
// We intentionally do NOT use the full `wrangler types` output here: that file
// declares the entire Workers runtime in the global scope, which collides with
// `lib: ["dom"]` and breaks client components (fetch/Response/Element.append).
// This file only declares the D1 surface we actually use, plus the DB binding.
//
// NOTE: do not run `npm run cf-typegen` - it overwrites this file with the
// colliding full runtime types. Edit this by hand if bindings change.

interface D1Result<T = Record<string, unknown>> {
  results: T[];
  success: boolean;
  meta: Record<string, unknown>;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  first<T = unknown>(colName?: string): Promise<T | null>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = Record<string, unknown>>(statements: D1PreparedStatement[]): Promise<Array<D1Result<T>>>;
  exec(query: string): Promise<unknown>;
}

interface CloudflareEnv {
  DB: D1Database;
}
