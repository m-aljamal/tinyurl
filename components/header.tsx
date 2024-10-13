import Link from "next/link";
import { auth, signIn } from "@/auth";
import SingOut from "./sing-out";

export default async function Header() {
  const session = await auth();

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Link Shortener
        </Link>
        <div>
          {session?.user?.id ? (
            <>
              <Link href="/dashboard" className="mr-4">
                Dashboard
              </Link>
              <SingOut />
            </>
          ) : (
            <>
              <form
                action={async () => {
                  "use server";
                  await signIn("google", { redirectTo: "/dashboard" });
                }}
              >
                <button type="submit">Sign in</button>
              </form>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
