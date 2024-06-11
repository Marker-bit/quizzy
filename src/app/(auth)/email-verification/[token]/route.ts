import { lucia } from "@/server/auth";
import { db } from "@/server/db";
import { users, verificationTokens } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { isWithinExpirationDate } from "oslo";

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } },
) {
  const { token } = params;
  console.log("Token: " + token);
  const dbToken = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.id, token));
  if (dbToken.length >= 1) {
    await db.delete(verificationTokens).where(eq(verificationTokens.id, token));
  }

  if (dbToken.length === 0 || !isWithinExpirationDate(dbToken[0]!.expiresAt)) {
    return new Response(null, {
      status: 400,
    });
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, dbToken[0]!.userId))
    .get();
  if (!user || user.email !== dbToken[0]!.email) {
    return new Response(null, {
      status: 400,
    });
  }

  // await lucia.invalidateUserSessions(user.id);

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
}
