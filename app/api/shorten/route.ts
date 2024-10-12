import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { generateId } from "@/lib/generateId";

const formSchema = z.object({
  url: z.string().url(),
  guestId: z.string().optional(),
});

export async function POST(req: Request) {

  const data = await req.json();

  const result = formSchema.safeParse(data);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.message },
      {
        status: 400,
      }
    );
  }

  const session = await auth();
  const shortCode = generateId();
  console.log("Short code", shortCode);
  

  return NextResponse.json({});
}


