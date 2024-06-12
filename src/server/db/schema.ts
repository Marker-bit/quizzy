import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  json,
  pgSchema,
  pgTable,
  pgTableCreator,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

// export const mySchema = pgSchema("public");
export const createTable = pgTableCreator((name) => `quizzy_${name}`);
// export const createTable = pgTable;

export const quizzes = createTable("quiz", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").default(""),
  description: text("description").default(""),
  createdById: text("createdById").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt"),
  isPublic: boolean("isPublic").notNull().default(false),
});

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [quizzes.createdById],
    references: [users.id],
  }),
  questions: many(questions),
}));

export const questions = createTable("question", {
  id: uuid("id").defaultRandom().primaryKey(),
  text: text("text").notNull(),
  imageUrl: text("imageUrl"),
  quizId: uuid("quizId").notNull(),
  answers: json("answers").notNull().$type<
    {
      id: number;
      text: string;
      imageUrl: string | null;
      isCorrect: boolean;
    }[]
  >(),
});

export const questionsRelations = relations(questions, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [questions.quizId],
    references: [quizzes.id],
  }),
}));

export const users = createTable("user", {
  id: text("id").notNull().primaryKey(),
  email: text("email").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  verificationTokens: many(verificationTokens),
}));

export const sessions = createTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const verificationTokens = createTable("verification_tokens", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id").notNull(),
  email: text("email").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const verificationTokensRelations = relations(
  verificationTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [verificationTokens.userId],
      references: [users.id],
    }),
  }),
);
