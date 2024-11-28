-- CreateTable
CREATE TABLE "usuario" (
    "user_id" SERIAL NOT NULL,
    "registration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(45) NOT NULL,
    "phone_number" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "verification_state" BOOLEAN NOT NULL DEFAULT false,
    "password" VARCHAR(100) NOT NULL,
    "profile_picture" TEXT,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "reputacion" (
    "id" SERIAL NOT NULL,
    "score" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "reputacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actividad" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "actividad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_phone_number_key" ON "usuario"("phone_number");

-- AddForeignKey
ALTER TABLE "reputacion" ADD CONSTRAINT "reputacion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuario"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actividad" ADD CONSTRAINT "actividad_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuario"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
