import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import * as schema from "./schema.js";

// Create a singleton database connection
export const db = drizzle(sql, { schema });

// Export schema types for easy access
export * from "./schema.js";
