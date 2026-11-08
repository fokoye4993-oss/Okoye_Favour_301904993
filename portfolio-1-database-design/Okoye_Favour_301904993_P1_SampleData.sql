-- Fictional sample records for FitPulse (Community Fitness Gym Management System).
BEGIN;
SET LOCAL standard_conforming_strings = on;
INSERT INTO portfolio."member" ("member_id", "full_name", "email", "joined_on", "active") VALUES (1, 'Avery Quinn', 'avery.quinn@example.test', '2026-01-10', TRUE);
INSERT INTO portfolio."member" ("member_id", "full_name", "email", "joined_on", "active") VALUES (2, 'Jordan Lee', 'jordan.lee@example.test', '2026-02-14', TRUE);
INSERT INTO portfolio."class_session" ("class_session_id", "class_name", "starts_at", "ends_at", "capacity", "room") VALUES (3, 'Morning Yoga', '2026-11-10T09:00:00Z', '2026-11-10T10:00:00Z', 16, 'Studio A');
INSERT INTO portfolio."class_session" ("class_session_id", "class_name", "starts_at", "ends_at", "capacity", "room") VALUES (4, 'Strength Basics', '2026-11-11T17:30:00Z', '2026-11-11T18:30:00Z', 12, 'Studio B');
INSERT INTO portfolio."booking" ("booking_id", "member_id", "class_session_id", "booked_at", "status", "attended") VALUES (5, 1, 3, '2026-11-01T12:00:00Z', 'confirmed', FALSE);
INSERT INTO portfolio."booking" ("booking_id", "member_id", "class_session_id", "booked_at", "status", "attended") VALUES (6, 2, 4, '2026-11-02T15:20:00Z', 'waitlisted', NULL);
INSERT INTO portfolio."payment" ("payment_id", "booking_id", "paid_at", "amount", "method", "status") VALUES (7, 5, '2026-11-01T12:05:00Z', 18.5, 'card', 'successful');
INSERT INTO portfolio."payment" ("payment_id", "booking_id", "paid_at", "amount", "method", "status") VALUES (8, 6, '2026-11-02T15:25:00Z', 12, 'cash', 'pending');
COMMIT;
