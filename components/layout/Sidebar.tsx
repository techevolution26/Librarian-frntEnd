import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 bg-black p-6 hidden md:block">
      <h1 className="text-xl font-bold mb-6">Librarian</h1>
      <nav className="space-y-4 text-gray-300">
        <Link href="/">Home</Link>
        <Link href="/dashboard/library/">Library</Link>
        <Link href="/dashboard/discover/">Discover</Link>
      </nav>
    </div>
  );
}