import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const org = await prisma.organization.upsert({
    where: { slug: 'default-org' },
    update: {},
    create: { name: 'Default Organization', slug: 'default-org' },
  });

  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin User',
      passwordHash,
      role: 'ADMIN',
      organizationId: org.id,
    },
  });

  const classroom = await prisma.classroom.upsert({
    where: { id: 'demo-classroom' },
    update: {},
    create: { id: 'demo-classroom', name: 'Demo Classroom', organizationId: org.id },
  });

  await prisma.student.upsert({
    where: { id: 'demo-student' },
    update: {},
    create: {
      id: 'demo-student',
      firstName: 'Ali',
      lastName: 'Student',
      email: 'student@example.com',
      guardianEmail: 'parent@example.com',
      classroomId: classroom.id,
    },
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
