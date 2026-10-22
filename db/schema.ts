import { pgTable, text, timestamp, uuid, index } from 'drizzle-orm/pg-core';
export const entries = pgTable('browser_entries', {
  id: uuid().defaultRandom().primaryKey(),
  owner: text().notNull(),
  kind: text().notNull(),
  title: text().notNull(),
  url: text().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, table => [index('browser_entries_owner_kind').on(table.owner, table.kind)]);
