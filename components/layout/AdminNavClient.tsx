"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/books", label: "Books" },
  { href: "/admin/books/new", label: "Upload book", highlight: true },
  { href: "/admin/activity", label: "Activity" },
];

function isAdminLinkActive(
  pathname: string,
  href: string,
  exact?: boolean,
): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminNavClient() {
  const pathname = usePathname();

  return (
    <div className="mt-5 flex flex-wrap gap-3">
      {adminLinks.map((link) => {
        const active = isAdminLinkActive(pathname, link.href, link.exact);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={[
              "rounded-xl px-4 py-2 text-sm transition",
              active
                ? "bg-white text-black shadow-lg shadow-white/10"
                : link.highlight
                  ? "border border-white/10 bg-white/10 text-white hover:bg-white/15"
                  : "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10",
            ].join(" ")}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}