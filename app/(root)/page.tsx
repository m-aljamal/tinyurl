import { auth } from "@/auth";
import { LinkProvider } from "@/components/link-context";
import LinkForm from "@/components/link-form";
import LinkList from "@/components/link-list";

export default async function Home() {
  const session = await auth();

  return (
    <LinkProvider>
      <main className="mt-4 max-w-4xl mx-auto flex flex-col  ">
        <LinkForm session={session} />
        <LinkList />
      </main>
    </LinkProvider>
  );
}
