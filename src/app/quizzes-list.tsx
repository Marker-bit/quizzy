import { validateRequest } from "@/server/auth/validate-request";
import { db } from "@/server/db";
import { quizzes as quizTable } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";

export default async function QuizzesList() {
  const { user } = await validateRequest();
  if (!user) {
    return null;
  }

  const quizzes = await db
    .select()
    .from(quizTable)
    .where(eq(quizTable.createdById, user.id))
    .orderBy(desc(quizTable.updatedAt));

  if (quizzes.length === 0) {
    return <p>Нет квизов</p>;
  }

  return (
    <>
      {quizzes.map((quiz) => (
        <p key={quiz.id}>{quiz.name || ""}</p>
      ))}
    </>
  );
}
