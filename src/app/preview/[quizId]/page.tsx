import { validateRequest } from "@/server/auth/validate-request";
import { db } from "@/server/db";
import { questions, quizzes } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import QuestionsList from "./questions-list";

export default async function Page({ params }: { params: { quizId: string } }) {
  const quiz = await db
    .select()
    .from(quizzes)
    .where(eq(quizzes.id, parseInt(params.quizId)))
    .get();

  if (!quiz) {
    return notFound();
  }

  const { user } = await validateRequest();

  if (!user) {
    return notFound();
  }
  if (quiz.createdById !== user.id) {
    return notFound();
  }

  const questionsList = await db
    .select()
    .from(questions)
    .where(eq(questions.quizId, quiz.id));

  return (
    <div className="flex flex-col sm:items-center sm:pt-[20vh]">
      <div className="flex flex-col gap-2">
        <h1 className="sm:text-center text-6xl font-bold">{quiz.name}</h1>
        {quiz.description && (
          <p className="sm:text-center italic">{quiz.description}</p>
        )}
      </div>
      <QuestionsList questions={questionsList} />
    </div>
  );
}
