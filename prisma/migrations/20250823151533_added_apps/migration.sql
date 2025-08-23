-- CreateTable
CREATE TABLE "public"."App" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "country" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "client_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "browser" TEXT,
    "os" TEXT,
    "referrer" TEXT,
    "app_id" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "public"."App"("id") ON DELETE SET NULL ON UPDATE CASCADE;
