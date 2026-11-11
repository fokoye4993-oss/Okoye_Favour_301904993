# Portfolio 4 — NoSQL and Advanced Data Models

I used MongoDB collection fitpulse_events for booking_created and booking_cancelled events. These are fictional event examples based on member, class_session, booking, payment.

## Document model

| Field | Meaning |
| --- | --- |
| _id | Unique string event ID |
| eventType | One of the two selected case event labels |
| occurredAt | Native BSON Date; sample timestamps are in 2030 |
| source | Original entity, primary key and saved JSON snapshot |
| embedded | Linked record snapshots read with the event |
| references | Keys for linked sources kept outside the embedded snapshots |
| details | Event metadata whose fields vary |

Related booking, class_session details are stored as snapshots with the event. This makes an event readable in one document. It duplicates some information, and later SQL changes do not automatically update the snapshots. PostgreSQL continues to enforce the relational rules.

## Example document

```javascript
{
    "_id": "event_000001",
    "schemaVersion": 1,
    "simulation": true,
    "eventType": "booking_created",
    "occurredAt": ISODate("2030-01-01T10:00:00Z"),
    "source": {
        "entity": "payment",
        "key": {
            "payment_id": 7
        },
        "snapshot": {
            "payment_id": 7,
            "booking_id": 5,
            "paid_at": "2026-11-01T12:05:00Z",
            "amount": 18.5,
            "method": "card",
            "status": "successful"
        }
    },
    "embedded": {
        "booking": [
            {
                "key": {
                    "booking_id": 5
                },
                "snapshot": {
                    "booking_id": 5,
                    "member_id": 1,
                    "class_session_id": 3,
                    "booked_at": "2026-11-01T12:00:00Z",
                    "status": "confirmed",
                    "attended": false
                },
                "via": [
                    "payment.booking_id → booking"
                ]
            }
        ],
        "class_session": [
            {
                "key": {
                    "class_session_id": 3
                },
                "snapshot": {
                    "class_session_id": 3,
                    "class_name": "Morning Yoga",
                    "starts_at": "2026-11-10T09:00:00Z",
                    "ends_at": "2026-11-10T10:00:00Z",
                    "capacity": 16,
                    "room": "Studio A"
                },
                "via": [
                    "payment.booking_id → booking.class_session_id → class_session"
                ]
            }
        ]
    },
    "references": {
        "member": [
            {
                "key": {
                    "member_id": 1
                },
                "via": [
                    "payment.booking_id → booking.member_id → member"
                ]
            }
        ]
    },
    "details": {
        "channel": "web"
    }
}
```

## Queries and results

| Query | Returned documents |
| --- | --- |
| Find the first sample event type (up to five documents). | 2 |
| Find events for the first source record using nested key fields (up to five). | 2 |
| Find events in the sample time range using a MongoDB Date filter (up to five). | 4 |
| Count documents for each event type. | 2 |

## 1. Find the first sample event type (up to five documents).

```javascript
db.getCollection("fitpulse_events").find({"eventType":"booking_created"}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "booking_created",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "payment_id": 7
    }
  },
  {
    "_id": "event_000003",
    "eventType": "booking_created",
    "occurredAt": {
      "$date": "2030-01-01T10:02:00Z"
    },
    "source": {
      "payment_id": 8
    }
  }
]
```

## 2. Find events for the first source record using nested key fields (up to five).

```javascript
db.getCollection("fitpulse_events").find({"source.key.payment_id":7}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "booking_created",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "payment_id": 7
    }
  },
  {
    "_id": "event_000002",
    "eventType": "booking_cancelled",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "payment_id": 7
    }
  }
]
```

## 3. Find events in the sample time range using a MongoDB Date filter (up to five).

```javascript
db.getCollection("fitpulse_events").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "booking_created",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "payment_id": 7
    }
  },
  {
    "_id": "event_000002",
    "eventType": "booking_cancelled",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "payment_id": 7
    }
  },
  {
    "_id": "event_000003",
    "eventType": "booking_created",
    "occurredAt": {
      "$date": "2030-01-01T10:02:00Z"
    },
    "source": {
      "payment_id": 8
    }
  },
  {
    "_id": "event_000004",
    "eventType": "booking_cancelled",
    "occurredAt": {
      "$date": "2030-01-01T10:03:00Z"
    },
    "source": {
      "payment_id": 8
    }
  }
]
```

## 4. Count documents for each event type.

```javascript
db.getCollection("fitpulse_events").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray();
```

| _id | documentCount |
| --- | --- |
| booking_cancelled | 2 |
| booking_created | 2 |

## Validation and suitability

MongoDB inserted 4 documents. An invalid date type was rejected with code 121 and a repeated event ID with 11000. The collection still contained 4 valid documents. The compound eventType/occurredAt index supports those access fields; this exercise does not measure its speed.

The details field can vary across event types, while the common fields have a validator. Events can be added as separate documents rather than growing one large history record.

## Run the script

Connect mongosh to a fresh exercise database and run Okoye_Favour_301904993_P4_MongoDB.js. It selects portfolio_nosql, creates the collection, inserts the sample documents and displays the query results. [Implementation evidence](screenshots/Okoye_Favour_301904993_P4_DocumentsAndQueries.png).

## References

- [MongoDB — data modelling](https://www.mongodb.com/docs/manual/data-modeling/)

