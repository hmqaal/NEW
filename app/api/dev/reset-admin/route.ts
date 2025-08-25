import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const email = "admin@example.com";
    const passwordHash = await bcrypt.hash("admin123", 10);

    // ensure org
    const org = await prisma.organization.upsert({
      where: { slug: "default-org" },
      update: {},
      create: { name: "Default Organization", slug: "default-org" },
    });

    // set (or reset) admin
    await prisma.user.upsert({
      where: { email },
      update: { passwordHash, role: "ADMIN", organizationId: org.id },
      create: {
        email,
        name: "Admin User",
        passwordHash,
        role: "ADMIN",
        organizationId: org.id,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
