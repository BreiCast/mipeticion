/**
 * Persistencia local del borrador (sin cuenta). El derecho de petición y los
 * datos del intake viven en localStorage hasta que la persona decida guardarlos
 * en una cuenta (Incremento 3). Minimiza el almacenamiento de datos personales
 * en el servidor mientras la persona solo está redactando.
 */
import type { DocType, PetitionTipo } from "@/lib/legal/constants";
import type { GenerateResponse, PeticionDocument } from "@/lib/schema/peticion";

const KEY = "mipeticion:borrador:v1";

export interface IdentificacionData {
  nombre: string;
  docType: DocType;
  docNumber: string;
  correo: string;
  ciudad: string;
  direccionNotificacion: string;
}

export interface ProblemaData {
  categoria: string;
  tipoSugerido: PetitionTipo;
  quePaso: string;
  quePides: string;
  aceptaVeracidad: boolean;
  aceptaTratamientoDatos: boolean;
}

export interface Borrador {
  identificacion?: IdentificacionData;
  problema?: ProblemaData;
  documento?: PeticionDocument;
  meta?: GenerateResponse["meta"];
  actualizado: string;
}

export function cargarBorrador(): Borrador | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Borrador) : null;
  } catch {
    return null;
  }
}

export function guardarBorrador(patch: Partial<Borrador>): void {
  if (typeof window === "undefined") return;
  try {
    const actual = cargarBorrador() ?? { actualizado: "" };
    const nuevo: Borrador = {
      ...actual,
      ...patch,
      actualizado: new Date().toISOString(),
    };
    window.localStorage.setItem(KEY, JSON.stringify(nuevo));
  } catch {
    // Almacenamiento no disponible (modo privado / cuota). Se ignora.
  }
}

export function limpiarBorrador(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Se ignora.
  }
}
