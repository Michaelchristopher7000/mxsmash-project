-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "selectedAddOns" JSONB;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "addOns" JSONB;
