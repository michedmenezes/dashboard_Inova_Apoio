import { describe, expect, it } from "vitest";
import { buildProjectRanking, buildStageMetrics } from "./platformMetrics";

describe("métricas consolidadas da plataforma", () => {
  const stages = [{ id: 1, name: "Feira" }, { id: 2, name: "II Etapa" }];
  const groups = [{ id: 10, stageId: 1 }, { id: 11, stageId: 1 }, { id: 12, stageId: 2 }];
  const projects = [{ id: 100, groupId: 10 }, { id: 101, groupId: 11 }, { id: 102, groupId: 12 }];
  const evaluations = [{ projectId: 100, totalScore: 14 }, { projectId: 100, totalScore: 16 }, { projectId: 102, totalScore: 12 }];

  it("consolida contagens e médias corretas por etapa", () => {
    expect(buildStageMetrics(stages, groups, projects, evaluations)).toEqual([
      expect.objectContaining({ id: 1, groupsCount: 2, projectsCount: 2, evaluationsCount: 2, averageScore: 15 }),
      expect.objectContaining({ id: 2, groupsCount: 1, projectsCount: 1, evaluationsCount: 1, averageScore: 12 }),
    ]);
  });

  it("ordena o ranking por média e ignora projetos sem avaliação", () => {
    const ranking = buildProjectRanking([{ id: 1, averageScore: 12 }, { id: 2, averageScore: null }, { id: 3, averageScore: 15 }]);
    expect(ranking.map((project) => project.id)).toEqual([3, 1]);
  });
});
