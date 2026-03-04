import { create } from "zustand";

type Demo = {
  age: string | null;
  gender: string | null;
  region: string | null;
};

type TestStore = {
  answers: Record<number, number>;
  demo: Demo;
  setAnswer: (id: number, score: number) => void;
  setDemo: (demo: Demo) => void;
  reset: () => void;
};

export const useTestStore = create<TestStore>((set) => ({
  answers: {},
  demo: { age: null, gender: null, region: null },
  setAnswer: (id, score) =>
    set((state) => ({ answers: { ...state.answers, [id]: score } })),
  setDemo: (demo) => set({ demo }),
  reset: () => set({ answers: {}, demo: { age: null, gender: null, region: null } }),
}));