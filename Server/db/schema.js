// ─── db/schema.js ─────────────────────────────────────────────────────────────
// Drizzle ORM table definitions for Traveloop (PostgreSQL / Neon)
// Replaces all 15 Mongoose model files.
// CommonJS module to match the rest of the project.
// ─────────────────────────────────────────────────────────────────────────────

const {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
  pgEnum,
  uniqueIndex,
  index,
  real,
} = require('drizzle-orm/pg-core');
const { relations, sql } = require('drizzle-orm');

// ─── Enums ───────────────────────────────────────────────────────────────────
const userRoleEnum        = pgEnum('user_role',        ['user', 'admin']);
const tripTypeEnum        = pgEnum('trip_type',        ['solo', 'couple', 'friends', 'family']);
const memberRoleEnum      = pgEnum('member_role',      ['owner', 'editor', 'viewer']);
const travelModeEnum      = pgEnum('travel_mode',      ['driving', 'transit', 'walking', 'flight']);
const expenseCategoryEnum = pgEnum('expense_category', ['transport', 'stay', 'activities', 'meals', 'other']);
const expenseSourceEnum   = pgEnum('expense_source',   ['manual', 'activity', 'train_booking', 'hotel_booking']);
const packingCategoryEnum = pgEnum('packing_category', ['clothing', 'documents', 'electronics', 'toiletries', 'other']);
const bookingStatusEnum   = pgEnum('booking_status',   ['confirmed', 'cancelled']);
const trainStatusEnum     = pgEnum('train_status',     ['confirmed', 'waitlisted', 'cancelled']);

// ─── users ───────────────────────────────────────────────────────────────────
const users = pgTable('users', {
  id:           uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name:         varchar('name', { length: 255 }).notNull(),
  email:        varchar('email', { length: 255 }).notNull().unique(),
  password:     text('password').notNull(),
  photoUrl:     text('photo_url').default(''),
  languagePref: varchar('language_pref', { length: 10 }).default('en'),
  role:         userRoleEnum('role').default('user'),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
  updatedAt:    timestamp('updated_at').defaultNow().notNull(),
});

// ─── cities ──────────────────────────────────────────────────────────────────
const cities = pgTable('cities', {
  id:            uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name:          varchar('name', { length: 255 }).notNull(),
  country:       varchar('country', { length: 255 }).notNull(),
  region:        varchar('region', { length: 255 }),
  costIndex:     real('cost_index'),
  popularity:    integer('popularity').default(0),
  latitude:      real('latitude').default(0),
  longitude:     real('longitude').default(0),
  googlePlaceId: varchar('google_place_id', { length: 255 }).unique(),
  imageUrl:      text('image_url'),
});

// ─── saved_destinations (User ↔ City many-to-many) ────────────────────────────
const savedDestinations = pgTable(
  'saved_destinations',
  {
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    cityId: uuid('city_id').notNull().references(() => cities.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: uniqueIndex('saved_destinations_pk').on(t.userId, t.cityId),
  })
);

// ─── trips ───────────────────────────────────────────────────────────────────
const trips = pgTable('trips', {
  id:            uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  ownerId:       uuid('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name:          varchar('name', { length: 255 }).notNull(),
  description:   text('description'),
  tripType:      tripTypeEnum('trip_type').default('solo'),
  startDate:     timestamp('start_date').notNull(),
  endDate:       timestamp('end_date').notNull(),
  coverPhotoUrl: text('cover_photo_url'),
  totalBudget:   numeric('total_budget', { precision: 12, scale: 2 }),
  isPublic:      boolean('is_public').default(false),
  publicSlug:    varchar('public_slug', { length: 255 }).unique(),
  createdAt:     timestamp('created_at').defaultNow().notNull(),
  updatedAt:     timestamp('updated_at').defaultNow().notNull(),
});

// ─── trip_members (was embedded members[] in Trip) ────────────────────────────
const tripMembers = pgTable(
  'trip_members',
  {
    id:       uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    tripId:   uuid('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
    userId:   uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    role:     memberRoleEnum('role').default('editor'),
    joinedAt: timestamp('joined_at').defaultNow().notNull(),
  },
  (t) => ({
    tripUserUnique: uniqueIndex('trip_members_trip_user_idx').on(t.tripId, t.userId),
  })
);

// ─── stops ───────────────────────────────────────────────────────────────────
const stops = pgTable('stops', {
  id:            uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  tripId:        uuid('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  cityId:        uuid('city_id').notNull().references(() => cities.id),
  sequenceOrder: integer('sequence_order').notNull(),
  startDate:     timestamp('start_date').notNull(),
  endDate:       timestamp('end_date').notNull(),
  notes:         text('notes'),
});

// ─── activities ───────────────────────────────────────────────────────────────
const activities = pgTable('activities', {
  id:               uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  cityId:           uuid('city_id').notNull().references(() => cities.id, { onDelete: 'cascade' }),
  name:             varchar('name', { length: 255 }).notNull(),
  category:         varchar('category', { length: 100 }),
  description:      text('description'),
  imageUrl:         text('image_url'),
  avgCost:          numeric('avg_cost', { precision: 10, scale: 2 }),
  durationMinutes:  integer('duration_minutes'),
  suitedForSolo:    boolean('suited_for_solo').default(true),
  suitedForCouple:  boolean('suited_for_couple').default(true),
  suitedForFriends: boolean('suited_for_friends').default(true),
  suitedForFamily:  boolean('suited_for_family').default(true),
});

// ─── stop_activities (was embedded activities[] in Stop) ──────────────────────
const stopActivities = pgTable('stop_activities', {
  id:            uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  stopId:        uuid('stop_id').notNull().references(() => stops.id, { onDelete: 'cascade' }),
  activityId:    uuid('activity_id').references(() => activities.id, { onDelete: 'set null' }),
  scheduledDate: timestamp('scheduled_date'),
  scheduledTime: varchar('scheduled_time', { length: 10 }),
  actualCost:    numeric('actual_cost', { precision: 10, scale: 2 }),
  notes:         text('notes'),
});

// ─── posts ───────────────────────────────────────────────────────────────────
const posts = pgTable('posts', {
  id:            uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId:        uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tripId:        uuid('trip_id').references(() => trips.id, { onDelete: 'set null' }),
  cityId:        uuid('city_id').references(() => cities.id, { onDelete: 'set null' }),
  caption:       text('caption'),
  rating:        integer('rating'),
  likesCount:    integer('likes_count').default(0),
  commentsCount: integer('comments_count').default(0),
  createdAt:     timestamp('created_at').defaultNow().notNull(),
});

// ─── post_images (was embedded images[] in Post) ──────────────────────────────
const postImages = pgTable('post_images', {
  id:        uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  postId:    uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  imageUrl:  text('image_url'),
  sortOrder: integer('sort_order').default(0),
});

// ─── comments ────────────────────────────────────────────────────────────────
const comments = pgTable('comments', {
  id:        uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  postId:    uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  userId:    uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content:   text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── likes ───────────────────────────────────────────────────────────────────
const likes = pgTable(
  'likes',
  {
    id:        uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    postId:    uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    userId:    uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    postUserUnique: uniqueIndex('likes_post_user_idx').on(t.postId, t.userId),
  })
);

// ─── follows ─────────────────────────────────────────────────────────────────
const follows = pgTable(
  'follows',
  {
    id:          uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    followerId:  uuid('follower_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    followingId: uuid('following_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    createdAt:   timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    followerFollowingUnique: uniqueIndex('follows_follower_following_idx').on(t.followerId, t.followingId),
    followingIdx:            index('follows_following_idx').on(t.followingId),
  })
);

// ─── expenses ─────────────────────────────────────────────────────────────────
const expenses = pgTable('expenses', {
  id:          uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  tripId:      uuid('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  stopId:      uuid('stop_id').references(() => stops.id, { onDelete: 'set null' }),
  category:    expenseCategoryEnum('category').notNull(),
  amount:      numeric('amount', { precision: 12, scale: 2 }).notNull(),
  description: text('description'),
  expenseDate: timestamp('expense_date'),
  sourceType:  expenseSourceEnum('source_type').default('manual'),
  sourceId:    uuid('source_id'),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
});

// ─── expense_splits (was embedded splits[] in Expense) ────────────────────────
const expenseSplits = pgTable('expense_splits', {
  id:          uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  expenseId:   uuid('expense_id').notNull().references(() => expenses.id, { onDelete: 'cascade' }),
  userId:      uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  shareAmount: numeric('share_amount', { precision: 12, scale: 2 }),
  isSettled:   boolean('is_settled').default(false),
});

// ─── hotel_bookings ───────────────────────────────────────────────────────────
const hotelBookings = pgTable('hotel_bookings', {
  id:               uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  tripId:           uuid('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  stopId:           uuid('stop_id').references(() => stops.id, { onDelete: 'set null' }),
  hotelName:        varchar('hotel_name', { length: 255 }).notNull(),
  cityId:           uuid('city_id').references(() => cities.id, { onDelete: 'set null' }),
  checkIn:          timestamp('check_in').notNull(),
  checkOut:         timestamp('check_out').notNull(),
  roomType:         varchar('room_type', { length: 100 }),
  rating:           integer('rating'),
  totalCost:        numeric('total_cost', { precision: 12, scale: 2 }),
  confirmationCode: varchar('confirmation_code', { length: 100 }).unique(),
  status:           bookingStatusEnum('status').default('confirmed'),
  bookedAt:         timestamp('booked_at').defaultNow().notNull(),
});

// ─── train_bookings ───────────────────────────────────────────────────────────
const trainBookings = pgTable('train_bookings', {
  id:          uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  tripId:      uuid('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  stopId:      uuid('stop_id').references(() => stops.id, { onDelete: 'set null' }),
  fromStation: varchar('from_station', { length: 255 }).notNull(),
  toStation:   varchar('to_station', { length: 255 }).notNull(),
  trainNumber: varchar('train_number', { length: 50 }),
  trainName:   varchar('train_name', { length: 255 }),
  travelDate:  timestamp('travel_date').notNull(),
  travelClass: varchar('travel_class', { length: 50 }),
  pnr:         varchar('pnr', { length: 50 }).unique(),
  fare:        numeric('fare', { precision: 10, scale: 2 }),
  status:      trainStatusEnum('status').default('confirmed'),
  bookedAt:    timestamp('booked_at').defaultNow().notNull(),
});

// ─── travel_segments ──────────────────────────────────────────────────────────
const travelSegments = pgTable('travel_segments', {
  id:              uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  tripId:          uuid('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  fromStopId:      uuid('from_stop_id').notNull().references(() => stops.id, { onDelete: 'cascade' }),
  toStopId:        uuid('to_stop_id').notNull().references(() => stops.id, { onDelete: 'cascade' }),
  travelMode:      travelModeEnum('travel_mode').default('driving'),
  distanceKm:      real('distance_km'),
  durationMinutes: integer('duration_minutes'),
  polyline:        text('polyline'),
  fetchedAt:       timestamp('fetched_at').defaultNow().notNull(),
});

// ─── trip_notes ───────────────────────────────────────────────────────────────
const tripNotes = pgTable('trip_notes', {
  id:        uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  tripId:    uuid('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  stopId:    uuid('stop_id').references(() => stops.id, { onDelete: 'set null' }),
  content:   text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ─── packing_items ────────────────────────────────────────────────────────────
const packingItems = pgTable('packing_items', {
  id:        uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  tripId:    uuid('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  name:      varchar('name', { length: 255 }).notNull(),
  category:  packingCategoryEnum('category').default('other'),
  isPacked:  boolean('is_packed').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Drizzle Relations (for relational query API)
// ─────────────────────────────────────────────────────────────────────────────

const usersRelations = relations(users, ({ many }) => ({
  trips:             many(trips),
  tripMembers:       many(tripMembers),
  posts:             many(posts),
  comments:          many(comments),
  likes:             many(likes),
  followers:         many(follows, { relationName: 'following' }),
  following:         many(follows, { relationName: 'follower' }),
  savedDestinations: many(savedDestinations),
  expenseSplits:     many(expenseSplits),
}));

const citiesRelations = relations(cities, ({ many }) => ({
  activities:        many(activities),
  stops:             many(stops),
  posts:             many(posts),
  hotelBookings:     many(hotelBookings),
  savedDestinations: many(savedDestinations),
}));

const tripsRelations = relations(trips, ({ one, many }) => ({
  owner:          one(users, { fields: [trips.ownerId], references: [users.id] }),
  members:        many(tripMembers),
  stops:          many(stops),
  posts:          many(posts),
  expenses:       many(expenses),
  hotelBookings:  many(hotelBookings),
  trainBookings:  many(trainBookings),
  travelSegments: many(travelSegments),
  tripNotes:      many(tripNotes),
  packingItems:   many(packingItems),
}));

const tripMembersRelations = relations(tripMembers, ({ one }) => ({
  trip: one(trips, { fields: [tripMembers.tripId], references: [trips.id] }),
  user: one(users, { fields: [tripMembers.userId], references: [users.id] }),
}));

const stopsRelations = relations(stops, ({ one, many }) => ({
  trip:          one(trips,  { fields: [stops.tripId],  references: [trips.id]  }),
  city:          one(cities, { fields: [stops.cityId],  references: [cities.id] }),
  activities:    many(stopActivities),
  expenses:      many(expenses),
  hotelBookings: many(hotelBookings),
  trainBookings: many(trainBookings),
  fromSegments:  many(travelSegments, { relationName: 'fromStop' }),
  toSegments:    many(travelSegments, { relationName: 'toStop'   }),
  tripNotes:     many(tripNotes),
}));

const activitiesRelations = relations(activities, ({ one, many }) => ({
  city:           one(cities, { fields: [activities.cityId], references: [cities.id] }),
  stopActivities: many(stopActivities),
}));

const stopActivitiesRelations = relations(stopActivities, ({ one }) => ({
  stop:     one(stops,      { fields: [stopActivities.stopId],     references: [stops.id]      }),
  activity: one(activities, { fields: [stopActivities.activityId], references: [activities.id] }),
}));

const postsRelations = relations(posts, ({ one, many }) => ({
  user:     one(users,  { fields: [posts.userId],  references: [users.id]  }),
  trip:     one(trips,  { fields: [posts.tripId],  references: [trips.id]  }),
  city:     one(cities, { fields: [posts.cityId],  references: [cities.id] }),
  images:   many(postImages),
  comments: many(comments),
  likes:    many(likes),
}));

const postImagesRelations = relations(postImages, ({ one }) => ({
  post: one(posts, { fields: [postImages.postId], references: [posts.id] }),
}));

const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  user: one(users, { fields: [comments.userId], references: [users.id] }),
}));

const likesRelations = relations(likes, ({ one }) => ({
  post: one(posts, { fields: [likes.postId], references: [posts.id] }),
  user: one(users, { fields: [likes.userId], references: [users.id] }),
}));

const followsRelations = relations(follows, ({ one }) => ({
  follower:  one(users, { fields: [follows.followerId],  references: [users.id], relationName: 'follower'  }),
  following: one(users, { fields: [follows.followingId], references: [users.id], relationName: 'following' }),
}));

const expensesRelations = relations(expenses, ({ one, many }) => ({
  trip:   one(trips, { fields: [expenses.tripId], references: [trips.id] }),
  stop:   one(stops, { fields: [expenses.stopId], references: [stops.id] }),
  splits: many(expenseSplits),
}));

const expenseSplitsRelations = relations(expenseSplits, ({ one }) => ({
  expense: one(expenses, { fields: [expenseSplits.expenseId], references: [expenses.id] }),
  user:    one(users,    { fields: [expenseSplits.userId],    references: [users.id]    }),
}));

const hotelBookingsRelations = relations(hotelBookings, ({ one }) => ({
  trip: one(trips,  { fields: [hotelBookings.tripId],  references: [trips.id]  }),
  stop: one(stops,  { fields: [hotelBookings.stopId],  references: [stops.id]  }),
  city: one(cities, { fields: [hotelBookings.cityId],  references: [cities.id] }),
}));

const trainBookingsRelations = relations(trainBookings, ({ one }) => ({
  trip: one(trips, { fields: [trainBookings.tripId], references: [trips.id] }),
  stop: one(stops, { fields: [trainBookings.stopId], references: [stops.id] }),
}));

const travelSegmentsRelations = relations(travelSegments, ({ one }) => ({
  trip:     one(trips, { fields: [travelSegments.tripId],     references: [trips.id]  }),
  fromStop: one(stops, { fields: [travelSegments.fromStopId], references: [stops.id], relationName: 'fromStop' }),
  toStop:   one(stops, { fields: [travelSegments.toStopId],   references: [stops.id], relationName: 'toStop'   }),
}));

const tripNotesRelations = relations(tripNotes, ({ one }) => ({
  trip: one(trips, { fields: [tripNotes.tripId], references: [trips.id] }),
  stop: one(stops, { fields: [tripNotes.stopId], references: [stops.id] }),
}));

const packingItemsRelations = relations(packingItems, ({ one }) => ({
  trip: one(trips, { fields: [packingItems.tripId], references: [trips.id] }),
}));

const savedDestinationsRelations = relations(savedDestinations, ({ one }) => ({
  user: one(users,  { fields: [savedDestinations.userId], references: [users.id]  }),
  city: one(cities, { fields: [savedDestinations.cityId], references: [cities.id] }),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────
module.exports = {
  // Enums
  userRoleEnum, tripTypeEnum, memberRoleEnum, travelModeEnum,
  expenseCategoryEnum, expenseSourceEnum, packingCategoryEnum,
  bookingStatusEnum, trainStatusEnum,

  // Tables
  users, cities, savedDestinations, trips, tripMembers,
  stops, activities, stopActivities, posts, postImages,
  comments, likes, follows, expenses, expenseSplits,
  hotelBookings, trainBookings, travelSegments, tripNotes, packingItems,

  // Relations
  usersRelations, citiesRelations, tripsRelations, tripMembersRelations,
  stopsRelations, activitiesRelations, stopActivitiesRelations,
  postsRelations, postImagesRelations, commentsRelations, likesRelations,
  followsRelations, expensesRelations, expenseSplitsRelations,
  hotelBookingsRelations, trainBookingsRelations, travelSegmentsRelations,
  tripNotesRelations, packingItemsRelations, savedDestinationsRelations,
};
