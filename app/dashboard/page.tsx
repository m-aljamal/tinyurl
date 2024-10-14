import { auth } from "@/auth";
import DashboardUI from "@/components/dashboardUI";
import { db } from "@/db";
import { analytics, links } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

async function getUserLinks(userId: string) {
  const userLinks = await db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .leftJoin(analytics, eq(analytics.linkId, links.id));
  return userLinks;
}

async function Dashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const userLinks = await getUserLinks(session.user.id);

  return <DashboardUI initialUserLinks={userLinks} />;
}

export default Dashboard;
