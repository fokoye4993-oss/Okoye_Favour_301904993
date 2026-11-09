# FitPulse (Community Fitness Gym Management System) — SQL queries

## 1. Show related booking, member, class_session records (up to 20).

```sql
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
```

| booking_booking_id | booking_booked_at | member_member_id | member_full_name | class_session_class_session_id | class_session_class_name |
| --- | --- | --- | --- | --- | --- |
| 5 | 2026-11-01T12:00:00+00:00 | 1 | Avery Quinn | 3 | Morning Yoga |
| 6 | 2026-11-02T15:20:00+00:00 | 2 | Jordan Lee | 4 | Strength Basics |

## 2. Find booking records where booked_at matches "2026-11-01T12:00:00Z" (up to 20).

```sql
SELECT * FROM portfolio."booking"
WHERE "booked_at" IS NOT DISTINCT FROM '2026-11-01T12:00:00Z'
ORDER BY "booking_id"
LIMIT 20;
```

| booking_id | member_id | class_session_id | booked_at | status | attended |
| --- | --- | --- | --- | --- | --- |
| 5 | 1 | 3 | 2026-11-01T12:00:00+00:00 | confirmed | false |

## 3. Count booking records for each member_id (up to 20 groups).

```sql
SELECT "member_id", count(*) AS record_count
FROM portfolio."booking"
GROUP BY "member_id"
ORDER BY record_count DESC, "member_id" NULLS LAST
LIMIT 20;
```

| member_id | record_count |
| --- | --- |
| 1 | 1 |
| 2 | 1 |


## Index comparison

| Phase | Median (ms) | Three runs (ms) | Plan nodes | Buffer hits |
| --- | --- | --- | --- | --- |
| Before index | 1.268 | 1.229, 2.379, 1.268 | Sort → Seq Scan | 139 |
| After index | 0.176 | 0.198, 0.174, 0.176 | Sort → Bitmap Heap Scan → Bitmap Index Scan | 30 |

The median execution time changed from 1.268 ms to 0.176 ms. The measured plan used p2_filter_idx. The results matched in both phases. An index adds storage and write-maintenance costs; timings depend on the selected lookup and environment.

## Execution plans

### Before index, run 1

```text
Sort (actual time=1.201..1.202 rows=25 loops=1)
  Seq Scan on booking (actual time=0.013..1.169 rows=25 loops=1)
Planning Time: 0.327 ms
Execution Time: 1.229 ms
```

### Before index, run 2

```text
Sort (actual time=2.339..2.342 rows=25 loops=1)
  Seq Scan on booking (actual time=0.035..2.268 rows=25 loops=1)
Planning Time: 0.473 ms
Execution Time: 2.379 ms
```

### Before index, run 3

```text
Sort (actual time=1.213..1.215 rows=25 loops=1)
  Seq Scan on booking (actual time=0.014..1.179 rows=25 loops=1)
Planning Time: 0.338 ms
Execution Time: 1.268 ms
```

### After index, run 1

```text
Sort (actual time=0.148..0.15 rows=25 loops=1)
  Bitmap Heap Scan on booking (actual time=0.025..0.114 rows=25 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.012..0.013 rows=25 loops=1)
Planning Time: 0.506 ms
Execution Time: 0.198 ms
```

### After index, run 2

```text
Sort (actual time=0.122..0.123 rows=25 loops=1)
  Bitmap Heap Scan on booking (actual time=0.024..0.088 rows=25 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.012..0.012 rows=25 loops=1)
Planning Time: 0.523 ms
Execution Time: 0.174 ms
```

### After index, run 3

```text
Sort (actual time=0.123..0.125 rows=25 loops=1)
  Bitmap Heap Scan on booking (actual time=0.026..0.09 rows=25 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.013..0.013 rows=25 loops=1)
Planning Time: 0.506 ms
Execution Time: 0.176 ms
```

## Reproduce

Use a fresh database with the Portfolio 1 schema and sample data. Run Okoye_Favour_301904993_P2_Queries.sql, then Okoye_Favour_301904993_P2_Optimisation.sql. The optimisation script creates a separate performance table and runs EXPLAIN (ANALYZE, BUFFERS).

[Query screenshot](screenshots/Okoye_Favour_301904993_P2_QueryResults.png) · [Index comparison](screenshots/Okoye_Favour_301904993_P2_IndexComparison.png)

## References

- [PostgreSQL — EXPLAIN](https://www.postgresql.org/docs/17/using-explain.html)

