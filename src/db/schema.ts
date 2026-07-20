import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
} from 'drizzle-orm/pg-core'

import { relations } from 'drizzle-orm'

import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

/*******************************/
/********* User Schema *********/
/*******************************/
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),

  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),

  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

/*******************************/
/********* Habit Schema ********/
/*******************************/
export const habits = pgTable('habits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),

  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),

  frequency: varchar('frequency', { length: 20 }).notNull(), // e.g., daily, weekly
  targetCount: integer('target_count').default(1), // e.g., 1 for daily, 7 for weekly
  isActive: boolean('is_active').default(true).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

/*******************************/
/********* Entry Schema ********/
/*******************************/
export const entries = pgTable('entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  habitId: uuid('habit_id')
    .references(() => habits.id, { onDelete: 'cascade' })
    .notNull(),

  completionDate: timestamp('completion_date').defaultNow().notNull(),
  note: text('note'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/*******************************/
/********* Tag Schema **********/
/*******************************/
export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),

  name: varchar('name', { length: 50 }).notNull().unique(),
  color: varchar('color', { length: 7 }).default('#6B7280'), // hex color

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

/*******************************/
/****** Habit-Tag Schema *******/
/*******************************/
export const habitTags = pgTable('habit_tags', {
  id: uuid('id').primaryKey().defaultRandom(),

  habitId: uuid('habit_id')
    .references(() => habits.id, { onDelete: 'cascade' })
    .notNull(),
  tagId: uuid('tag_id')
    .references(() => tags.id, { onDelete: 'cascade' })
    .notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/*******************************/
/********* Relations ***********/
/*******************************/

// 1 user can have many habits
export const userRelations = relations(users, ({ many }) => ({
  habits: many(habits),
}))

// 1 habit belongs to one user, has many entries and many tags through habitTags
export const habitRelations = relations(habits, ({ one, many }) => ({
  user: one(users, {
    fields: [habits.userId],
    references: [users.id],
  }),
  entries: many(entries),
  habitTags: many(habitTags),
}))

// 1 entry belongs to one habit
export const entryRelations = relations(entries, ({ one }) => ({
  habit: one(habits, {
    fields: [entries.habitId],
    references: [habits.id],
  }),
}))

// 1 tag can belong to many habits through habitTags
export const tagRelations = relations(tags, ({ many }) => ({
  habitTags: many(habitTags),
}))

export const habitTagRelations = relations(habitTags, ({ one }) => ({
  habit: one(habits, {
    fields: [habitTags.habitId],
    references: [habits.id],
  }),
  tag: one(tags, {
    fields: [habitTags.tagId],
    references: [tags.id],
  }),
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Habit = typeof habits.$inferSelect
export type Entry = typeof entries.$inferSelect
export type Tag = typeof tags.$inferSelect
export type HabitTag = typeof habitTags.$inferSelect

export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)
