import { getStore } from "@netlify/blobs";

// GET /api/get-materiales
// Devuelve el catálogo de materiales publicado para Formulación (si alguien ya
// subió un Excel). Si todavía no hay nada publicado, devuelve materiales: null
// y el front usa el dataset de ejemplo embebido (BASE) en el propio index.html.
export default async (req) => {
  try {
    const store = getStore({ name: "formulacion", consistency: "strong" });
    const materiales = await store.get("materiales", { type: "json" });
    const meta = await store.get("materiales-meta", { type: "json" });

    return new Response(
      JSON.stringify({ materiales: materiales || null, meta: meta || null }),
      { headers: { "content-type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
};

export const config = { path: "/api/get-materiales" };
