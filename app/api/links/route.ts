import { auth } from "@/auth";
import { db } from "@/db";
import { links } from "@/db/schemas";
import { eq, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cache } from "react";

const getLinks = cache(async (guestId: string | null) => {
  const session = await auth();

  if (!session?.user?.id && !guestId) {
    return [];
  }
  try {
    return await db
      .select()
      .from(links)
      .where(
        or(
          guestId ? eq(links.guestId, guestId) : undefined,
          session?.user?.id ? eq(links.userId, session.user?.id) : undefined
        )
      );
  } catch (error) {
    throw new Error("Error fetching links");
  }
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const guestId = searchParams.get("guestId");

  try {
    const userLinks = await getLinks(guestId);

    return NextResponse.json(userLinks);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error fetching links",
      },
      {
        status: 500,
      }
    );
  }
}
