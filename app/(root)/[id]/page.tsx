import { db } from "@/db";
import { links } from "@/db/schemas";
import { redirect } from "next/navigation";
import React from "react";
import { eq } from "drizzle-orm";

async function page({ params }: { params: { id: string } }) {
  const [url] = await db
    .select({
      originalUrl: links.originalUrl,
    })
    .from(links)
    .where(eq(links.shortCode, params.id));

  if (url) {
    redirect(url.originalUrl);
  }

  return (
    <div>
      <p>Not found with {params.id}</p>
    </div>
  );
}

export default page;
