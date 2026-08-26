import { z } from "zod";
import {
  createEvaluation,
  createGroup,
  createProject,
  createStage,
  getInitialDataAudit,
  getPlatformData,
  updateGroup,
  updateProject,
  updateStage,
} from "./db";
import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const stageStatus = z.enum(["draft", "active", "completed"]);
const projectStatus = z.enum(["draft", "in_progress", "ready", "presented"]);
const score = z.number().int().min(1).max(4);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  platform: router({
    data: publicProcedure.query(() => getPlatformData()),
    auditInitialData: publicProcedure.query(() => getInitialDataAudit()),
  }),
  stages: router({
    create: publicProcedure.input(z.object({
      name: z.string().trim().min(2).max(120),
      description: z.string().trim().max(2000).optional(),
      status: stageStatus,
      sortOrder: z.number().int().min(0),
    })).mutation(({ input }) => createStage(input)),
    update: publicProcedure.input(z.object({
      id: z.number().int().positive(),
      name: z.string().trim().min(2).max(120),
      description: z.string().trim().max(2000).optional(),
      status: stageStatus,
      sortOrder: z.number().int().min(0),
    })).mutation(({ input }) => updateStage(input)),
  }),
  groups: router({
    create: publicProcedure.input(z.object({
      stageId: z.number().int().positive(),
      className: z.string().trim().min(2).max(40),
      groupNumber: z.number().int().min(1).max(99),
      memberNames: z.array(z.string().trim().min(1).max(150)).max(30),
    })).mutation(({ input }) => createGroup(input)),
    update: publicProcedure.input(z.object({
      id: z.number().int().positive(),
      stageId: z.number().int().positive(),
      className: z.string().trim().min(2).max(40),
      groupNumber: z.number().int().min(1).max(99),
      memberNames: z.array(z.string().trim().min(1).max(150)).max(30),
    })).mutation(({ input }) => updateGroup(input)),
  }),
  projects: router({
    create: publicProcedure.input(z.object({
      groupId: z.number().int().positive(),
      title: z.string().trim().min(2).max(255),
      description: z.string().trim().max(6000).optional(),
      status: projectStatus,
    })).mutation(({ input }) => createProject(input)),
    update: publicProcedure.input(z.object({
      id: z.number().int().positive(),
      title: z.string().trim().min(2).max(255),
      description: z.string().trim().max(6000).optional(),
      status: projectStatus,
    })).mutation(({ input }) => updateProject(input)),
  }),
  evaluations: router({
    create: publicProcedure.input(z.object({
      projectId: z.number().int().positive(),
      evaluatorName: z.string().trim().min(2).max(150),
      contentMastery: score,
      prototyping: score,
      communication: score,
      socialImpact: score,
      observations: z.string().trim().max(4000).optional(),
    })).mutation(({ input }) => createEvaluation(input)),
  }),
});

export type AppRouter = typeof appRouter;
