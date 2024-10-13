"use client";
import React, { useEffect, useState } from "react";

type Link = {
  id: string;
  userId: string | null;
  originalUrl: string;
  shortCode: string;
  guestId: string | null;
  createdAt: Date;
};

export default function LinkList() {
  const [userLinks, setUserLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      setLoading(true);
      const guestId = localStorage.getItem("guestId");

      const res = await fetch(
        `/api/links${guestId ? `?guestId=${guestId}` : ""}`
      );

      if (res.ok) {
        setLoading(false);
        const data = await res.json();
        setUserLinks(data);
      }
    };
    fetchLinks();
  }, []);

  return (
    <div className="mt-8">
      <h2>Links History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="flex flex-col gap-8 ">
          {userLinks?.map((link) => (
            <li key={link.id} className="bg-gray-200 ">
              <div>
                <p>Original:</p>
                <a href={link.originalUrl}>{link.originalUrl}</a>
              </div>
              <div>
                <p>Short:</p>
                <a
                  href={`${process.env.NEXT_PUBLIC_BASE_URL}/${link.shortCode}`}
                >{`${process.env.NEXT_PUBLIC_BASE_URL}/${link.shortCode}`}</a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
