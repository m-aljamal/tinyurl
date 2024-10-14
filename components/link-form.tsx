"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Session } from "next-auth";
import { useState } from "react";
import Link from "next/link";
import { useLinks } from "./link-context";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

const formSchema = z.object({
  url: z.string().url(),
});

interface LinkFormProps {
  session: Session | null;
}

export default function LinkForm({ session }: LinkFormProps) {
  const { addLink } = useLinks();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });
  const [shortCode, setShortCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { copiedStates, copyToClipboard } = useCopyToClipboard();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const guestId = localStorage.getItem("guestId") || crypto.randomUUID();
    if (!session) {
      localStorage.setItem("guestId", guestId);
    }
    const res = await fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
        guestId: session ? undefined : guestId,
      }),
    });
    if (res.ok) {
      setLoading(false);
      const data = await res.json();
      setShortCode(data.shortCode);
      addLink({
        id: data.id,
        userId: session?.user?.id || null,
        originalUrl: values.url,
        shortCode: data.shortCode,
        guestId: session ? null : guestId,
      });
      form.reset();
    } else {
      setLoading(false);
      const data = await res.json();
      setError(data.error);
    }
  }

  const handleCopyShortUrl = () => {
    const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${shortCode}`;
    copyToClipboard(shortUrl, shortCode, 'short');
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-4 items-center"
        >
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the URL you want to shorten.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} type="submit">
            {loading && (
              <ReloadIcon
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Create Url
          </Button>
        </form>
      </Form>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {shortCode && (
        <div className="mt-8 flex items-center gap-2">
          <Link href={`/${shortCode}`} className="text-blue-500 underline">
            {`${process.env.NEXT_PUBLIC_BASE_URL}/${shortCode}`}
          </Link>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopyShortUrl}
            className="ml-2"
          >
            {copiedStates[`${shortCode}-short`] ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}