import {
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { familyTable } from "./family";

export const eventTypesTable = pgTable("event_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const customEventTypesTable = pgTable("custom_event_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  familyId: integer("family_id")
    .notNull()
    .references(() => familyTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const eventsTable = pgTable("events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  typeId: integer("type_id")
    .notNull()
    .references(() => eventTypesTable.id),
  customTypeId: integer("custom_type_id").references(
    () => customEventTypesTable.id
  ),
  description: text("description"),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
