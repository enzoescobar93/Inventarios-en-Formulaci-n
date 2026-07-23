# Tablero de Inventarios ABC — Formulación (versión segura)

Esta es la misma funcionalidad del tablero que ya tenías (KPIs, clasificación ABC
por dos métodos, alertas, catálogo filtrable, calendario de conteos compartido),
pero con un cambio de fondo:

## Qué cambió y por qué

El archivo original tenía un **token de acceso personal de Netlify escrito directamente
en el HTML** (`NETLIFY_TOKEN` / `CAL_TOKEN`), usado para:
1. Publicar datos nuevos: reescribía el `index.html` entero con los datos actualizados
   y lo desplegaba de nuevo llamando a la API de Netlify desde el navegador.
2. Guardar el estado del calendario de conteos, usando la API de "Site Metadata"
   de Netlify, también desde el navegador.

Como el archivo es público, **cualquiera que abriera "Ver código fuente" podía copiar
ese token** y usarlo para actuar sobre la cuenta de Netlify completa (crear, modificar
o borrar sitios y deploys). El token ya fue revocado manualmente en Netlify.

Esta versión reemplaza esas dos funciones por **Netlify Functions + Netlify Blobs**
(el mismo patrón que se usó en el tablero de Repuestos): el navegador nunca ve ningún
secreto, todo el acceso a Blobs pasa por funciones que corren del lado del servidor.

## Estructura del proyecto

```
formulacion-netlify/
├─ netlify.toml
├─ package.json                    # dependencia @netlify/blobs
├─ public/
│  └─ index.html                   # el tablero completo (mismo diseño y lógica de antes)
└─ netlify/functions/
   ├─ get-materiales.mjs           # GET  /api/get-materiales   → catálogo publicado
   ├─ upload-materiales.mjs        # POST /api/upload-materiales → publica un catálogo nuevo
   ├─ get-conteos.mjs              # GET  /api/get-conteos      → estado del calendario/checks
   └─ save-conteos.mjs             # POST /api/save-conteos     → guarda el calendario/checks
```

## Qué se comporta igual que antes

- Subís el Excel (pestaña "Valorización ABC") o CSV desde "Actualizar datos del mes"
  y se publica automáticamente para todos — ya no hace falta un botón extra de
  "Publicar para todos", ni esperar a que se redespliegue el sitio completo (antes
  tardaba 1-2 minutos vía la API de deploys; ahora es casi instantáneo porque solo
  se guarda un dato en Blobs, no se rearma todo el sitio).
- El calendario de conteos y los checks por material siguen siendo compartidos
  entre todos los que abran el link, igual que antes.
- Todos los filtros, gráficos, tablas y el cálculo de alertas quedaron exactamente
  igual (no se tocó esa lógica).

## Cómo desplegar

Igual que con el tablero de Repuestos — no sirve arrastrar la carpeta a Netlify Drop,
porque necesita instalar `@netlify/blobs` y activar las Functions:

1. Subí esta carpeta completa a un repositorio de GitHub.
2. En Netlify, conectá ese repositorio a tu proyecto existente (o creá uno nuevo):
   **Project configuration → Build & deploy → Continuous deployment → Repository → Link repository.**
3. Build command: vacío · Publish directory: `public`.
4. Deploy.

## Nota sobre los datos ya cargados

El dataset de ejemplo (74 materiales) que tenía el archivo original quedó embebido
en `public/index.html` (variable `BASE`), tal cual estaba, para que el tablero no
se vea vacío hasta que alguien suba el primer Excel real a esta nueva versión.
El calendario de conteos y los checks que ya se habían tildado en la versión vieja
**no se migran automáticamente** (vivían en la Site Metadata del sitio anterior,
protegida por el token que ya revocaste). Si te importa recuperar esos checks,
se puede: creás un token nuevo temporal en Netlify, lo usamos una sola vez para
leer esa metadata guardada, y lo revocás enseguida después. Avisame si querés
hacerlo antes de empezar a usar esta versión nueva.
