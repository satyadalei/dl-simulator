import { create } from 'zustand';

export type TrafficLightColor = 'green' | 'yellow' | 'red';

interface GameState {
    speed: number;
    score: number;
    currentInstruction: string;
    isSeatbeltBuckled: boolean;
    trafficLight: TrafficLightColor;
    trafficLightTimer: number; // in seconds
    violationsCount: number;
    resetTrigger: number; // incremented to trigger car teleportation
    setSpeed: (speed: number) => void;
    addViolation: (message: string, penalty: number) => void;
    toggleSeatbelt: () => void;
    setTrafficLight: (light: TrafficLightColor) => void;
    tickTrafficLight: () => void;
    resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
    speed: 0,
    score: 100,
    currentInstruction: "Lesson 1: Buckle your seatbelt to start the engine!",
    isSeatbeltBuckled: false,
    trafficLight: 'green',
    trafficLightTimer: 8,
    violationsCount: 0,
    resetTrigger: 0,
    setSpeed: (speed) => set({ speed }),
    toggleSeatbelt: () => set((state) => {
        const nextState = !state.isSeatbeltBuckled;
        return {
            isSeatbeltBuckled: nextState,
            currentInstruction: nextState ? "Great! Use WASD or Arrow keys to drive. Stop at Red/Yellow signals!" : "Put your seatbelt back on!"
        };
    }),
    addViolation: (message, penalty) => set((state) => ({
        score: Math.max(0, state.score - penalty),
        violationsCount: state.violationsCount + 1,
        currentInstruction: `⚠️ VIOLATION: ${message}`
    })),
    setTrafficLight: (trafficLight) => set({ trafficLight }),
    tickTrafficLight: () => set((state) => {
        let nextLight = state.trafficLight;
        let nextTimer = state.trafficLightTimer - 1;
        if (nextTimer <= 0) {
            if (state.trafficLight === 'green') {
                nextLight = 'yellow';
                nextTimer = 3;
            } else if (state.trafficLight === 'yellow') {
                nextLight = 'red';
                nextTimer = 8;
            } else {
                nextLight = 'green';
                nextTimer = 8;
            }
        }
        return { trafficLight: nextLight, trafficLightTimer: nextTimer };
    }),
    resetGame: () => set((state) => ({
        speed: 0,
        score: 100,
        currentInstruction: "Lesson 1: Buckle your seatbelt to start the engine!",
        isSeatbeltBuckled: false,
        trafficLight: 'green',
        trafficLightTimer: 8,
        violationsCount: 0,
        resetTrigger: state.resetTrigger + 1,
    })),
}));