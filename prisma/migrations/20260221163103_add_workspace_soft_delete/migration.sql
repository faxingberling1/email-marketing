-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Workspace_deleted_at_idx" ON "Workspace"("deleted_at");
