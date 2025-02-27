import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProcessingResult } from "../types";

interface CandidateStore {
    results: ProcessingResult[];
    setResults: (results: ProcessingResult[]) => void;
}

export const useCandidateStore = create<CandidateStore>()(
    persist(
        (set) => ({
            results: [],
            setResults: (results) => set({ results }),
        }),
        {
            name: "candidate-storage",
        },
    ),
);
