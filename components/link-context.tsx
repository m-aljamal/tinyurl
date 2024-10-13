"use client";

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
};

const LinkContext = createContext<LinkContextType | undefined>(undefined);

export function LinkProvider({ children }: { children: React.ReactNode }) {
  const [links, setLinks] = useState<Link[]>([]);

  const addLink = (link: Link) => {
    setLinks((prevLinks) => [link, ...prevLinks]);
  };

  const fetchLinks = async () => {
    const guestId = localStorage.getItem("guestId");
    const res = await fetch(
      `/api/links${guestId ? `?guestId=${guestId}` : ""}`
    );
    if (res.ok) {
      const data = await res.json();
      setLinks(data);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <LinkContext.Provider value={{ links, addLink, fetchLinks }}>
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