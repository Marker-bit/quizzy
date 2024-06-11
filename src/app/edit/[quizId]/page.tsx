import { db } from "@/server/db";
import { quizzes } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import QuizHeader from "./header";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { quizId: string } }) {
  const quiz = await db
    .select()
    .from(quizzes)
    .where(eq(quizzes.id, parseInt(params.quizId)))
    .get();

  if (!quiz) {
    return notFound();
  }
  return (
    <div className="flex flex-col justify-center pt-[20vh]">
      <QuizHeader quiz={quiz} />
    </div>
  );
}
