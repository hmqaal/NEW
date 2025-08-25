import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminHome() {
  const session = await getServerSession();
  // @ts-ignore
  if (!session || session.user.role !== "ADMIN") redirect("/login");
  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link className="block rounded border p-4 hover:bg-slate-100" href="/admin/organizations">Organizations</Link>
        <Link className="block rounded border p-4 hover:bg-slate-100" href="/admin/classrooms">Classrooms</Link>
        <Link className="block rounded border p-4 hover:bg-slate-100" href="/admin/students">Students</Link>
      </div>
    </main>
  );
}
