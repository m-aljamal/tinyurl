import { relations } from "drizzle-orm";
import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const links = pgTable("links", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  originalUrl: text("originalUrl").notNull(),
  shortCode: text("shortCode").notNull().unique(),
  userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  guestId: text("guestId"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
// todo remove linkId and add userId
export const analytics = pgTable("analytics", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  linkId: text("linkId").references(() => links.id, { onDelete: "cascade" }),
  clickCount: integer("clickCount").default(0),
  lastClickedAt: timestamp("lastClickedAt"),
});

export const userRelations = relations(users, ({ many }) => ({
  links: many(links),
}));

export const linkRelations = relations(links, ({ one }) => ({
  user: one(users, {
    fields: [links.userId],
    references: [users.id],
  }),
  analytics: one(analytics, {
    fields: [links.id],
    references: [analytics.linkId],
  }),
}));

export const analyticsRelations = relations(analytics, ({ one }) => ({
  link: one(links, {
    fields: [analytics.linkId],
    references: [links.id],
  }),
}));