
-- Create users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lineId TEXT NULL,
    displayName TEXT NOT NULL,
    email TEXT NULL,
    pictureUrl TEXT  NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Create events table
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NULL,
    title TEXT NOT NULL,
    description TEXT NULL,
    location TEXT NULL,
    deadline TEXT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create available dates table
CREATE TABLE availableDates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    eventId INTEGER NOT NULL,
    date TEXT NOT NULL,
    time TEXT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE
);


-- Create responses table
CREATE TABLE responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NULL,
    displayName TEXT NOT NULL,
    eventId INTEGER NOT NULL,
    availableDateId INTEGER NOT NULL,
    status TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (availableDateId) REFERENCES availableDates(id) ON DELETE CASCADE,
    UNIQUE (userId, eventId, availableDateId)
);

