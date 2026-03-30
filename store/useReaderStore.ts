import { create } from "zustand";

export const useReaderStore = create((set) => ({
  progress: {},
  update: (id: string, page: number) =>
    set((state: any) => ({
      progress: { ...state.progress, [id]: page },
    })),
}));