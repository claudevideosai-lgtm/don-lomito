import { createHmac, timingSafeEqual } from "node:crypto";

const HOURS = 12;

const env = (k) => (globalThis.Netlify?.env?.get(k) ?? process.env[k] ?? "");

export function credentials() {
  return { user: env("ADMIN_USER"), pass: env("ADMIN_PASSWORD") };
}

// La clave de firma cambia si cambia la contraseña: así se cierran todas las sesiones viejas.
function secret() {
  const { user, pass } = credentials();
  return env("SESSION_SECRET") || `${user}|${pass}|carta-admin`;
}

const b64 = (buf) => Buffer.from(buf).toString("base64url");

function sign(payload) {
  return b64(createHmac("sha256", secret()).update(payload).digest());
}

export function safeEqual(a, b) {
  const A = Buffer.from(String(a));
  const B = Buffer.from(String(b));
  if (A.length !== B.length) {
    timingSafeEqual(A, A); // mismo tiempo aunque el largo no coincida
    return false;
  }
  return timingSafeEqual(A, B);
}

export function createToken(user) {
  const payload = b64(JSON.stringify({ u: user, exp: Date.now() + HOURS * 3600 * 1000 }));
  return `${payload}.${sign(payload)}`;
}

export function verifyRequest(req) {
  const { user, pass } = credentials();
  if (!user || !pass) return false;
  const h = req.headers.get("authorization") || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : "";
  const [payload, sig] = token.split(".");
  if (!payload || !sig || !safeEqual(sig, sign(payload))) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return data.u === user && typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

export const unauthorized = () => json({ error: "Tu sesión venció. Volvé a ingresar." }, 401);
