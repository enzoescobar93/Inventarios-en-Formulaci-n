import { getStore } from "@netlify/blobs";

// POST /api/upload-materiales
// Recibe el catálogo ya parseado en el navegador (array de materiales) y lo
// guarda en Netlify Blobs. A partir de ahí, cualquiera que abra el tablero
// (o lo recargue) ve estos mismos datos.
export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json();

    if (!Array.isArray(body.materiales) || body.materiales.length === 0) {
      return new Response(
        JSON.stringify({ error: "Formato inválido: falta el array 'materiales' o está vacío." }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    if (body.materiales.length > 20000) {
      return new Response(
        JSON.stringify({ error: "El archivo tiene demasiadas filas (más de 20.000). Revisá que sea la hoja correcta." }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    const store = getStore({ name: "formulacion", consistency: "strong" });

    await store.setJSON("materiales", body.materiales);
    await store.setJSON("materiales-meta", {
      updatedAt: new Date().toISOString(),
      count: body.materiales.length,
      filename: body.meta && body.meta.filename ? body.meta.filename : null,
      fx: body.meta && body.meta.fx ? body.meta.fx : null,
    });

    if (Array.isArray(body.ajustes) && body.ajustes.length > 0) {
      await store.setJSON("ajustes-top10", body.ajustes);
    }

    return new Response(
      JSON.stringify({ ok: true, count: body.materiales.length }),
      { headers: { "content-type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
};

export const config = { path: "/api/upload-materiales" };
