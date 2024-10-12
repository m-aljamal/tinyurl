import { db } from "@/db";
import { usersTable } from "@/db/schemas";

export default async function Home() {
  
  const users = await db.select().from(usersTable)
  const list = await db.query.usersTable.findMany()
  console.log({users, list});
  
  return (
   <main>
      

    Home
   </main>
  );
}
