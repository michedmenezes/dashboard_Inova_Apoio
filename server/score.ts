export type EvaluationScores = {
  contentMastery: number;
  prototyping: number;
  communication: number;
  socialImpact: number;
};

export function calculateTotalScore(scores: EvaluationScores) {
  return scores.contentMastery + scores.prototyping + scores.communication + scores.socialImpact;
}

export function calculateAverageScore(scores: number[]) {
  if (scores.length === 0) return null;
  return Number((scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1));
}
