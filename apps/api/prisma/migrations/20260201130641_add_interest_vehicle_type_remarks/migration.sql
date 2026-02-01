-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_leads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "interestedModel" TEXT NOT NULL,
    "preferredColor" TEXT NOT NULL,
    "interestLevel" TEXT NOT NULL DEFAULT 'WARM',
    "vehicleType" TEXT,
    "remarks" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "assignedToId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "leads_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_leads" ("assignedToId", "createdAt", "deletedAt", "email", "firstName", "id", "interestedModel", "lastName", "phone", "preferredColor", "source", "status", "updatedAt") SELECT "assignedToId", "createdAt", "deletedAt", "email", "firstName", "id", "interestedModel", "lastName", "phone", "preferredColor", "source", "status", "updatedAt" FROM "leads";
DROP TABLE "leads";
ALTER TABLE "new_leads" RENAME TO "leads";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
