import { Button } from "@/components/ui/button";
import { validateRequest } from "@/server/auth/validate-request";
import Link from "next/link";
import { Suspense } from "react";
import QuizzesList from "./quizzes-list";
import CreateButton from "./create-button";

export default async function HomePage() {
  const { user } = await validateRequest();

  return (
    <main className="flex min-h-screen flex-col items-center bg-transparent pt-[20vh]">
      <h1 className="text-6xl font-bold">Квиззи</h1>
      <p className="mt-2 text-3xl">Приложение для составления квизов</p>
      {user ? (
        <div className="flex items-center gap-2 rounded-xl border bg-white pl-2 shadow-md mt-4">
          <p>{user.email}</p>
          <Link href="/logout">
            <Button>Выйти</Button>
          </Link>
        </div>
      ) : (
        <Link href="/login" className="mt-4">
          <Button>Войти</Button>
        </Link>
      )}
      <div className="mt-4">
        {user && <CreateButton />}

        <Suspense fallback={<p>Загрузка курсов...</p>}>
          <QuizzesList />
        </Suspense>
      </div>
    </main>
  );
}
