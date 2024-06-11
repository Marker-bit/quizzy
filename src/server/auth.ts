import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { eq } from "drizzle-orm";
import { Lucia, generateIdFromEntropySize } from "lucia";
import { TimeSpan, createDate } from "oslo";
import { db } from "./db";
import { sessions, users, verificationTokens } from "./db/schema";
import { sendVerificationEmail } from "./email";

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      emailVerified: attributes.email_verified,
      email: attributes.email,
    };
  },
});

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      email: string;
      email_verified: boolean;
    };
  }
}

export async function createEmailVerificationToken(
  userId: string,
  email: string,
): Promise<string> {
  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.userId, userId));
  const tokenId = generateIdFromEntropySize(25); // 40 characters long
  await db.insert(verificationTokens).values({
    id: tokenId,
    userId: userId,
    email,
    expiresAt: createDate(new TimeSpan(2, "h")),
  });
  return tokenId;
}

export async function createAccount(email: string, host: string) {
  const userId = generateIdFromEntropySize(10); // 16 characters long

  await db.insert(users).values({
    id: userId,
    email,
  });

  const verificationToken = await createEmailVerificationToken(userId, email);
  const verificationLink = host + "/email-verification/" + verificationToken;
  await sendVerificationEmail(email, verificationLink);
}

export async function signIn(email: string, host: string) {
  console.log("Signing in " + email);
  const usersList = await db.select().from(users).where(eq(users.email, email));
  if (!usersList.length || !usersList[0]) {
    console.log("User not found");
    await createAccount(email, host);
  } else {
    console.log("User found");
    const userId = usersList[0].id;
    const verificationToken = await createEmailVerificationToken(userId, email);
    const verificationLink = host + "/email-verification/" + verificationToken;
    await sendVerificationEmail(email, verificationLink);
  }
}
