-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('admin', 'user');

-- CreateTable
CREATE TABLE "Picture" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "toilet_id" UUID,
    "name" VARCHAR(255),
    "url" VARCHAR(255),
    "updated_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "Picture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "rating" SMALLINT NOT NULL,
    "comment" TEXT,
    "toilet_id" UUID,
    "user_id" UUID,
    "updated_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Toilet" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "longitude" DECIMAL NOT NULL,
    "latitude" DECIMAL NOT NULL,
    "is_free" BOOLEAN NOT NULL,
    "is_public" BOOLEAN NOT NULL,
    "is_handicap" BOOLEAN NOT NULL,
    "is_commerce" BOOLEAN NOT NULL,
    "is_verified" BOOLEAN NOT NULL,
    "updated_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "Toilet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "roles" "Roles" DEFAULT 'user',
    "updated_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_unique" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Picture" ADD CONSTRAINT "pictures_toilet_id_toilets_id_fk" FOREIGN KEY ("toilet_id") REFERENCES "Toilet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "reviews_toilet_id_toilets_id_fk" FOREIGN KEY ("toilet_id") REFERENCES "Toilet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
