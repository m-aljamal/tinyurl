import { auth } from "@/auth";
import { LinkProvider } from "@/components/link-context";
import LinkForm from "@/components/link-form";
import LinkList from "@/components/link-list";

export default async function Home() {
  const session = await auth();

  return (
    <LinkProvider>
      <main>
        <h1>Welcome</h1>
        <LinkForm session={session} />
        <LinkList />
      </main>
    </LinkProvider>
  );
}
