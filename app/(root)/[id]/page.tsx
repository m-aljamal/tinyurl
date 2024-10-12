import { redirect } from "next/navigation";
import React from "react";
function page({ params }: { params: { id: string } }) {
  const url =
    "https://river-impala-a85.notion.site/Challenge-Link-Shortener-with-Analytics-and-Guest-User-Tracking-1188713afe5f803d88dae2f365651a1b";
  if (params.id === "short") {
    redirect(url);
  }

  return (
    <div>
      <p>Not found with {params.id} </p>
    </div>
  );
}

export default page;
