"use client";

import React, { useState } from "react";
import { useLinks } from "./link-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LinkList() {
  const { links, loading } = useLinks();
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );
  const { toast } = useToast();
  const copyToClipboard = async (
    text: string,
    linkId: string,
    type: "original" | "short"
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [`${linkId}-${type}`]: true }));
      toast({
        title: "Copied to clipboard",
        description: `The ${type} URL has been copied to your clipboard.`,
      });
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [`${linkId}-${type}`]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast({
        title: "Copy failed",
        description: "Failed to copy the URL. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-2xl font-bold">Links History</h2>
      {links.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p>No links yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links?.map((link, i) => (
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
                      onClick={() =>
                        copyToClipboard(link.originalUrl, link.id, "original")
                      }
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
      )}
    </div>
  );
}
