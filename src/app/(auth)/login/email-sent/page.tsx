import { env } from "@/env";
import { MailCheck } from "lucide-react";

export default function LoginPage() {
  const email = env.EMAIL_FROM;
  return (
    <div className="flex justify-center pt-[20vh]">
      <div className="flex flex-col gap-2 rounded-xl border bg-white p-4 shadow-md">
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <MailCheck className="size-8 text-green-500" />
          Письмо отправлено
        </h1>
        <p>
          Проверьте свою почту, там должно быть письмо от <code>{email}</code>.
        </p>
        <p>Письмо могло попасть в папку &quot;Спам&quot;.</p>
        <p>Вы можете закрыть эту вкладку.</p>
      </div>
    </div>
  );
}
