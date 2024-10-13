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

const formSchema = z.object({
  url: z.string().url(),
});

interface LinkFormProps {
  session: Session | null;
}

function LinkForm({ session }: LinkFormProps) {
  const { addLink } = useLinks();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });
  const [shortCode, setShortCode] = useState("");

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Url</FormLabel>
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {shortCode && (
        <div>
          <p>
            original Url <span>{form.getValues("url")}</span>
          </p>
          <Link href={`/${shortCode}`} className="text-blue-500 underline">
            {`${process.env.NEXT_PUBLIC_BASE_URL}/${shortCode}`}
          </Link>
        </div>
      )}
    </div>
  );
}

export default LinkForm;
