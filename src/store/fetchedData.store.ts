import { create } from "zustand";

type State = {
  data: string;
};

type Action = {
  setData: (data: string) => void;
};

export const useFetchedDataStore = create<State & Action>((set) => ({
  data: "",
  setData: (data) => set({ data }),
}));
