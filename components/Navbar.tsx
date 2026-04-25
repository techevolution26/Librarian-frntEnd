"use client";
import Image from 'next/image';
import { BookSearch } from "lucide-react";
import { ChangeEvent } from "react";

interface NavbarProps {
  onSearchChange?: (value: string) => void;
  searchValue?: string;
}

export default function Navbar({
  onSearchChange,
  searchValue = "",
}: NavbarProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value);
  };

  return (
    <header className="flex items-center justify-between gap-4 border-b border-white/10 bg-black/80 px-6 py-4 text-white backdrop-blur-md">
      {/* Logo and Name Container */}
      <div className="flex items-center gap-x-4">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-white/10">
          <Image
            src="/librariangold.png"
            alt="The Librarian Logo"
            fill
            priority
            sizes="(max-width: 768px) 100px, 150px"
            className="object-contain object-left"
          />
        </div>
        <h1 className="text-xl font-bold tracking-tight">The Librarian</h1>
      </div>

      <div className="relative w-full max-w-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <BookSearch className="size-4 text-white/40" />
        </div>
        <input
          value={searchValue}
          onChange={handleChange}
          className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/20 focus:bg-white/10 transition-colors"
          placeholder="Search books..."
          aria-label="Search books"
        />
      </div>
    </header>
  );
}