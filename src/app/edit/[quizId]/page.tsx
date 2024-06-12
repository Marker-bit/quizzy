import { db } from "@/server/db";
import { questions, quizzes } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import QuizHeader from "./header";
import { notFound } from "next/navigation";
import Questions from "./questions";

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

  const questionsList = await db
    .select()
    .from(questions)
    .where(eq(questions.quizId, quiz.id));
  return (
    <div className="flex flex-col justify-center pt-[20vh]">
      <QuizHeader quiz={quiz} />
      <Questions questions={questionsList} />
    </div>
  );
}
