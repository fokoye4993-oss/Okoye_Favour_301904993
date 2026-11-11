// Run once in mongosh against a fresh exercise database.
// These records are fictional events for the case study.
(async function () {
  db = db.getSiblingDB('portfolio_nosql');
  if ((await db.getCollectionNames()).includes("fitpulse_events")) {
    throw new Error('The exercise collection already exists. Use a fresh database.');
  }

  // The validator checks the stable event fields while details can vary.
  await db.createCollection("fitpulse_events", {
    validator: {
    "$jsonSchema": {
        "bsonType": "object",
        "required": [
            "_id",
            "schemaVersion",
            "simulation",
            "eventType",
            "occurredAt",
            "source",
            "embedded",
            "references",
            "details"
        ],
        "properties": {
            "_id": {
                "bsonType": "string",
                "minLength": 1
            },
            "schemaVersion": {
                "enum": [
                    1
                ]
            },
            "simulation": {
                "enum": [
                    true
                ]
            },
            "eventType": {
                "bsonType": "string",
                "enum": [
                    "booking_created",
                    "booking_cancelled"
                ]
            },
            "occurredAt": {
                "bsonType": "date"
            },
            "source": {
                "bsonType": "object",
                "required": [
                    "entity",
                    "key",
                    "snapshot"
                ],
                "properties": {
                    "entity": {
                        "enum": [
                            "payment"
                        ]
                    },
                    "key": {
                        "bsonType": "object",
                        "required": [
                            "payment_id"
                        ]
                    },
                    "snapshot": {
                        "bsonType": "object"
                    }
                }
            },
            "embedded": {
                "bsonType": "object"
            },
            "references": {
                "bsonType": "object"
            },
            "details": {
                "bsonType": "object"
            }
        }
    }
},
    validationLevel: 'strict', validationAction: 'error'
  });

  // Insert the four example events and show their IDs.
  printjson(await db.getCollection("fitpulse_events").insertMany([
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
    },
    {
        "_id": "event_000002",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "booking_cancelled",
        "occurredAt": ISODate("2030-01-01T10:01:00Z"),
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
            "channel": "mobile",
            "note": "Illustrative event-specific metadata",
            "attributes": [
                {
                    "entity": "payment",
                    "key": {
                        "payment_id": 7
                    },
                    "field": "status",
                    "value": "successful"
                },
                {
                    "entity": "booking",
                    "key": {
                        "booking_id": 5
                    },
                    "field": "status",
                    "value": "confirmed"
                },
                {
                    "entity": "booking",
                    "key": {
                        "booking_id": 5
                    },
                    "field": "class_session_id",
                    "value": 3
                },
                {
                    "entity": "class_session",
                    "key": {
                        "class_session_id": 3
                    },
                    "field": "class_session_id",
                    "value": 3
                },
                {
                    "entity": "booking",
                    "key": {
                        "booking_id": 5
                    },
                    "field": "attended",
                    "value": false
                },
                {
                    "entity": "payment",
                    "key": {
                        "payment_id": 7
                    },
                    "field": "amount",
                    "value": 18.5
                },
                {
                    "entity": "payment",
                    "key": {
                        "payment_id": 7
                    },
                    "field": "method",
                    "value": "card"
                }
            ]
        }
    },
    {
        "_id": "event_000003",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "booking_created",
        "occurredAt": ISODate("2030-01-01T10:02:00Z"),
        "source": {
            "entity": "payment",
            "key": {
                "payment_id": 8
            },
            "snapshot": {
                "payment_id": 8,
                "booking_id": 6,
                "paid_at": "2026-11-02T15:25:00Z",
                "amount": 12,
                "method": "cash",
                "status": "pending"
            }
        },
        "embedded": {
            "booking": [
                {
                    "key": {
                        "booking_id": 6
                    },
                    "snapshot": {
                        "booking_id": 6,
                        "member_id": 2,
                        "class_session_id": 4,
                        "booked_at": "2026-11-02T15:20:00Z",
                        "status": "waitlisted",
                        "attended": null
                    },
                    "via": [
                        "payment.booking_id → booking"
                    ]
                }
            ],
            "class_session": [
                {
                    "key": {
                        "class_session_id": 4
                    },
                    "snapshot": {
                        "class_session_id": 4,
                        "class_name": "Strength Basics",
                        "starts_at": "2026-11-11T17:30:00Z",
                        "ends_at": "2026-11-11T18:30:00Z",
                        "capacity": 12,
                        "room": "Studio B"
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
                        "member_id": 2
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
    },
    {
        "_id": "event_000004",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "booking_cancelled",
        "occurredAt": ISODate("2030-01-01T10:03:00Z"),
        "source": {
            "entity": "payment",
            "key": {
                "payment_id": 8
            },
            "snapshot": {
                "payment_id": 8,
                "booking_id": 6,
                "paid_at": "2026-11-02T15:25:00Z",
                "amount": 12,
                "method": "cash",
                "status": "pending"
            }
        },
        "embedded": {
            "booking": [
                {
                    "key": {
                        "booking_id": 6
                    },
                    "snapshot": {
                        "booking_id": 6,
                        "member_id": 2,
                        "class_session_id": 4,
                        "booked_at": "2026-11-02T15:20:00Z",
                        "status": "waitlisted",
                        "attended": null
                    },
                    "via": [
                        "payment.booking_id → booking"
                    ]
                }
            ],
            "class_session": [
                {
                    "key": {
                        "class_session_id": 4
                    },
                    "snapshot": {
                        "class_session_id": 4,
                        "class_name": "Strength Basics",
                        "starts_at": "2026-11-11T17:30:00Z",
                        "ends_at": "2026-11-11T18:30:00Z",
                        "capacity": 12,
                        "room": "Studio B"
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
                        "member_id": 2
                    },
                    "via": [
                        "payment.booking_id → booking.member_id → member"
                    ]
                }
            ]
        },
        "details": {
            "channel": "mobile",
            "note": "Illustrative event-specific metadata",
            "attributes": [
                {
                    "entity": "payment",
                    "key": {
                        "payment_id": 8
                    },
                    "field": "status",
                    "value": "pending"
                },
                {
                    "entity": "booking",
                    "key": {
                        "booking_id": 6
                    },
                    "field": "status",
                    "value": "waitlisted"
                },
                {
                    "entity": "booking",
                    "key": {
                        "booking_id": 6
                    },
                    "field": "class_session_id",
                    "value": 4
                },
                {
                    "entity": "class_session",
                    "key": {
                        "class_session_id": 4
                    },
                    "field": "class_session_id",
                    "value": 4
                },
                {
                    "entity": "booking",
                    "key": {
                        "booking_id": 6
                    },
                    "field": "attended",
                    "value": null
                },
                {
                    "entity": "payment",
                    "key": {
                        "payment_id": 8
                    },
                    "field": "amount",
                    "value": 12
                },
                {
                    "entity": "payment",
                    "key": {
                        "payment_id": 8
                    },
                    "field": "method",
                    "value": "cash"
                }
            ]
        }
    }
]));
  await db.getCollection("fitpulse_events").createIndex({eventType: 1, occurredAt: -1}, {name: 'event_type_time'});

  // 1. Find the first sample event type (up to five documents).
  printjson(await db.getCollection("fitpulse_events").find({"eventType":"booking_created"}).sort({_id:1}).limit(5).toArray());

  // 2. Find events for the first source record using nested key fields (up to five).
  printjson(await db.getCollection("fitpulse_events").find({"source.key.payment_id":7}).sort({_id:1}).limit(5).toArray());

  // 3. Find events in the sample time range using a MongoDB Date filter (up to five).
  printjson(await db.getCollection("fitpulse_events").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray());

  // 4. Count documents for each event type.
  printjson(await db.getCollection("fitpulse_events").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray());

  // A date stored as text should be rejected by the validator.
  try {
    await db.getCollection("fitpulse_events").insertOne({...{
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
}, _id: 'invalid_date_example', occurredAt: 'not-a-date'});
  } catch (error) { print('Invalid date error: ' + error.code); }

  // Reusing an event ID should be rejected by the unique _id index.
  try { await db.getCollection("fitpulse_events").insertOne({
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
}); }
  catch (error) { print('Duplicate ID error: ' + error.code); }

  print('Document count: ' + await db.getCollection("fitpulse_events").countDocuments());
})().catch(error => { print(error.stack || String(error)); quit(1); });
