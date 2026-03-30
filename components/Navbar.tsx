// components/Navbar.tsx
"use client";

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
      <h1 className="text-xl font-bold tracking-tight">The Librarian</h1>

      <input
        value={searchValue}
        onChange={handleChange}
        className="w-full max-w-sm rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none placeholder:text-white/40 focus:border-white/20 focus:bg-white/10"
        placeholder="Search books..."
        aria-label="Search books"
      />
    </header>
  );
}