-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Artist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "age" INTEGER,
    "country" TEXT NOT NULL,
    "url" TEXT
);
INSERT INTO "new_Artist" ("age", "country", "genre", "id", "name", "url") SELECT "age", "country", "genre", "id", "name", "url" FROM "Artist";
DROP TABLE "Artist";
ALTER TABLE "new_Artist" RENAME TO "Artist";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
