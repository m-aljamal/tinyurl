import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateId } from "@/lib/generateId";
import { db } from "@/db";
import { analytics, links } from "@/db/schemas";
import { getGeoData } from "@/lib/geolocation";
import { and, eq } from "drizzle-orm";
const formSchema = z.object({
  url: z.string().url(),
  guestId: z.string().optional(),
});

export async function POST(req: Request) {
  const json = await req.json();

  const { data, success, error } = formSchema.safeParse(json);

  if (!success) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 400,
      }
    );
  }

  const session = await auth();
  const shortCode = generateId("tin", { length: 6 });

  try {
    const [link] = await db
      .insert(links)
      .values({
        userId: session?.user?.id,
        guestId: !session ? data.guestId : undefined,
        originalUrl: data.url,
        shortCode,
      })
      .returning({ id: links.id });

    if (session?.user?.id) {
      const [existingLink] = await db
        .select()
        .from(links)
        .where(
          and(
            eq(links.originalUrl, data.url),
            eq(links.userId, session?.user?.id)
          )
        );

      const [existingAnalytic] = await db
        .select()
        .from(analytics)
        .where(
          and(
            eq(analytics.linkId, existingLink?.id),
            eq(analytics.userId, session?.user?.id)
          )
        );

      const userLocation = await getGeoData();
      if (existingAnalytic) {
        await db
          .update(analytics)
          .set({
            clickCount: existingAnalytic?.clickCount
              ? existingAnalytic.clickCount + 1
              : 1,
            geoData: userLocation,
          })
          .where(eq(analytics.id, existingAnalytic.id));
      } else {
        await db.insert(analytics).values({
          linkId: link.id,
          geoData: userLocation,
          clickCount: 1,
          userId: session?.user?.id,
        });
      }
    }

    return NextResponse.json({
      success: true,
      shortCode,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while shortening the link" },
      {
        status: 500,
      }
    );
  }
}
