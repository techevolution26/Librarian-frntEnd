"use client";

import { create } from "zustand";

interface DashboardSearchState {
  query: string;
  setQuery: (query: string) => void;
  clearQuery: () => void;
}

export const useDashboardSearch = create<DashboardSearchState>((set) => ({
  query: "",
  setQuery: (query) => set({ query }),
  clearQuery: () => set({ query: "" }),
}));