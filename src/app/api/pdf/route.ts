import { createElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { PeticionPdf } from "@/lib/pdf/PeticionPdf";
import { rateLimit } from "@/lib/rate-limit";
import { peticionDocumentSchema } from "@/lib/schema/peticion";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "local";
}

export async function POST(req: Request) {
  const rl = rateLimit(`pdf:${clientKey(req)}`, 12);
  if (!rl.ok) {
    return Response.json(
      { error: "Demasiadas descargas. Intenta de nuevo en un momento." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const parsed = peticionDocumentSchema.safeParse((body as { documento?: unknown })?.documento);
  if (!parsed.success) {
    return Response.json({ error: "Documento inválido." }, { status: 400 });
  }

  try {
    const elemento = createElement(PeticionPdf, {
      documento: parsed.data,
    }) as Parameters<typeof renderToBuffer>[0];
    const buffer = await renderToBuffer(elemento);
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="derecho-de-peticion-DIAN.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[pdf] fallo al renderizar", err);
    return Response.json({ error: "No se pudo generar el PDF." }, { status: 500 });
  }
}
