-- Preserve existing account likes while introducing a separate anonymous IP identity.
ALTER TABLE "Like" ADD COLUMN "voterKey" TEXT;

UPDATE "Like"
SET "voterKey" = 'user:' || "userId";

ALTER TABLE "Like" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "Like" ALTER COLUMN "voterKey" SET NOT NULL;

CREATE UNIQUE INDEX "Like_sheetId_voterKey_key" ON "Like"("sheetId", "voterKey");
