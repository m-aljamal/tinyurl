import { db } from "@/db";
import { analytics, links } from "@/db/schemas";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getGeoData } from "@/lib/geolocation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { LinkBreak2Icon } from "@radix-ui/react-icons";
 
async function getUrl(id: string) {
  const [url] = await db
    .select({
      id: links.id,
      shortCode: links.shortCode,
      originalUrl: links.originalUrl,
    })
    .from(links)
    .where(eq(links.shortCode, id));

  if (url) {
    const userLocation = await getGeoData();

    const [existingAnalytics] = await db
      .select({
        clickCount: analytics.clickCount,
        id: analytics.id,
      })
      .from(analytics)
      .where(eq(analytics.linkId, url.id));

    if (existingAnalytics) {
      await db
        .update(analytics)
        .set({
          lastClickedAt: new Date(),
          clickCount: existingAnalytics.clickCount + 1,
          geoData: userLocation,
        })
        .where(eq(analytics.linkId, url.id));
    } else {
      await db.insert(analytics).values({
        linkId: url.id,
        geoData: userLocation,
        lastClickedAt: new Date(),
        clickCount: 1,
      });
    }
  }
  return url;
}

export default async function Page({ params }: { params: { id: string } }) {
  const url = await getUrl(params.id);

  if (url) {
    redirect(url.originalUrl);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Link Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <LinkBreak2Icon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">
            We couldn't find a link associated with the code:
          </p>
          <p className="font-semibold text-gray-800">{params.id}</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">Go to Home Page</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}