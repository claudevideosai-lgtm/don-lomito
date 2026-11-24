import { getStore } from "@netlify/blobs";

// Consistencia fuerte: lo que se guarda en el panel se ve al instante en la carta.
export const menuStore = () => getStore({ name: "carta", consistency: "strong" });
export const photoStore = () => getStore({ name: "fotos", consistency: "strong" });
