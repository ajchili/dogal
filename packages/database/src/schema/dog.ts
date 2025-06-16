import {
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const dogsTable = pgTable("dogs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  breed: text("breed"),
  birthDate: date("birth_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const dogsWeightTable = pgTable("dogs_weight", {
  id: serial("id").primaryKey(),
  dogId: integer("dog_id").references(() => dogsTable.id),
  weight: integer("weight").notNull(),
  date: date("date").notNull().defaultNow(),
});
