import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function createClassroom(formData: FormData) {
  "use server";
  const name = String(formData.get("name") || "").trim();
  const organizationId = String(formData.get("organizationId") || "").trim();
  if (!name || !organizationId) throw new Error("Name and organization required");
  await prisma.classroom.create({ data: { name, organizationId } });
}

export default async function ClassroomsPage() {
  const session = await getServerSession();
  // @ts-ignore
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const [orgs, classes] = await Promise.all([
    prisma.organization.findMany({ orderBy: { name: "asc" } }),
    prisma.classroom.findMany({ include: { organization: true }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <main className="space-y-6">
      <h1 className="text-xl font-semibold">Classrooms</h1>

      <form action={createClassroom} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
        <div className="md:col-span-2">
          <label className="text-sm">Name</label>
          <input name="name" className="w-full border rounded p-2" required />
        </div>
        <div>
          <label className="text-sm">Organization</label>
          <select name="organizationId" className="w-full border rounded p-2" required>
            <option value="">Select...</option>
            {orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>
        <button className="bg-slate-900 text-white rounded px-4 py-2" type="submit">Create</button>
      </form>

      <ul className="divide-y border rounded">
        {classes.map(c => (
          <li key={c.id} className="p-3">
            <div className="font-medium">{c.name}</div>
            <div className="text-sm text-slate-600">{c.organization.name}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
