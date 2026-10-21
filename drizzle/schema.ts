import {
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const stages = mysqlTable(
  "stages",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    description: text("description"),
    status: mysqlEnum("status", ["draft", "active", "completed"])
      .default("draft")
      .notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("stages_name_unique").on(table.name)]
);

export const groups = mysqlTable(
  "groups",
  {
    id: int("id").autoincrement().primaryKey(),
    stageId: int("stageId")
      .notNull()
      .references(() => stages.id, { onDelete: "cascade" }),
    className: varchar("className", { length: 40 }).notNull(),
    groupNumber: int("groupNumber").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("groups_stage_class_number_unique").on(
      table.stageId,
      table.className,
      table.groupNumber
    ),
    index("groups_stage_idx").on(table.stageId),
  ]
);

export const members = mysqlTable(
  "members",
  {
    id: int("id").autoincrement().primaryKey(),
    groupId: int("groupId")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 150 }).notNull(),
    isRepresentative: int("isRepresentative").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("members_group_idx").on(table.groupId)]
);

export const projects = mysqlTable(
  "projects",
  {
    id: int("id").autoincrement().primaryKey(),
    groupId: int("groupId")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    articleUrl: varchar("articleUrl", { length: 1000 }),
    presentationUrl: varchar("presentationUrl", { length: 1000 }),
    status: mysqlEnum("status", ["draft", "in_progress", "ready", "presented"])
      .default("draft")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("projects_group_unique").on(table.groupId),
    index("projects_status_idx").on(table.status),
  ]
);

export const evaluations = mysqlTable(
  "evaluations",
  {
    id: int("id").autoincrement().primaryKey(),
    projectId: int("projectId")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    evaluatorName: varchar("evaluatorName", { length: 150 }).notNull(),
    contentMastery: int("contentMastery").notNull(),
    prototyping: int("prototyping").notNull(),
    communication: int("communication").notNull(),
    socialImpact: int("socialImpact").notNull(),
    totalScore: int("totalScore").notNull(),
    observations: text("observations"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    index("evaluations_project_idx").on(table.projectId),
    index("evaluations_created_idx").on(table.createdAt),
  ]
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
