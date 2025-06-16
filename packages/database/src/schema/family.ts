import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { usersTable } from "./users";
import { dogsTable } from "./dog";

export const familyTable = pgTable("family", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => usersTable.id),
  members: integer("members")
    .notNull()
    .references(() => usersTable.id)
    .array()
    .default([]),
  dogs: integer("dogs")
    .notNull()
    .references(() => dogsTable.id)
    .array()
    .default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
