import { Button } from "@/components/ui/button";
import { validateRequest } from "@/server/validate-request";
import Link from "next/link";

export default async function HomePage() {
  const { user } = await validateRequest();

  return (
    <main className="flex min-h-screen flex-col items-center bg-transparent pt-[20vh]">
      <h1 className="text-6xl font-bold">Квиззи</h1>
      <p className="mt-2 text-3xl">Приложение для составления квизов</p>
      {/* <Button className="mt-4">
        Начать
      </Button> */}
      {user ? (
        <div className="flex gap-2 items-center">
          <p>{user.email}</p>
          <Link href="/logout">
            <Button>Выйти</Button>
          </Link>
        </div>
      ) : (
        <Link href="/login">
          <Button>Войти</Button>
        </Link>
      )}
    </main>
  );
}
