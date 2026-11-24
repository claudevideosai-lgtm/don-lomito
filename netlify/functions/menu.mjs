import { verifyRequest, json, unauthorized } from "../lib/auth.mjs";
import { menuStore } from "../lib/store.mjs";

const MAX_BYTES = 1024 * 1024; // 1 MB de texto alcanza para cientos de productos

function validMenu(m) {
  if (!m || typeof m !== "object") return "Formato inválido.";
  if (!m.config || typeof m.config !== "object") return "Faltan los datos del local.";
  if (!Array.isArray(m.cats)) return "Faltan las secciones.";
  for (const c of m.cats) {
    if (!c || typeof c.id !== "string" || typeof c.nombre !== "string" || !Array.isArray(c.items)) return "Hay una sección incompleta.";
    for (const i of c.items) {
      if (!i || typeof i.id !== "string" || typeof i.nombre !== "string") return `Hay un producto sin nombre en "${c.nombre}".`;
      if (typeof i.precio !== "number" || !Number.isFinite(i.precio) || i.precio < 0) return `El precio de "${i.nombre}" no es válido.`;
    }
  }
  return null;
}

export default async (req) => {
  const store = menuStore();

  if (req.method === "GET") {
    const data = await store.get("menu", { type: "json" });
    return json({ data: data ?? null });
  }

  if (req.method === "PUT") {
    if (!verifyRequest(req)) return unauthorized();
    const text = await req.text();
    if (text.length > MAX_BYTES) return json({ error: "La carta es demasiado grande." }, 413);
    let menu;
    try { menu = JSON.parse(text); } catch { return json({ error: "Formato inválido." }, 400); }
    const err = validMenu(menu);
    if (err) return json({ error: err }, 400);
    menu.actualizado = new Date().toISOString();
    await store.setJSON("menu", menu);
    return json({ ok: true, actualizado: menu.actualizado });
  }

  return json({ error: "Método no permitido." }, 405);
};

export const config = { path: "/api/menu", method: ["GET", "PUT"] };
