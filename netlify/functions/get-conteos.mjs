import { getStore } from "@netlify/blobs";

// GET /api/get-conteos
// Devuelve el estado compartido del calendario de conteos y de los checks por
// material. Se devuelve tal cual se guardó (objeto plano con las claves
// conteos_checks_v1 / conteos_material_checks_v1 / conteos_updated), porque
// así es como lo espera el front (reemplaza la vieja Site Metadata API).
export default async (req) => {
  try {
    const store = getStore({ name: "formulacion", consistency: "strong" });
    const meta = await store.get("conteos-meta", { type: "json" });

    return new Response(
      JSON.stringify(meta || {}),
      { headers: { "content-type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
};

export const config = { path: "/api/get-conteos" };
