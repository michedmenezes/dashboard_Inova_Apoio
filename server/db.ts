import { and, asc, count, eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  evaluations,
  groups,
  InsertUser,
  members,
  projects,
  stages,
  users,
} from "../drizzle/schema";
import { initialGroups } from "./initialData";
import { buildProjectRanking, buildStageMetrics } from "./platformMetrics";
import {
  calculateAverageScore,
  calculateTotalScore,
  type EvaluationScores,
} from "./score";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
let initialDataPromise: Promise<void> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");
  return db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");

  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  values.lastSignedIn = user.lastSignedIn ?? new Date();
  updateSet.lastSignedIn = values.lastSignedIn;
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  await db
    .insert(users)
    .values(values)
    .onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);
  return result[0];
}

export async function ensureInitialData() {
  if (!initialDataPromise) {
    initialDataPromise = (async () => {
      const db = await requireDb();
      const existing = await db.select({ id: groups.id }).from(groups).limit(1);
      if (existing.length > 0) return;

      const stageNames = Array.from(
        new Set(initialGroups.map(group => group.stageName))
      );
      await db.insert(stages).values(
        stageNames.map((name, index) => ({
          name,
          sortOrder: index + 1,
          status: "active" as const,
        }))
      );
      const stageRows = await db.select().from(stages);
      const stageIds = new Map(stageRows.map(stage => [stage.name, stage.id]));

      for (const item of initialGroups) {
        const stageId = stageIds.get(item.stageName);
        if (!stageId) continue;
        await db.insert(groups).values({
          stageId,
          className: item.className,
          groupNumber: item.groupNumber,
        });
        const [group] = await db
          .select({ id: groups.id })
          .from(groups)
          .where(
            and(
              eq(groups.stageId, stageId),
              eq(groups.className, item.className),
              eq(groups.groupNumber, item.groupNumber)
            )
          )
          .limit(1);
        if (!group) continue;
        await db
          .insert(projects)
          .values({
            groupId: group.id,
            title: item.projectTitle,
            status: "draft",
          });
        await db
          .insert(members)
          .values(item.members.map(name => ({ groupId: group.id, name })));
      }
    })();
  }
  await initialDataPromise;
}

export async function getPlatformData() {
  await ensureInitialData();
  const db = await requireDb();
  const [stageRows, groupRows, memberRows, projectRows, evaluationRows] =
    await Promise.all([
      db.select().from(stages).orderBy(asc(stages.sortOrder), asc(stages.name)),
      db
        .select()
        .from(groups)
        .orderBy(asc(groups.className), asc(groups.groupNumber)),
      db.select().from(members).orderBy(asc(members.name)),
      db.select().from(projects).orderBy(asc(projects.title)),
      db.select().from(evaluations).orderBy(asc(evaluations.createdAt)),
    ]);

  const membersByGroup = new Map<number, typeof memberRows>();
  for (const member of memberRows) {
    membersByGroup.set(member.groupId, [
      ...(membersByGroup.get(member.groupId) ?? []),
      member,
    ]);
  }
  const projectByGroup = new Map(
    projectRows.map(project => [project.groupId, project])
  );
  const evaluationsByProject = new Map<number, typeof evaluationRows>();
  for (const evaluation of evaluationRows) {
    evaluationsByProject.set(evaluation.projectId, [
      ...(evaluationsByProject.get(evaluation.projectId) ?? []),
      evaluation,
    ]);
  }
  const stagesById = new Map(stageRows.map(stage => [stage.id, stage]));

  const enrichedGroups = groupRows.map(group => {
    const project = projectByGroup.get(group.id);
    const projectEvaluations = project
      ? (evaluationsByProject.get(project.id) ?? [])
      : [];
    return {
      ...group,
      stage: stagesById.get(group.stageId),
      members: membersByGroup.get(group.id) ?? [],
      project: project
        ? {
            ...project,
            evaluations: projectEvaluations,
            averageScore: calculateAverageScore(
              projectEvaluations.map(evaluation => evaluation.totalScore)
            ),
            criteriaAverage: {
              contentMastery: calculateAverageScore(
                projectEvaluations.map(evaluation => evaluation.contentMastery)
              ),
              prototyping: calculateAverageScore(
                projectEvaluations.map(evaluation => evaluation.prototyping)
              ),
              communication: calculateAverageScore(
                projectEvaluations.map(evaluation => evaluation.communication)
              ),
              socialImpact: calculateAverageScore(
                projectEvaluations.map(evaluation => evaluation.socialImpact)
              ),
            },
          }
        : null,
    };
  });

  const enrichedProjects = enrichedGroups.flatMap(group =>
    group.project ? [{ ...group.project, group }] : []
  );
  const rankedProjects = buildProjectRanking(enrichedProjects);
  const rankedGroups = buildProjectRanking(
    enrichedGroups.flatMap(group =>
      group.project
        ? [
            {
              groupId: group.id,
              className: group.className,
              groupNumber: group.groupNumber,
              stageName: group.stage?.name ?? "Etapa não informada",
              projectTitle: group.project.title,
              evaluationsCount: group.project.evaluations.length,
              averageScore: group.project.averageScore,
            },
          ]
        : []
    )
  );
  const stagesWithMetrics = buildStageMetrics(
    stageRows,
    groupRows,
    projectRows,
    evaluationRows
  );

  return {
    stages: stagesWithMetrics,
    groups: enrichedGroups,
    projects: enrichedProjects,
    rankedProjects,
    rankedGroups,
  };
}

export async function getInitialDataAudit() {
  await ensureInitialData();
  const db = await requireDb();
  const [groupCount, projectCount, memberCount, excludedCount] =
    await Promise.all([
      db.select({ total: count() }).from(groups),
      db.select({ total: count() }).from(projects),
      db.select({ total: count() }).from(members),
      db
        .select({ total: count() })
        .from(groups)
        .where(
          or(like(groups.className, "1ª%"), like(groups.className, "1a%"))
        ),
    ]);
  return {
    groups: groupCount[0]?.total ?? 0,
    projects: projectCount[0]?.total ?? 0,
    members: memberCount[0]?.total ?? 0,
    firstYearGroups: excludedCount[0]?.total ?? 0,
  };
}

export async function createStage(input: {
  name: string;
  description?: string;
  status: "draft" | "active" | "completed";
  sortOrder: number;
}) {
  const db = await requireDb();
  await db.insert(stages).values(input);
}

export async function updateStage(input: {
  id: number;
  name: string;
  description?: string;
  status: "draft" | "active" | "completed";
  sortOrder: number;
}) {
  const db = await requireDb();
  await db
    .update(stages)
    .set({
      name: input.name,
      description: input.description ?? null,
      status: input.status,
      sortOrder: input.sortOrder,
    })
    .where(eq(stages.id, input.id));
}

export async function createGroup(input: {
  stageId: number;
  className: string;
  groupNumber: number;
  memberNames: string[];
}) {
  const db = await requireDb();
  if (!input.memberNames.length)
    throw new Error("Inclua pelo menos um integrante no grupo.");
  const [duplicate] = await db
    .select({ id: groups.id })
    .from(groups)
    .where(
      and(
        eq(groups.stageId, input.stageId),
        eq(groups.className, input.className),
        eq(groups.groupNumber, input.groupNumber)
      )
    )
    .limit(1);
  if (duplicate)
    throw new Error("Já existe um grupo com esta etapa, turma e número.");
  await db
    .insert(groups)
    .values({
      stageId: input.stageId,
      className: input.className,
      groupNumber: input.groupNumber,
    });
  const [group] = await db
    .select({ id: groups.id })
    .from(groups)
    .where(
      and(
        eq(groups.stageId, input.stageId),
        eq(groups.className, input.className),
        eq(groups.groupNumber, input.groupNumber)
      )
    )
    .limit(1);
  if (!group) throw new Error("Não foi possível criar o grupo.");
  if (input.memberNames.length) {
    await db
      .insert(members)
      .values(input.memberNames.map(name => ({ groupId: group.id, name })));
  }
  return group.id;
}

export async function updateGroup(input: {
  id: number;
  stageId: number;
  className: string;
  groupNumber: number;
  memberNames: string[];
}) {
  const db = await requireDb();
  if (!input.memberNames.length)
    throw new Error("Inclua pelo menos um integrante no grupo.");
  const [duplicate] = await db
    .select({ id: groups.id })
    .from(groups)
    .where(
      and(
        eq(groups.stageId, input.stageId),
        eq(groups.className, input.className),
        eq(groups.groupNumber, input.groupNumber)
      )
    )
    .limit(1);
  if (duplicate && duplicate.id !== input.id)
    throw new Error("Já existe um grupo com esta etapa, turma e número.");
  await db
    .update(groups)
    .set({
      stageId: input.stageId,
      className: input.className,
      groupNumber: input.groupNumber,
    })
    .where(eq(groups.id, input.id));
  await db.delete(members).where(eq(members.groupId, input.id));
  if (input.memberNames.length) {
    await db
      .insert(members)
      .values(input.memberNames.map(name => ({ groupId: input.id, name })));
  }
}

export async function createProject(input: {
  groupId: number;
  title: string;
  description?: string;
  articleUrl?: string;
  presentationUrl?: string;
  status: "draft" | "in_progress" | "ready" | "presented";
}) {
  const db = await requireDb();
  const [existingProject] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(eq(projects.groupId, input.groupId))
    .limit(1);
  if (existingProject)
    throw new Error("Este grupo já possui um projeto associado.");
  await db
    .insert(projects)
    .values({
      ...input,
      description: input.description ?? null,
      articleUrl: input.articleUrl || null,
      presentationUrl: input.presentationUrl || null,
    });
}

export async function updateProject(input: {
  id: number;
  title: string;
  description?: string;
  articleUrl?: string;
  presentationUrl?: string;
  status: "draft" | "in_progress" | "ready" | "presented";
}) {
  const db = await requireDb();
  await db
    .update(projects)
    .set({
      title: input.title,
      description: input.description ?? null,
      articleUrl: input.articleUrl || null,
      presentationUrl: input.presentationUrl || null,
      status: input.status,
    })
    .where(eq(projects.id, input.id));
}

export async function createEvaluation(
  input: {
    projectId: number;
    evaluatorName: string;
    observations?: string;
  } & EvaluationScores
) {
  const db = await requireDb();
  await db.insert(evaluations).values({
    ...input,
    observations: input.observations ?? null,
    totalScore: calculateTotalScore(input),
  });
}
