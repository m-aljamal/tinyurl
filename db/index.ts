// import { neon } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-http";
// import * as schema from "./schemas"

// const sql = neon(process.env.DATABASE_URL!);
// export const db = drizzle(sql, {schema});



import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"


import * as schema from "./schemas"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const db = drizzle(pool, { schema })
