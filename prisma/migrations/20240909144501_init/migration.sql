-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "isDeleted" SMALLINT DEFAULT 0,
    "name" VARCHAR(50),
    "email" VARCHAR(50) NOT NULL,
    "isActive" SMALLINT NOT NULL DEFAULT 0,
    "encryptedSecret" VARCHAR(400) NOT NULL,
    "hashBackupCode" VARCHAR(100) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
