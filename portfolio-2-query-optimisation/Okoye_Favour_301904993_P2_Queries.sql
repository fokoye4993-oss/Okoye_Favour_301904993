-- Show related booking, member, class_session records (up to 20).
SELECT t0."booking_id" AS "booking_booking_id",
       t0."booked_at" AS "booking_booked_at",
       t1."member_id" AS "member_member_id",
       t1."full_name" AS "member_full_name",
       t2."class_session_id" AS "class_session_class_session_id",
       t2."class_name" AS "class_session_class_name"
FROM portfolio."booking" t0
JOIN portfolio."member" t1 ON t0."member_id" = t1."member_id"
JOIN portfolio."class_session" t2 ON t0."class_session_id" = t2."class_session_id"
ORDER BY t0."booking_id", t1."member_id", t2."class_session_id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT t0."booking_id" AS "booking_booking_id",
       t0."booked_at" AS "booking_booked_at",
       t1."member_id" AS "member_member_id",
       t1."full_name" AS "member_full_name",
       t2."class_session_id" AS "class_session_class_session_id",
       t2."class_name" AS "class_session_class_name"
FROM portfolio."booking" t0
JOIN portfolio."member" t1 ON t0."member_id" = t1."member_id"
JOIN portfolio."class_session" t2 ON t0."class_session_id" = t2."class_session_id"
ORDER BY t0."booking_id", t1."member_id", t2."class_session_id"
LIMIT 20;

-- Find booking records where booked_at matches "2026-11-01T12:00:00Z" (up to 20).
SELECT * FROM portfolio."booking"
WHERE "booked_at" IS NOT DISTINCT FROM '2026-11-01T12:00:00Z'
ORDER BY "booking_id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT * FROM portfolio."booking"
WHERE "booked_at" IS NOT DISTINCT FROM '2026-11-01T12:00:00Z'
ORDER BY "booking_id"
LIMIT 20;

-- Count booking records for each member_id (up to 20 groups).
SELECT "member_id", count(*) AS record_count
FROM portfolio."booking"
GROUP BY "member_id"
ORDER BY record_count DESC, "member_id" NULLS LAST
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT "member_id", count(*) AS record_count
FROM portfolio."booking"
GROUP BY "member_id"
ORDER BY record_count DESC, "member_id" NULLS LAST
LIMIT 20;
