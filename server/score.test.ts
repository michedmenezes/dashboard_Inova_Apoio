import { describe, expect, it } from "vitest";
import { calculateAverageScore, calculateTotalScore } from "./score";

describe("regras de avaliação", () => {
  it("soma corretamente os quatro critérios", () => {
    expect(calculateTotalScore({ contentMastery: 4, prototyping: 3, communication: 2, socialImpact: 1 })).toBe(10);
  });

  it("calcula a média com uma casa decimal e trata lista vazia", () => {
    expect(calculateAverageScore([15, 16, 14])).toBe(15);
    expect(calculateAverageScore([])).toBeNull();
  });
});
