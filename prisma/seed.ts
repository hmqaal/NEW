import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import surahs from "../data/surahs.json" assert { type: "json" };

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  const org = await prisma.organization.upsert({
    where: { slug: "demo-madrasa" },
    update: {},
    create: {
      name: "Demo Madrasa",
      slug: "demo-madrasa",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin",
      passwordHash,
      role: "ADMIN",
      organizationId: org.id,
    },
  });

  // Seed Surah metadata (subset for demo)
  for (const s of surahs as any[]) {
    await prisma.surah.upsert({
      where: { number: s.number },
      update: { nameArabic: s.nameArabic, nameEnglish: s.nameEnglish, ayahCount: s.ayahCount },
      create: s as any,
    });
  }

  console.log("Seed complete: admin + org + surah metadata.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
