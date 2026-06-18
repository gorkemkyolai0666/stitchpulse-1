-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('owner', 'manager', 'grower');

-- CreateEnum
CREATE TYPE "BayClimateType" AS ENUM ('tropical', 'temperate', 'arid', 'propagation', 'shade', 'specialty');

-- CreateEnum
CREATE TYPE "BayStatus" AS ENUM ('active', 'growing', 'sanitizing', 'maintenance', 'closed');

-- CreateEnum
CREATE TYPE "HarvestStatus" AS ENUM ('recorded', 'verified', 'disputed');

-- CreateEnum
CREATE TYPE "HarvestType" AS ENUM ('cuttings', 'seedlings', 'mature', 'herbs', 'seasonal', 'rush');

-- CreateEnum
CREATE TYPE "RepairPriority" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "RepairStatus" AS ENUM ('open', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "IrrigationCategory" AS ENUM ('drip_cycle', 'misting', 'fertilizer', 'pest_scouting', 'soil_check', 'other');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'overdue');

-- CreateEnum
CREATE TYPE "PlantCategory" AS ENUM ('annual_tray', 'perennial_pot', 'herb_flat', 'tree_liner', 'bulk_wholesale', 'other');

-- CreateEnum
CREATE TYPE "PricingStatus" AS ENUM ('active', 'upcoming', 'archived');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'in_progress', 'completed', 'delivered');

-- CreateTable
CREATE TABLE "nurseries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip_code" TEXT,
    "total_bays" INTEGER NOT NULL DEFAULT 6,
    "timezone" TEXT NOT NULL DEFAULT 'America/Chicago',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nurseries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'owner',
    "nursery_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "greenhouse_bays" (
    "id" TEXT NOT NULL,
    "nursery_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "climate_type" "BayClimateType" NOT NULL DEFAULT 'temperate',
    "irrigation_system" TEXT,
    "status" "BayStatus" NOT NULL DEFAULT 'active',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "greenhouse_bays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "harvest_batches" (
    "id" TEXT NOT NULL,
    "nursery_id" TEXT NOT NULL,
    "greenhouse_bay_id" TEXT NOT NULL,
    "harvested_at" TIMESTAMP(3) NOT NULL,
    "harvest_type" "HarvestType" NOT NULL DEFAULT 'seedlings',
    "cash_sales" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "card_sales" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit_count" INTEGER NOT NULL DEFAULT 1,
    "rush_premium" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "HarvestStatus" NOT NULL DEFAULT 'recorded',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "harvest_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment_repairs" (
    "id" TEXT NOT NULL,
    "nursery_id" TEXT NOT NULL,
    "greenhouse_bay_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "reported_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "priority" "RepairPriority" NOT NULL DEFAULT 'medium',
    "status" "RepairStatus" NOT NULL DEFAULT 'open',
    "cost" DOUBLE PRECISION,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipment_repairs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "irrigation_schedules" (
    "id" TEXT NOT NULL,
    "nursery_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "IrrigationCategory" NOT NULL DEFAULT 'other',
    "zone" TEXT,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "status" "ScheduleStatus" NOT NULL DEFAULT 'scheduled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "irrigation_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plant_pricing" (
    "id" TEXT NOT NULL,
    "nursery_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "plant_category" "PlantCategory" NOT NULL DEFAULT 'other',
    "status" "PricingStatus" NOT NULL DEFAULT 'active',
    "base_price" DOUBLE PRECISION NOT NULL,
    "price_multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plant_pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plant_orders" (
    "id" TEXT NOT NULL,
    "nursery_id" TEXT NOT NULL,
    "buyer_name" TEXT NOT NULL,
    "plant_variety" TEXT NOT NULL,
    "supplier_name" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plant_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "greenhouse_bays_nursery_id_status_idx" ON "greenhouse_bays"("nursery_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "greenhouse_bays_nursery_id_name_key" ON "greenhouse_bays"("nursery_id", "name");

-- CreateIndex
CREATE INDEX "harvest_batches_nursery_id_harvested_at_idx" ON "harvest_batches"("nursery_id", "harvested_at");

-- CreateIndex
CREATE INDEX "harvest_batches_nursery_id_status_idx" ON "harvest_batches"("nursery_id", "status");

-- CreateIndex
CREATE INDEX "equipment_repairs_nursery_id_status_idx" ON "equipment_repairs"("nursery_id", "status");

-- CreateIndex
CREATE INDEX "equipment_repairs_nursery_id_priority_idx" ON "equipment_repairs"("nursery_id", "priority");

-- CreateIndex
CREATE INDEX "irrigation_schedules_nursery_id_scheduled_at_idx" ON "irrigation_schedules"("nursery_id", "scheduled_at");

-- CreateIndex
CREATE INDEX "plant_pricing_nursery_id_plant_category_idx" ON "plant_pricing"("nursery_id", "plant_category");

-- CreateIndex
CREATE INDEX "plant_orders_nursery_id_status_idx" ON "plant_orders"("nursery_id", "status");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_nursery_id_fkey" FOREIGN KEY ("nursery_id") REFERENCES "nurseries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "greenhouse_bays" ADD CONSTRAINT "greenhouse_bays_nursery_id_fkey" FOREIGN KEY ("nursery_id") REFERENCES "nurseries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "harvest_batches" ADD CONSTRAINT "harvest_batches_nursery_id_fkey" FOREIGN KEY ("nursery_id") REFERENCES "nurseries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "harvest_batches" ADD CONSTRAINT "harvest_batches_greenhouse_bay_id_fkey" FOREIGN KEY ("greenhouse_bay_id") REFERENCES "greenhouse_bays"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_repairs" ADD CONSTRAINT "equipment_repairs_nursery_id_fkey" FOREIGN KEY ("nursery_id") REFERENCES "nurseries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_repairs" ADD CONSTRAINT "equipment_repairs_greenhouse_bay_id_fkey" FOREIGN KEY ("greenhouse_bay_id") REFERENCES "greenhouse_bays"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "irrigation_schedules" ADD CONSTRAINT "irrigation_schedules_nursery_id_fkey" FOREIGN KEY ("nursery_id") REFERENCES "nurseries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plant_pricing" ADD CONSTRAINT "plant_pricing_nursery_id_fkey" FOREIGN KEY ("nursery_id") REFERENCES "nurseries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plant_orders" ADD CONSTRAINT "plant_orders_nursery_id_fkey" FOREIGN KEY ("nursery_id") REFERENCES "nurseries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

