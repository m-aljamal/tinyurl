"use client";

import React from "react";
import { useLinks } from "./link-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Link2, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export default function LinkList() {
  const { links, loading } = useLinks();
  const { copiedStates, copyToClipboard } = useCopyToClipboard();

  if (loading) {
    return (
      <div className="mt-8 space-y-4">
        <h2 className="text-2xl font-bold">Links History</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (links.length === 0 && !loading) {
    return (
      <div className="mt-8 space-y-4">
        <h2 className="text-2xl font-bold">Links History</h2>
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center h-40">
            <Link2 className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-600">No links yet</p>
            <p className="text-sm text-gray-400">Your shortened links will appear here</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-2xl font-bold">Links History</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link, i) => (
          <Card key={link.id + i}>
            <CardHeader>
              <CardTitle className="text-lg">Link {i + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold mb-1">Original:</p>
                <div className="flex items-center space-x-2">
                  <a
                    href={link.originalUrl}
                    className="text-blue-500 hover:underline break-all text-sm"
                  >
                    {link.originalUrl}
                  </a>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(link.originalUrl, link.id, "original")}
                    aria-label="Copy original link"
                  >
                    {copiedStates[`${link.id}-original`] ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div>
                <p className="font-semibold mb-1">Short:</p>
                <div className="flex items-center space-x-2">
                  <a
                    href={`${process.env.NEXT_PUBLIC_BASE_URL}/${link.shortCode}`}
                    className="text-blue-500 hover:underline break-all text-sm"
                  >
                    {`${process.env.NEXT_PUBLIC_BASE_URL}/${link.shortCode}`}
                  </a>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      copyToClipboard(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/${link.shortCode}`,
                        link.id,
                        "short"
                      )
                    }
                    aria-label="Copy short link"
                  >
                    {copiedStates[`${link.id}-short`] ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}