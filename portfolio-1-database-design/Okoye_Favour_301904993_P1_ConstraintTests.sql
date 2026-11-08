-- Run these deliberately invalid statements one at a time, outside a transaction.
-- Each should fail at the named constraint; the sample rows should remain unchanged.

-- 1. member pk rejection. Expected: pk_member, SQLSTATE 23505.
INSERT INTO portfolio."member" ("member_id", "full_name", "email", "joined_on", "active")
VALUES (1, 'Casey Morgan', 'casey.morgan@example.test', '2026-03-01', TRUE);

-- 2. member unique rejection. Expected: uq_member_0, SQLSTATE 23505.
INSERT INTO portfolio."member" ("member_id", "full_name", "email", "joined_on", "active")
VALUES (101, 'Casey Morgan', 'avery.quinn@example.test', '2026-03-01', TRUE);

-- 3. member not null rejection. Expected: full_name, SQLSTATE 23502.
INSERT INTO portfolio."member" ("member_id", "full_name", "email", "joined_on", "active")
VALUES (102, NULL, 'casey.morgan@example.test', '2026-03-01', TRUE);

-- 4. class session pk rejection. Expected: pk_class_session, SQLSTATE 23505.
INSERT INTO portfolio."class_session" ("class_session_id", "class_name", "starts_at", "ends_at", "capacity", "room")
VALUES (3, 'Evening Cycle', '2026-11-12T18:00:00Z', '2026-11-12T19:00:00Z', 10, 'Studio C');

-- 5. booking pk rejection. Expected: pk_booking, SQLSTATE 23505.
INSERT INTO portfolio."booking" ("booking_id", "member_id", "class_session_id", "booked_at", "status", "attended")
VALUES (5, 2, 3, '2026-11-03T10:00:00Z', 'cancelled', FALSE);

-- 6. booking member fk rejection. Expected: fk_booking_0, SQLSTATE 23503.
INSERT INTO portfolio."booking" ("booking_id", "member_id", "class_session_id", "booked_at", "status", "attended")
VALUES (103, 9001, 3, '2026-11-03T10:00:00Z', 'cancelled', FALSE);

-- 7. booking session fk rejection. Expected: fk_booking_1, SQLSTATE 23503.
INSERT INTO portfolio."booking" ("booking_id", "member_id", "class_session_id", "booked_at", "status", "attended")
VALUES (104, 1, 9002, '2026-11-03T10:00:00Z', 'cancelled', FALSE);

-- 8. booking active pair rejection. Expected: booking_active_pair, SQLSTATE 23505.
INSERT INTO portfolio."booking" ("booking_id", "member_id", "class_session_id", "booked_at", "status", "attended")
VALUES (105, 1, 3, '2026-11-04T10:00:00Z', 'waitlisted', NULL);

-- 9. payment pk rejection. Expected: pk_payment, SQLSTATE 23505.
INSERT INTO portfolio."payment" ("payment_id", "booking_id", "paid_at", "amount", "method", "status")
VALUES (7, 6, '2026-11-04T10:00:00Z', 20, 'card', 'successful');

-- 10. payment booking fk rejection. Expected: fk_payment_0, SQLSTATE 23503.
INSERT INTO portfolio."payment" ("payment_id", "booking_id", "paid_at", "amount", "method", "status")
VALUES (106, 9003, '2026-11-04T10:00:00Z', 20, 'card', 'successful');

-- 11. payment amount check rejection. Expected: payment_amount_positive, SQLSTATE 23514.
INSERT INTO portfolio."payment" ("payment_id", "booking_id", "paid_at", "amount", "method", "status")
VALUES (107, 5, '2026-11-04T10:00:00Z', 0, 'card', 'successful');
