export const AUTH_COOKIE = "taltal_session";

async function hmacHex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function expectedSessionToken(): Promise<string> {
  const secret = process.env.AUTH_SECRET ?? "taltal-fallback-secret";
  const user = process.env.AUTH_USERNAME ?? "dvision";
  return hmacHex(secret, `taltal:${user}`);
}

export function verifyCredentials(username: string, password: string): boolean {
  const u = process.env.AUTH_USERNAME ?? "";
  const p = process.env.AUTH_PASSWORD ?? "";
  return u.length > 0 && p.length > 0 && username === u && password === p;
}
