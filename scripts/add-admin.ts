import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Checking for admin user...");

  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@okabalitravel.com" },
  });

  if (existingAdmin) {
    console.log("✅ Admin user already exists!");
    console.log("Email: admin@okabalitravel.com");
    console.log("Password: admin123");
    console.log(`Role: ${existingAdmin.role}`);

    // Update role to ADMIN if not already
    if (existingAdmin.role !== "ADMIN") {
      await prisma.user.update({
        where: { email: "admin@okabalitravel.com" },
        data: { role: "ADMIN" },
      });
      console.log("✅ Updated user role to ADMIN");
    }
  } else {
    console.log("Creating admin user...");
    const adminPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        email: "admin@okabalitravel.com",
        name: "Admin User",
        password: adminPassword,
        role: "ADMIN",
      },
    });
    console.log("✅ Admin user created successfully!");
    console.log("Email: admin@okabalitravel.com");
    console.log("Password: admin123");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
