# FitPulse (Community Fitness Gym Management System) — normalisation

The example uses the saved sample records. The full set of fields is in the design and schema.

## Starting grouped records

| member_id | booking records (list) |
| --- | --- |
| 1 | [5] |
| 2 | [6] |


The record IDs are grouped in a list. In 1NF, each record has its own row and each cell holds one value.

## 1NF: one value per cell

| booking.booking_id | booking.member_id | booking.class_session_id | booking.status | member.member_id | member.full_name | class_session.class_session_id | class_session.class_name |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 5 | 1 | 3 | confirmed | 1 | Avery Quinn | 3 | Morning Yoga |
| 6 | 2 | 4 | waitlisted | 2 | Jordan Lee | 4 | Strength Basics |

Key: booking_id.

## 2NF: depend on the whole key

The declared candidate keys do not introduce a partial dependency here, so the 1NF rows stay unchanged at this step.

## booking_example

| booking.booking_id | booking.member_id | booking.class_session_id | booking.status | member.member_id | member.full_name | class_session.class_session_id | class_session.class_name |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 5 | 1 | 3 | confirmed | 1 | Avery Quinn | 3 | Morning Yoga |
| 6 | 2 | 4 | waitlisted | 2 | Jordan Lee | 4 | Strength Basics |

## 3NF: store each entity’s details once

The entity keys determine their own descriptions. Related records keep foreign keys rather than repeating those descriptions.

## member

| member_id | full_name | email | joined_on | active |
| --- | --- | --- | --- | --- |
| 1 | Avery Quinn | avery.quinn@example.test | 2026-01-10 | true |
| 2 | Jordan Lee | jordan.lee@example.test | 2026-02-14 | true |

## class_session

| class_session_id | class_name | starts_at | ends_at | capacity | room |
| --- | --- | --- | --- | --- | --- |
| 3 | Morning Yoga | 2026-11-10T09:00:00+00:00 | 2026-11-10T10:00:00+00:00 | 16 | Studio A |
| 4 | Strength Basics | 2026-11-11T17:30:00+00:00 | 2026-11-11T18:30:00+00:00 | 12 | Studio B |

## booking

| booking_id | member_id | class_session_id | booked_at | status | attended |
| --- | --- | --- | --- | --- | --- |
| 5 | 1 | 3 | 2026-11-01T12:00:00+00:00 | confirmed | false |
| 6 | 2 | 4 | 2026-11-02T15:20:00+00:00 | waitlisted | NULL |

## payment

| payment_id | booking_id | paid_at | amount | method | status |
| --- | --- | --- | --- | --- | --- |
| 7 | 5 | 2026-11-01T12:05:00+00:00 | 18.5 | card | successful |
| 8 | 6 | 2026-11-02T15:25:00+00:00 | 12 | cash | pending |

## Dependencies

- member: (member_id) → full_name, email, joined_on, active
- class_session: (class_session_id) → class_name, starts_at, ends_at, capacity, room
- booking: (booking_id) → member_id, class_session_id, booked_at, status, attended
- payment: (payment_id) → booking_id, paid_at, amount, method, status

Joining the decomposed sample tables reproduces the original 2 example rows. The design assumes the declared keys describe the relevant business dependencies.
