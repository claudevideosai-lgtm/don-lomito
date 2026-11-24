import { randomUUID } from "node:crypto";
import { verifyRequest, json, unauthorized } from "../lib/auth.mjs";
import { photoStore } from "../lib/store.mjs";

const TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const MAX = 4 * 1024 * 1024; // límite de Netlify para el cuerpo de una función

export default async (req) => {
  if (!verifyRequest(req)) return unauthorized();
  const type = (req.headers.get("content-type") || "").split(";")[0].trim();
  if (!TYPES[type]) return json({ error: "La foto tiene que ser JPG, PNG o WEBP." }, 415);
  const buf = await req.arrayBuffer();
  if (!buf.byteLength) return json({ error: "La foto está vacía." }, 400);
  if (buf.byteLength > MAX) return json({ error: "La foto es muy pesada (máximo 4 MB)." }, 413);

  const key = `${randomUUID()}.${TYPES[type]}`;
  await photoStore().set(key, buf, { metadata: { type } });
  return json({ url: `/api/foto/${key}` });
};

export const config = { path: "/api/upload", method: "POST" };
