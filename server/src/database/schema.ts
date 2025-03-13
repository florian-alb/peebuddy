import {
  boolean,
  numeric,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const roles = pgEnum('roles', ['admin', 'user']);

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
};

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  role: roles('roles').default('user'),
  ...timestamps,
});

export const toilets = pgTable('toilets', {
  id: uuid('id').primaryKey().defaultRandom(),
  longitude: numeric('longitude').notNull(),
  latitude: numeric('latitude').notNull(),
  isFree: boolean('is_free').notNull(),
  isPublic: boolean('is_public').notNull(),
  isHandicap: boolean('is_handicap').notNull(),
  isCommerce: boolean('is_commerce').notNull(),
  isVerified: boolean('is_verified').notNull(),
  ...timestamps,
});

export const pictures = pgTable('pictures', {
  id: uuid('id').primaryKey().defaultRandom(),
  toiletId: uuid('toilet_id').references(() => toilets.id),
  name: varchar('name', { length: 255 }),
  url: varchar('url', { length: 255 }),
  ...timestamps,
});

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  rating: smallint('rating').notNull(),
  comment: text('comment'),
  toiletId: uuid('toilet_id').references(() => toilets.id),
  userId: uuid('user_id').references(() => users.id),
  ...timestamps,
});
