import { auth } from "@/auth";
import LinkForm from "@/components/link-form";

 
export default async function Home() {
  
  const session = await auth()
   
  return (
   <main>
    <h1>Welcome</h1>
    <LinkForm session={session}/>
   </main>
  );
}
