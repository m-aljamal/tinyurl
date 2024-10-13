"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

function SingOut() {
  const router = useRouter();
  function handleSignOut() {
    signOut();
    router.push("/");
  }
  return <button onClick={handleSignOut}>Sign Out</button>;
}

export default SingOut;
