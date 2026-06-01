import { create } from 'zustand';

interface GameState {
    speed: number;
    score: number;
    currentInstruction: string;
    isSeatbeltBuckled: boolean;
    setSpeed: (speed: number) => void;
    addViolation: (message: string, penalty: number) => void;
    toggleSeatbelt: () => void;
}

export const useGameStore = create<GameState>((set) => ({
    speed: 0,
    score: 100,
    currentInstruction: "Lesson 1: Buckle your seatbelt to start the engine!",
    isSeatbeltBuckled: false,
    setSpeed: (speed) => set({ speed }),
    toggleSeatbelt: () => set((state) => {
        const nextState = !state.isSeatbeltBuckled;
        return {
            isSeatbeltBuckled: nextState,
            currentInstruction: nextState ? "Great! Use WASD keys to drive." : "Put your seatbelt back on!"
        };
    }),
    addViolation: (message, penalty) => set((state) => ({
        score: Math.max(0, state.score - penalty),
        currentInstruction: `⚠️ VIOLATION: ${message}`
    })),
}));