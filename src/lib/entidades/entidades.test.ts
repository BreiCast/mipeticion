import { describe, expect, it } from "vitest";
import {
  DIAN,
  entidadPorDefecto,
  getEntidad,
  listarEntidadesActivas,
  terminoParaEntidad,
} from "./index";
import type { Entidad } from "./types";

describe("directorio de entidades", () => {
  it("resuelve la DIAN por slug y la trae por defecto", () => {
    expect(getEntidad("dian")).toBe(DIAN);
    expect(entidadPorDefecto().slug).toBe("dian");
  });

  it("devuelve undefined para un slug desconocido", () => {
    expect(getEntidad("no-existe")).toBeUndefined();
  });

  it("la DIAN está activa y admite todos los tipos", () => {
    expect(listarEntidadesActivas()).toContain(DIAN);
    expect(DIAN.tiposDisponibles).toContain("peticion_informacion");
    expect(DIAN.tiposDisponibles).toContain("consulta");
  });
});

describe("terminoParaEntidad", () => {
  it("usa el término general de la Ley 1755 cuando no hay excepción", () => {
    expect(terminoParaEntidad(DIAN, "peticion_informacion")).toBe(10);
    expect(terminoParaEntidad(DIAN, "peticion_interes_particular")).toBe(15);
    expect(terminoParaEntidad(DIAN, "consulta")).toBe(30);
  });

  it("respeta la excepción de término de una entidad", () => {
    const conExcepcion: Entidad = {
      ...DIAN,
      slug: "ejemplo",
      terminoOverrides: { peticion_interes_particular: 20 },
    };
    expect(terminoParaEntidad(conExcepcion, "peticion_interes_particular")).toBe(20);
    // Sin override para este tipo, cae al término general.
    expect(terminoParaEntidad(conExcepcion, "peticion_informacion")).toBe(10);
  });
});
