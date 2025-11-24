import dayjs from 'dayjs';
import { pgTable, varchar, timestamp, text, serial } from 'drizzle-orm/pg-core';

const commomFields = {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at', { mode: 'string' }).$default(() => dayjs().format('YYYY-MM-DD HH:mm:ss')).notNull(),
  modifiedAt: timestamp('modified_at', { mode: 'string' })
    .$default(() => dayjs().format('YYYY-MM-DD HH:mm:ss'))
    .$onUpdate(() => dayjs().format('YYYY-MM-DD HH:mm:ss'))
    .notNull(),
};

export const draftLocationTable = pgTable('kw_draft_location', {
  ...commomFields,
  city: varchar('city', { length: 64 }),
  region: varchar('region', { length: 64 }),
  location: varchar('location', { length: 512 }),
  lbsLocation: varchar('lbs_location', { length: 512 }),
  projects: varchar('projects', { length: 512 }),
  lbsList: text('lbs_list'),
});

export const draftProjectTable = pgTable('kw_cache_project', {
  ...commomFields,
  value: text('value'),
});