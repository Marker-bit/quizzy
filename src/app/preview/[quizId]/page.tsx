import { validateRequest } from "@/server/auth/validate-request";
import { db } from "@/server/db";
import { questions, quizzes } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import QuestionsList from "./questions-list";

export default async function Page({ params }: { params: { quizId: string } }) {
  const quiz = (
    await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.id, params.quizId))
      .limit(1)
  )[0];

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
        <h1 className="text-6xl font-bold sm:text-center">{quiz.name}</h1>
        {quiz.description && (
          <p className="italic sm:text-center">{quiz.description}</p>
        )}
      </div>
      <QuestionsList questions={questionsList} />
    </div>
  );
}
