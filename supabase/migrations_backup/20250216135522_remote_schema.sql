drop index if exists "public"."idx_sponsors_level";

drop index if exists "public"."idx_sponsors_year";

alter table "public"."sponsors" drop column "image_url";

alter table "public"."sponsors" drop column "year";


