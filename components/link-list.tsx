"use client";

import React from "react";
import { useLinks } from "./link-context";

export default function LinkList() {
  const { links } = useLinks();

  return (
    <div className="mt-8">
      <h2>Links History</h2>
      {links.length === 0 ? (
        <p>No links yet.</p>
      ) : (
        <ul className="flex flex-col gap-8">
          {links?.map((link, i) => (
            <li key={link.id + i} className="bg-gray-200 p-4 rounded">
              <div>
                <p className="font-semibold">Original:</p>
                <a href={link.originalUrl} className="text-blue-500 break-all">
                  {link.originalUrl}
                </a>
              </div>
              <div className="mt-2">
                <p className="font-semibold">Short:</p>
                <a
                  href={`${process.env.NEXT_PUBLIC_BASE_URL}/${link.shortCode}`}
                  className="text-blue-500"
                >{`${process.env.NEXT_PUBLIC_BASE_URL}/${link.shortCode}`}</a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
