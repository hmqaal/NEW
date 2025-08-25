import Link from "next/link";
export default function NavBar() {
  return (
    <nav className="flex items-center justify-between py-3">
      <Link href="/" className="font-semibold">QHT</Link>
      <div className="space-x-4">
        <Link href="/admin" className="underline">Admin</Link>
      </div>
    </nav>
  );
}
