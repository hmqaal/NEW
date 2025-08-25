import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function createStudent(formData: FormData) {
  "use server";
  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const guardianEmail = String(formData.get("guardianEmail") || "").trim();
  const classroomId = String(formData.get("classroomId") || "").trim();
  if (!firstName || !lastName || !classroomId) throw new Error("First, last, classroom required");
  await prisma.student.create({ data: { firstName, lastName, email: email || null, guardianEmail: guardianEmail || null, classroomId } });
}

export default async function StudentsPage() {
  const session = await getServerSession();
  // @ts-ignore
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const [classes, students] = await Promise.all([
    prisma.classroom.findMany({ include: { organization: true } }),
    prisma.student.findMany({ include: { classroom: { include: { organization: true } } }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <main className="space-y-6">
      <h1 className="text-xl font-semibold">Students</h1>

      <form action={createStudent} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
        <div>
          <label className="text-sm">First name</label>
          <input name="firstName" className="w-full border rounded p-2" required />
        </div>
        <div>
          <label className="text-sm">Last name</label>
          <input name="lastName" className="w-full border rounded p-2" required />
        </div>
        <div>
          <label className="text-sm">Email (optional)</label>
          <input name="email" type="email" className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="text-sm">Guardian email (optional)</label>
          <input name="guardianEmail" type="email" className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="text-sm">Classroom</label>
          <select name="classroomId" className="w-full border rounded p-2" required>
            <option value="">Select...</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name} — {c.organization.name}</option>)}
          </select>
        </div>
        <button className="bg-slate-900 text-white rounded px-4 py-2 md:col-span-5" type="submit">Add student</button>
      </form>

      <ul className="divide-y border rounded">
        {students.map(s => (
          <li key={s.id} className="p-3">
            <div className="font-medium">{s.firstName} {s.lastName}</div>
            <div className="text-sm text-slate-600">{s.classroom.name} — {s.classroom.organization.name}</div>
            {s.email && <div className="text-sm">{s.email}</div>}
            {s.guardianEmail && <div className="text-sm">Guardian: {s.guardianEmail}</div>}
          </li>
        ))}
      </ul>
    </main>
  );
}
