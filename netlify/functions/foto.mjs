import { photoStore } from "../lib/store.mjs";

const KEY = /^[0-9a-f-]{36}\.(jpg|png|webp)$/;

export default async (req, context) => {
  const key = context.params?.key || "";
  if (!KEY.test(key)) return new Response("No encontrada", { status: 404 });
  const entry = await photoStore().getWithMetadata(key, { type: "arrayBuffer" });
  if (entry === null) return new Response("No encontrada", { status: 404 });
  return new Response(entry.data, {
    headers: {
      "content-type": entry.metadata?.type || "image/jpeg",
      // cada foto tiene un nombre único, así que se puede guardar en caché para siempre
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
};

export const config = { path: "/api/foto/:key", method: "GET" };
