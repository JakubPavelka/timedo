-- CreateEnum
CREATE TYPE "EntryType" AS ENUM ('STOPWATCH', 'POMODORO');

-- AlterTable
ALTER TABLE "TimeEntry" ADD COLUMN     "plannedDuration" INTEGER,
ADD COLUMN     "type" "EntryType" NOT NULL DEFAULT 'STOPWATCH';
