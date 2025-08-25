import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function createOrganization(formData: FormData) {
  "use server";
  const name = String(formData.get("name") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  if (!name || !slug) throw new Error("Name and slug required");
  await prisma.organization.create({ data: { name, slug } });
}

export default async function OrganizationsPage() {
  const session = await getServerSession();
  // @ts-ignore
  if (!session || session.user.role !== "ADMIN") redirect("/login");
  const orgs = await prisma.organization.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <main className="space-y-6">
      <h1 className="text-xl font-semibold">Organizations</h1>

      <form action={createOrganization} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
        <div>
          <label className="text-sm">Name</label>
          <input name="name" className="w-full border rounded p-2" required />
        </div>
        <div>
          <label className="text-sm">Slug</label>
          <input name="slug" className="w-full border rounded p-2" required />
        </div>
        <button className="bg-slate-900 text-white rounded px-4 py-2" type="submit">Create</button>
      </form>

      <ul className="divide-y border rounded">
        {orgs.map(o => (
          <li key={o.id} className="p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{o.name}</div>
              <div className="text-sm text-slate-600">{o.slug}</div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
