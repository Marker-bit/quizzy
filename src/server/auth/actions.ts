"use server";

import { redirect } from "next/navigation";
import { signIn } from "./auth";
import { env } from "@/env";

export async function login(formData: FormData) {
  "use server";
  const email = formData.get("email");
  console.log(formData, email);
  if (!email) return;
  if (typeof email !== "string") return;
  if (!email.includes("@") || !email.includes(".")) return;

  await signIn(email, env.HOST);
  return redirect("/login/email-sent");
}
