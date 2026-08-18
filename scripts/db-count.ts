// Prints the Product row count (used by the container entrypoint to decide
// whether to seed). Avoids top-level await so tsx's CJS transform accepts it.
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

prisma.product
  .count()
  .then(async (count) => {
    process.stdout.write(String(count));
    await prisma.$disconnect();
  })
  .catch(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });
