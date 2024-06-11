"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-transparent pt-[20vh]">
      <h1 className="text-6xl font-bold">Квиззи</h1>
      <p className="mt-2 text-3xl">Приложение для составления квизов</p>
      <Button className="mt-4" onClick={() => signIn()}>
        Начать
      </Button>
    </main>
  );
}
