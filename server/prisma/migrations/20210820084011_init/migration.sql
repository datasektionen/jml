-- CreateTable
CREATE TABLE "Case" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "content" TEXT NOT NULL,
    "contactMethod" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);
