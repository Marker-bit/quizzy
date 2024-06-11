import { validateRequest } from "@/server/auth/validate-request";
import { db } from "@/server/db";
import { quizzes as quizTable } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";
import { Eye, PencilLine } from "lucide-react";
import Link from "next/link";

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
    <div className="mt-2 flex flex-col gap-2">
      {quizzes.map((quiz) => (
        <div
          className="flex flex-col rounded-xl bg-black/5 p-2 sm:w-[30vw]"
          key={quiz.id}
        >
          <p className="text-xl font-bold">{quiz.name || "Без названия"}</p>
          {quiz.description && <p className="text-sm">{quiz.description}</p>}
          <div className="ml-auto flex gap-2">
            <Link href={`/preview/${quiz.id}`}>
              <button className="rounded-xl bg-black/5 p-2 hover:bg-black/10">
                <Eye className="size-4" />
              </button>
            </Link>
            <Link href={`/edit/${quiz.id}`}>
              <button className="rounded-xl bg-black/5 p-2 hover:bg-black/10">
                <PencilLine className="size-4" />
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
