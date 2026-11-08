# FitPulse (Community Fitness Gym Management System) — ER diagram

```mermaid
erDiagram
    direction LR
    member {
        bigint member_id PK
        text full_name
        text email UK
        date joined_on
        boolean active
    }
    class_session {
        bigint class_session_id PK
        text class_name
        timestamptz starts_at
        timestamptz ends_at
        integer capacity
        text room
    }
    booking {
        bigint booking_id PK
        bigint member_id FK
        bigint class_session_id FK
        timestamptz booked_at
        text status
        boolean attended "Optional"
    }
    payment {
        bigint payment_id PK
        bigint booking_id FK
        timestamptz paid_at
        numeric amount
        text method
        text status
    }
    member ||--o{ booking : "member_id"
    class_session ||--o{ booking : "class_session_id"
    booking ||--o{ payment : "booking_id"
```

PK identifies a record; FK links to another table; UK marks a single-field unique value. The relationship ends show exactly one, zero or one, or zero or many records. Composite unique keys and conditional rules are listed in the schema and design.

[Diagram image](../images/Okoye_Favour_301904993_ERDiagram.png)
