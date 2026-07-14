import { create } from "zustand";

type ReaderProgress = Record<string, number>;

type ReaderStore = {
  progress: ReaderProgress;
  update: (id: string, page: number) => void;
};

export const useReaderStore = create<ReaderStore>((set) => ({

  progress: {},
  update: (id: string, page: number) =>
    set((state: ReaderStore) => ({
      progress: { ...state.progress, [id]: page },
    })),
}));