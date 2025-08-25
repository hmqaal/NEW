import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession();
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Qur'an Homework Tracker</h1>
      {session ? (
        <div className="space-x-4">
          <Link className="underline" href="/admin">Admin</Link>
        </div>
      ) : (
        <Link className="underline" href="/login">Login</Link>
      )}
    </main>
  );
}
