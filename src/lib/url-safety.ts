const BLOCKED_HOSTS = new Set(["localhost", "localhost.localdomain", "0.0.0.0"]);

function isBlockedIpv4(hostname: string) {
  const parts = hostname.split(".").map((part) => Number(part));

  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return false;
  }

  const [first, second] = parts;

  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    first === 169 && second === 254 ||
    first === 172 && second >= 16 && second <= 31 ||
    first === 192 && second === 168
  );
}

function isBlockedIpv6(hostname: string) {
  const normalized = hostname.replace(/^\[/, "").replace(/\]$/, "").toLowerCase();

  return normalized === "::1" || normalized.startsWith("fc") || normalized.startsWith("fd") || normalized.startsWith("fe80:");
}

export function parseSafeHttpUrl(value: string) {
  let url: URL;

  try {
    url = new URL(value.trim());
  } catch {
    throw new Error("Enter a valid listing URL.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Listing URL must start with http:// or https://.");
  }

  if (url.username || url.password) {
    throw new Error("Listing URL cannot include embedded credentials.");
  }

  const hostname = url.hostname.toLowerCase();

  if (
    BLOCKED_HOSTS.has(hostname) ||
    hostname.endsWith(".local") ||
    isBlockedIpv4(hostname) ||
    isBlockedIpv6(hostname)
  ) {
    throw new Error("Local and private-network URLs are blocked.");
  }

  return url;
}
