import { getStore } from "@netlify/blobs";

// POST /api/save-conteos
// Guarda el estado compartido del calendario de conteos y de los checks por
// material (reemplaza la vieja escritura directa a la Netlify Site Metadata
// API, que requería exponer un token en el navegador).
export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const store = getStore({ name: "formulacion", consistency: "strong" });
    await store.setJSON("conteos-meta", body);

    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { "content-type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
};

export const config = { path: "/api/save-conteos" };
