import { lucia } from "@/server/auth/auth";
import { validateRequest } from "@/server/auth/validate-request";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET() {
  const { session } = await validateRequest();
  if (!session) {
    return new NextResponse(null, { status: 400 });
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/login");
}
