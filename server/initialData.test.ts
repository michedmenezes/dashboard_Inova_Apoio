import { describe, expect, it } from "vitest";
import { initialGroups } from "./initialData";

describe("carga inicial da Feira de Tecnologia", () => {
  it("contém cinquenta grupos de 6º, 7º e 8º anos", () => {
    expect(initialGroups).toHaveLength(50);
    expect(new Set(initialGroups.map((group) => `${group.stageName}-${group.className}-${group.groupNumber}`)).size).toBe(50);
  });

  it("não inclui grupos da 1ª série ou da Comunidade Gris", () => {
    const source = JSON.stringify(initialGroups).toLocaleLowerCase("pt-BR");
    expect(source).not.toContain("1ª série");
    expect(source).not.toContain("comunidade gris");
  });

  it("mantém ao menos um integrante em cada grupo importado", () => {
    expect(initialGroups.every((group) => group.members.length > 0)).toBe(true);
  });
});
