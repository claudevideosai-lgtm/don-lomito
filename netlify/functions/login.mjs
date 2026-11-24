import { credentials, createToken, safeEqual, verifyRequest, json, unauthorized } from "../lib/auth.mjs";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export default async (req) => {
  // GET = ¿la sesión guardada sigue siendo válida?
  if (req.method === "GET") return verifyRequest(req) ? json({ ok: true }) : unauthorized();

  const { user, pass } = credentials();
  if (!user || !pass) {
    return json({ error: "Falta configurar ADMIN_USER y ADMIN_PASSWORD en Netlify (Variables de entorno)." }, 500);
  }
  let body;
  try { body = await req.json(); } catch { return json({ error: "Pedido inválido." }, 400); }

  const okUser = safeEqual(String(body?.usuario ?? "").trim(), user);
  const okPass = safeEqual(String(body?.clave ?? ""), pass);
  if (!(okUser && okPass)) {
    await wait(900); // frena intentos de adivinar la contraseña
    return json({ error: "Usuario o contraseña incorrectos." }, 401);
  }
  return json({ token: createToken(user), usuario: user });
};

export const config = { path: "/api/login", method: ["GET", "POST"] };
