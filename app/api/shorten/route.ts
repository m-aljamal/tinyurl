import { auth } from "@/auth";
import { db } from "@/db";
import { links } from "@/db/schemas";
import { generateId } from "@/lib/generateId";
import { NextResponse } from "next/server";
import { z } from "zod";

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
    await db.insert(links).values({
      userId: session?.user?.id,
      guestId: !session ? data.guestId : undefined,
      originalUrl: data.url,
      shortCode,
    });

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
