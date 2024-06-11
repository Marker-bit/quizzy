"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/server/actions";

export default function LoginPage() {
  return (
    <div className="flex justify-center pt-[20vh]">
      <div className="flex flex-col gap-2 rounded-xl border bg-white p-4 shadow-md">
        <h1 className="text-3xl font-bold">Вход</h1>
        <p>Вам на почту придёт ссылка для авторизации.</p>
        <form action={login} method="post">
          <Label htmlFor="email">Почта</Label>
          <Input type="email" id="email" name="email" />
          <Button type="submit">Войти</Button>
        </form>
      </div>
    </div>
  );
}
