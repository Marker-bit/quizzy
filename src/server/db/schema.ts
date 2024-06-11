import { sql } from "drizzle-orm";
import { index, int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `quiz_app_${name}`);

export const quizzes = createTable(
  "quiz",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name", { length: 256 }),
    description: text("description", { length: 256 }),
    createdById: text("createdById", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: int("updatedAt", { mode: "timestamp" }),
    isPublic: int("isPublic", { mode: "boolean" }).notNull().default(false),
  },
  (example) => ({
    createdByIdIdx: index("createdById_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const questions = createTable(
  "question",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    text: text("text", { length: 256 }).notNull(),
    imageUrl: text("imageUrl", { length: 256 }),
    quizId: int("quizId", { mode: "number" })
      .notNull()
      .references(() => quizzes.id),
    answers: text("answers", { mode: "json" }).notNull().$type<
      {
        id: number;
        text: string;
        imageUrl: string | null;
        isCorrect: boolean;
      }[]
    >(),
  },
  (question) => ({
    quizIdIdx: index("quizId_idx").on(question.quizId),
  }),
);

export const users = createTable("user", {
  id: text("id").notNull().primaryKey(),
  email: text("email").notNull(),
});

export const sessions = createTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: int("expires_at").notNull(),
});

export const verificationTokens = createTable("verification_tokens", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  email: text("email").notNull(),
  expiresAt: int("expires_at", { mode: "timestamp" }).notNull(),
});
