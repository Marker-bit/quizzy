import * as React from "react";
import { Resend } from "resend";
import { Html, Button } from "@react-email/components";
import { env } from "@/env";

function Email({ url }: { url: string }) {
  return (
    <Html lang="en">
      <Button href={url}>Авторизоваться</Button>
    </Html>
  );
}

export async function sendVerificationEmail(
  email: string,
  verificationLink: string,
) {
  const resend = new Resend(env.RESEND_API_KEY);

  await resend.emails.send({
    from: env.EMAIL_FROM,
    to: email,
    subject: "Авторизация в Квиззи",
    react: <Email url={verificationLink} />,
  });
}
