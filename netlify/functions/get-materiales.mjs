import { getStore } from "@netlify/blobs";

// GET /api/get-materiales
// Devuelve el catálogo de materiales publicado para Formulación (si alguien ya
// subió un Excel), junto con el Top 10 de ajustes 701/702 y los conteos físicos
// de MI20 (si vinieron incluidos en esa carga). Si todavía no hay nada publicado,
// devuelve materiales/ajustes/mi20: null y el front usa los datasets de ejemplo
// embebidos en el propio index.html.
export default async (req) => {
  try {
    const store = getStore({ name: "formulacion", consistency: "strong" });
    const materiales = await store.get("materiales", { type: "json" });
    const meta = await store.get("materiales-meta", { type: "json" });
    const ajustes = await store.get("ajustes-top10", { type: "json" });
    const ajustesUsd = await store.get("ajustes-top10-usd", { type: "json" });
    const mi20 = await store.get("mi20-counts", { type: "json" });

    return new Response(
      JSON.stringify({ materiales: materiales || null, meta: meta || null, ajustes: ajustes || null, ajustesUsd: ajustesUsd || null, mi20: mi20 || null }),
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
