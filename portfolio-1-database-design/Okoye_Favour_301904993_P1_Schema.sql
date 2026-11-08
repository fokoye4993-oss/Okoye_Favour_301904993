-- FitPulse (Community Fitness Gym Management System): tables, keys and business constraints.
-- Run once in a fresh PostgreSQL database.
BEGIN;
SET LOCAL standard_conforming_strings = on;
CREATE SCHEMA portfolio;
CREATE TABLE portfolio."member" (
  "member_id" bigint NOT NULL,
  "full_name" text NOT NULL,
  "email" text NOT NULL,
  "joined_on" date NOT NULL,
  "active" boolean NOT NULL,
  CONSTRAINT "pk_member" PRIMARY KEY ("member_id"),
  CONSTRAINT "uq_member_0" UNIQUE ("email")
);
CREATE TABLE portfolio."class_session" (
  "class_session_id" bigint NOT NULL,
  "class_name" text NOT NULL,
  "starts_at" timestamptz NOT NULL,
  "ends_at" timestamptz NOT NULL,
  "capacity" bigint NOT NULL,
  "room" text NOT NULL,
  CONSTRAINT "pk_class_session" PRIMARY KEY ("class_session_id")
);
CREATE TABLE portfolio."booking" (
  "booking_id" bigint NOT NULL,
  "member_id" bigint NOT NULL,
  "class_session_id" bigint NOT NULL,
  "booked_at" timestamptz NOT NULL,
  "status" text NOT NULL,
  "attended" boolean,
  CONSTRAINT "pk_booking" PRIMARY KEY ("booking_id")
);
CREATE TABLE portfolio."payment" (
  "payment_id" bigint NOT NULL,
  "booking_id" bigint NOT NULL,
  "paid_at" timestamptz NOT NULL,
  "amount" numeric(18,2) NOT NULL,
  "method" text NOT NULL,
  "status" text NOT NULL,
  CONSTRAINT "pk_payment" PRIMARY KEY ("payment_id")
);
ALTER TABLE portfolio."booking" ADD CONSTRAINT "fk_booking_0" FOREIGN KEY ("member_id") REFERENCES portfolio."member" ("member_id");
ALTER TABLE portfolio."booking" ADD CONSTRAINT "fk_booking_1" FOREIGN KEY ("class_session_id") REFERENCES portfolio."class_session" ("class_session_id");
ALTER TABLE portfolio."payment" ADD CONSTRAINT "fk_payment_0" FOREIGN KEY ("booking_id") REFERENCES portfolio."booking" ("booking_id");
CREATE UNIQUE INDEX "booking_active_pair" ON portfolio."booking" ("member_id", "class_session_id") WHERE (("status" = 'confirmed') OR ("status" = 'waitlisted'));
ALTER TABLE portfolio."payment" ADD CONSTRAINT "payment_amount_positive" CHECK ("amount" > 0);
COMMIT;
