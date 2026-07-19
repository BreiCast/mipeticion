# MiPeticion

**Ejerce tu derecho de petición sin abogado.** MiPeticion convierte el problema de una persona
(en lenguaje natural) en un **derecho de petición formal y correcto**, listo para revisar, firmar,
descargar en PDF y radicar. Hace seguimiento del término legal y —si la entidad no responde a
tiempo— prepara un borrador de acción de tutela.

> El derecho de petición (art. 23 de la Constitución Política; Ley 1755 de 2015) permite a
> cualquier persona exigir a una entidad pública una respuesta en un plazo legal. El problema no
> es el derecho: es que la gente no sabe redactarlo, a qué entidad dirigirlo, qué tipo elegir ni
> cómo hacerle seguimiento. MiPeticion resuelve exactamente eso.

**MVP actual:** una sola entidad, la **DIAN** (Dirección de Impuestos y Aduanas Nacionales), y un
flujo individual. La arquitectura está pensada para crecer a **cualquier entidad pública de
Colombia** (ver [Visión a futuro](#-visión-a-futuro-de-la-dian-a-cualquier-entidad-pública)).

> ⚠️ **MiPeticion no es asesoría legal.** Es una herramienta que ayuda a redactar; la persona
> revisa, firma y radica. Nunca radicamos en nombre de nadie.

---

## Estado actual

Incrementos 0–2 **completos y verificados de extremo a extremo** (generar → editar → PDF):

| Área | Qué hay | Verificación |
| --- | --- | --- |
| Scaffold | Next.js 16 (App Router) · TypeScript estricto · Tailwind v4 | build/typecheck limpios |
| Motor legal | Festivos de Colombia por algoritmo + términos 10/15/30 días hábiles (Ley 1755/2015) | **19 pruebas Vitest** |
| Capa LLM | Claude (Anthropic) con salida estructurada validada por Zod + *fallback* de plantilla | `POST /api/generate → 200` |
| Flujo `/crear` | Identificación → problema guiado → generación → **preview editable** | recorrido en navegador |
| PDF | `POST /api/pdf` *stateless* con `@react-pdf/renderer` | PDF de 2 páginas válido |
| Contenido legal | Guía de radicación DIAN, política de privacidad (Ley 1581/2012), descargo global | render OK |
| Base de datos | Migración inicial (enums + `profiles`/`petitions`/`filings`/`events` + RLS) | escrita; provisión diferida |

---

## Cómo funciona (flujo del usuario)

1. **Identificación** — nombre, tipo y número de documento, correo, ciudad. (Requisito legal: el
   peticionario debe estar identificado.)
2. **Intake guiado** — categoría del problema, tipo de solicitud, "¿qué pasó?" y "¿qué pides?".
3. **Generación** — la IA redacta un derecho de petición estructurado: encabezado, hechos
   numerados, fundamentos, peticiones concretas, solicitud de respuesta en término legal y datos
   de notificación.
4. **Revisión y edición** en pantalla (todo editable).
5. **Descarga** del PDF (o copiar texto) + **guía para radicar** en la DIAN.
6. *(Próximamente)* Registro del radicado → cálculo del plazo y recordatorios.
7. *(Próximamente)* Si vence sin respuesta → **borrador de acción de tutela**.

Generar, editar y descargar **no requiere cuenta**: el borrador vive en el navegador
(`localStorage`). Solo se pedirá correo (enlace mágico) para **guardar** y activar el seguimiento
del plazo — así se minimiza el almacenamiento de datos personales (Ley 1581/2012).

---

## Stack y arquitectura

- **Next.js 16** (App Router) + **TypeScript estricto** + **Tailwind v4**.
- **Claude (Anthropic)** para la redacción — API key **solo en el servidor**. La capa `src/lib/llm/`
  está abstraída detrás de una interfaz `LLMProvider`; si no hay `ANTHROPIC_API_KEY`, usa un
  generador de plantilla determinística (útil en dev y pruebas).
- **Zod** valida tanto la entrada del intake como la salida del modelo.
- **@react-pdf/renderer** genera el PDF en un route handler *stateless* (recibe el documento en el
  body), de modo que el flujo sin-cuenta también descarga.
- **Supabase** (Auth + Postgres + RLS) para cuentas y seguimiento — *provisión diferida* (ver abajo).

### Principio de diseño: la corrección legal vive en el código, no en el prompt

- El **término legal** (10/15/30 días hábiles) lo fija el **código** según el tipo de solicitud,
  nunca el modelo (`src/lib/legal/constants.ts`, `terminos.ts`).
- Los **días hábiles** excluyen fines de semana y **festivos de Colombia calculados por algoritmo**
  (Pascua + fechas fijas + traslados de la Ley Emiliani) — incluye el nuevo festivo de la **Virgen
  de Chiquinquirá (Ley 2578 de 2026)**, con nota sobre la demanda de inconstitucionalidad pendiente.
- Se distingue **petición** de **denuncia** (no se mezclan) y se mantiene un **descargo** visible en
  toda la app y en el PDF.

### Estructura del proyecto

```
src/
  app/
    page.tsx                 Landing
    crear/                   Flujo principal (3 pasos)
    guia-dian/               Cómo radicar en la DIAN
    privacidad/              Política de tratamiento de datos (Ley 1581/2012)
    api/generate/route.ts    Genera el contenido (server-only, rate-limit)
    api/pdf/route.ts         Renderiza el PDF (stateless)
  components/                UI (chrome, intake, preview editable)
  lib/
    legal/                   festivos.ts · terminos.ts · constants.ts (+ tests)
    llm/                     provider.ts · anthropic.ts · template.ts · prompt.ts
    peticion/                ensamblar.ts · texto.ts · storage.ts
    pdf/                     PeticionPdf.tsx
    schema/                  peticion.ts (Zod)
supabase/migrations/         Esquema inicial + RLS
```

---

## Desarrollo local

**Requisitos:** Node 20+ y npm.

```bash
npm install
cp .env.example .env.local   # opcional: agrega tu ANTHROPIC_API_KEY para usar Claude real
npm run dev                  # http://localhost:3000
```

Sin `ANTHROPIC_API_KEY`, la app funciona con el generador de plantilla. Con la clave, la redacción
usa Claude (`LLM_MODEL`, por defecto `claude-sonnet-5`).

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` / `npm start` | Build de producción y arranque |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Pruebas Vitest (motor legal) |

### Variables de entorno

Ver [`.env.example`](.env.example). Resumen:

- `ANTHROPIC_API_KEY`, `LLM_MODEL` — IA (solo servidor).
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` —
  Supabase (Incremento 3). La `service_role` es **solo servidor**.

---

## Base de datos (Supabase)

La migración inicial está en [`supabase/migrations/`](supabase/migrations/):
enums (`doc_type`, `petition_tipo`, `petition_status`) y tablas `profiles`, `petitions`, `filings`,
`events`, con **RLS** por `auth.uid()` (cada quien solo ve y edita lo suyo).

> **Provisión diferida.** El proyecto Supabase aún no se creó (la organización llegó a su límite de
> proyectos). Cuando haya un cupo, se crea el proyecto, se aplica la migración y se generan los
> tipos TypeScript. La tabla `petitions` ya incluye la columna `entity` (por defecto `'DIAN'`),
> lista para multi-entidad.

---

## Pendiente (roadmap del MVP)

| # | Incremento | Depende de |
| --- | --- | --- |
| 3 | **Auth** (enlace mágico) + guardar/reclamar borrador + *dashboard* de peticiones | Supabase |
| 4 | **Tracker**: registrar radicado + fecha → vencimiento en días hábiles → estado + recordatorios | Supabase |
| 5 | **Borrador de acción de tutela** cuando vence sin respuesta | — (puede ser *stateless*) |
| 6 | **Recordatorios por correo** (cron + proveedor de email) + moderación básica | Supabase |

**Se puede avanzar sin Supabase:** una calculadora de plazo *stateless* (radicado + fecha →
vencimiento, usando el motor legal ya probado) y el borrador de tutela *stateless* (a partir de la
petición + datos de radicación, igual que el PDF).

---

## 🌱 Visión a futuro: de la DIAN a cualquier entidad pública

El objetivo es que MiPeticion sirva para presentar **PQRSD (peticiones, quejas, reclamos,
sugerencias y denuncias) a cualquier entidad pública de Colombia** — alcaldías, gobernaciones,
ministerios, superintendencias, secretarías, entidades de salud, servicios públicos, etc.

**Por qué la base ya lo permite** (mucho es transversal, no específico de la DIAN):

- El **motor de términos** aplica la Ley 1755 de 2015 a *todas* las autoridades públicas: el cálculo
  en días hábiles y festivos ya es genérico.
- La **capa LLM** está abstraída: parametrizar por entidad es cambiar el contexto del prompt.
- El **modelo de datos** ya tiene la columna `entity` en `petitions`.
- El **PDF** y el **borrador de tutela** son genéricos por diseño.

**Qué habría que construir para generalizar:**

1. **Directorio de entidades** — un catálogo (empezando por las de mayor demanda) con: nombre,
   competencia, tipos de solicitud admitidos, canal oficial de radicación (URL del PQRSD) y reglas
   particulares (p. ej. términos o silencios administrativos especiales).
2. **Selección / enrutamiento inteligente** — ayudar a la persona a elegir la entidad correcta
   según su problema (o sugerirla a partir del relato), evitando peticiones mal dirigidas.
3. **Reglas por entidad** — extraer lo hoy "DIAN" (destinatario, guía de radicación, tipos) a
   configuración por entidad; el núcleo legal permanece compartido.
4. **Contenido guiado por categoría y entidad** — plantillas y ejemplos según el tipo de trámite.

**Más allá (fase 2+):**

- **Peticiones colectivas** con firmas (interés general).
- **Auto-ruteo y, eventualmente, radicación asistida** (con poder explícito; nunca en masa).
- **App móvil** y notificaciones push.
- **Panel de seguimiento** de todos los términos activos y su estado.

**Guardrails que se mantienen al crecer:** calidad sobre volumen (una petición bien hecha, no spam),
moderación básica (nada difamatorio ni denuncias falsas), la persona siempre firma y radica, y el
descargo de "no es asesoría legal" siempre visible.

---

## Aviso legal

MiPeticion es una herramienta ciudadana de apoyo. **No constituye asesoría legal** y **no es una
entidad pública**. Verifica y ajusta el contenido antes de firmarlo y radicarlo. La radicación la
realiza la persona directamente ante la entidad correspondiente.
