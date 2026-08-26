import { calculateAverageScore } from "./score";

type StageBase = { id: number };
type GroupBase = { id: number; stageId: number };
type ProjectBase = { id: number; groupId: number };
type EvaluationBase = { projectId: number; totalScore: number };

export function buildStageMetrics<TStage extends StageBase, TGroup extends GroupBase, TProject extends ProjectBase, TEvaluation extends EvaluationBase>(
  stages: TStage[],
  groups: TGroup[],
  projects: TProject[],
  evaluations: TEvaluation[],
) {
  return stages.map((stage) => {
    const stageGroups = groups.filter((group) => group.stageId === stage.id);
    const groupIds = new Set(stageGroups.map((group) => group.id));
    const stageProjects = projects.filter((project) => groupIds.has(project.groupId));
    const projectIds = new Set(stageProjects.map((project) => project.id));
    const stageScores = evaluations.filter((evaluation) => projectIds.has(evaluation.projectId)).map((evaluation) => evaluation.totalScore);
    return {
      ...stage,
      groupsCount: stageGroups.length,
      projectsCount: stageProjects.length,
      evaluationsCount: stageScores.length,
      averageScore: calculateAverageScore(stageScores),
    };
  });
}

export function buildProjectRanking<TProject extends { averageScore: number | null }>(projects: TProject[]) {
  return projects.filter((project) => project.averageScore !== null).sort((a, b) => (b.averageScore ?? 0) - (a.averageScore ?? 0));
}
