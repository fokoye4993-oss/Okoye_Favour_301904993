# FitPulse (Community Fitness Gym Management System) — database design

My case study records member, class_session, booking, payment.

## Users

- Gym members
- Front-desk staff
- Gym administrators

## Main operations

- Record member registrations
- Schedule class sessions and manage bookings
- Record payments and review class attendance

## Entities

| Entity | Information stored |
| --- | --- |
| member | Stores gym member contact and membership information. |
| class_session | Stores one scheduled gym class occurrence and its capacity. |
| booking | Links a member to a class session and tracks booking and attendance status. |
| payment | Records payments associated with bookings. |

## member

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| member_id | BIGINT | PK | Yes |
| full_name | TEXT |  | Yes |
| email | TEXT | Unique | Yes |
| joined_on | DATE |  | Yes |
| active | BOOLEAN |  | Yes |
- Unique key: (email).

## class_session

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| class_session_id | BIGINT | PK | Yes |
| class_name | TEXT |  | Yes |
| starts_at | TIMESTAMPTZ |  | Yes |
| ends_at | TIMESTAMPTZ |  | Yes |
| capacity | INTEGER |  | Yes |
| room | TEXT |  | Yes |


## booking

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| booking_id | BIGINT | PK | Yes |
| member_id | BIGINT | FK | Yes |
| class_session_id | BIGINT | FK | Yes |
| booked_at | TIMESTAMPTZ |  | Yes |
| status | TEXT |  | Yes |
| attended | BOOLEAN |  | No |
- member_id → member.member_id
- class_session_id → class_session.class_session_id

## payment

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| payment_id | BIGINT | PK | Yes |
| booking_id | BIGINT | FK | Yes |
| paid_at | TIMESTAMPTZ |  | Yes |
| amount | NUMERIC(18,2) |  | Yes |
| method | TEXT |  | Yes |
| status | TEXT |  | Yes |
- booking_id → booking.booking_id

## Relationships and business rules

- Each member email must be unique.
- Every booking must refer to an existing member through member_id.
- Every booking must refer to an existing class session through class_session_id.
- A member may have at most one confirmed or waitlisted booking for a class session; enforce uniqueness on member_id and class_session_id only for those active statuses.
- Every payment must refer to an existing booking through booking_id.
- Payment amount must be greater than zero.

## Assumptions

- All records, identifiers, and benchmark rows are synthetic; no student names or IDs are included.
- Each class_session is one scheduled occurrence, not a recurring class series.
- Each entity has a single-column primary key, and generated primary-key values are globally unique across these entity tables.
- A booking is active when its status is confirmed or waitlisted; a member may have at most one active booking per class session.
- The separate benchmark plan uses 25,000 synthetic bookings and the same booked_at date-range query: compare an unindexed plan with a B-tree index on booked_at, recording plan and timing observations only if actually run.

