import { create } from "zustand";

type State = {
  input: string;
};

type Action = {
  setInput: (input: string) => void;
};

export const useInputStore = create<State & Action>((set) => ({
  input: "",
  setInput: (input) => set({ input }),
}));
