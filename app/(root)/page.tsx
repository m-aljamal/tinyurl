import { auth } from "@/auth";
import LinkForm from "@/components/link-form";
import LinkList from "@/components/link-list";

export default async function Home() {
  const session = await auth();
  
  return (
    <main>
      <h1>Welcome</h1>
      <LinkForm session={session} />
      <LinkList/>
    </main>
  );
}
