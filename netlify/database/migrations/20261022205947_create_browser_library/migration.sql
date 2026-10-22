CREATE TABLE "browser_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"owner" text NOT NULL,
	"kind" text NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "browser_entries_owner_kind" ON "browser_entries" ("owner","kind");