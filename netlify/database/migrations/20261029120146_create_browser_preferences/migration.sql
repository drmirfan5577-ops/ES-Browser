CREATE TABLE "browser_preferences" (
	"owner" text PRIMARY KEY,
	"theme" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
