import { NextResponse } from 'next/server';
import { terminoDias, tipoLabel } from '@/lib/legal/constants';
import { formatFechaLarga, hoyEnColombia } from '@/lib/legal/date-utils';
import { getLLMProvider } from '@/lib/llm';
import { ensamblarPeticion, resolverTipo } from '@/lib/peticion/ensamblar';
import { rateLimit } from '@/lib/rate-limit';
import {
  generatedContentSchema,
  intakeInputSchema,
  peticionDocumentSchema,
} from '@/lib/schema/peticion';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function clientKey(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  return fwd?.split(',')[0]?.trim() || 'local';
}

export async function POST(req: Request) {
  const rl = rateLimit(`generate:${clientKey(req)}`);
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Intenta de nuevo en un momento.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo de la solicitud inválido.' }, { status: 400 });
  }

  const parsed = intakeInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Datos inválidos.',
        detalles: parsed.error.issues.map((i) => ({
          campo: i.path.join('.'),
          mensaje: i.message,
        })),
      },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const tipo = resolverTipo(input);
  const dias = terminoDias(tipo);
  const ciudadFecha = `${input.peticionario.ciudad}, ${formatFechaLarga(hoyEnColombia())}`;

  const provider = getLLMProvider();
  let content;
  try {
    content = generatedContentSchema.parse(
      await provider.generarContenido({ input, tipo, terminoDias: dias }),
    );
  } catch (err) {
    console.error('[generate] fallo del proveedor', err);
    return NextResponse.json(
      { error: 'No se pudo generar la petición. Intenta de nuevo.' },
      { status: 502 },
    );
  }

  const documento = peticionDocumentSchema.parse(
    ensamblarPeticion({ input, tipo, content, ciudadFecha }),
  );

  return NextResponse.json({
    documento,
    meta: {
      tipo,
      tipoLabel: tipoLabel(tipo),
      terminoDias: dias,
      proveedor: provider.nombre,
    },
  });
}
