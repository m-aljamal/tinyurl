"use client";

import { useSession } from "next-auth/react";
import React, { createContext, useContext, useState, useEffect } from "react";

type Link = {
  id: string;
  userId: string | null;
  originalUrl: string;
  shortCode: string;
  guestId: string | null;
};

type LinkContextType = {
  links: Link[];
  addLink: (link: Link) => void;
  fetchLinks: () => Promise<void>;
  loading: boolean;
};

const LinkContext = createContext<LinkContextType | undefined>(undefined);

export function LinkProvider({ children }: { children: React.ReactNode }) {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const addLink = (link: Link) => {
    setLinks((prevLinks) => [link, ...prevLinks]);
  };

  const fetchLinks = async () => {
    setLoading(true);
    const guestId = localStorage.getItem("guestId");
    const res = await fetch(
      `/api/links${!session && guestId ? `?guestId=${guestId}` : ""}`
    );
    if (res.ok) {
      setLoading(false);
      const data = await res.json();
      setLinks(data);
    } else {
      setLoading(false);
      setLinks([]);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [session]);

  return (
    <LinkContext.Provider value={{ links, addLink, fetchLinks, loading }}>
      {children}
    </LinkContext.Provider>
  );
}

export function useLinks() {
  const context = useContext(LinkContext);
  if (context === undefined) {
    throw new Error("useLinks must be used within a LinkProvider");
  }
  return context;
}
