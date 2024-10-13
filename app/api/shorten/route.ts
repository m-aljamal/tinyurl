import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateId } from "@/lib/generateId";
import { db } from "@/db";
import { analytics, links } from "@/db/schemas";

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
    // todo: add analytics Track the number of clicks, geographic location (using IP address geolocation), and referrer for each shortened link.

    // await db.transaction(async (tx) => {
    //   const [link] = await tx
    //     .insert(links)
    //     .values({
    //       userId: session?.user?.id,
    //       guestId: !session ? data.guestId : undefined,
    //       originalUrl: data.url,
    //       shortCode,
    //     })
    //     .returning({ id: links.id });
    // });

    const [link] = await db
      .insert(links)
      .values({
        userId: session?.user?.id,
        guestId: !session ? data.guestId : undefined,
        originalUrl: data.url,
        shortCode,
      })
      .returning({ id: links.id });

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
