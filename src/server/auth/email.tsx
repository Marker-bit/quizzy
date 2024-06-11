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
  console.log("Sending verification email to " + email);
  console.log("Link: " + verificationLink);
  console.log(env.EMAIL_SERVER_PASSWORD);

  const resend = new Resend(env.EMAIL_SERVER_PASSWORD);

  await resend.emails.send({
    from: "onboarding@markerbit.ru",
    to: email,
    subject: "Авторизация в Квиззи",
    react: <Email url={verificationLink} />,
  });
}
