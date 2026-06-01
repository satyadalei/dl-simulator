import { expect, test, beforeEach } from 'vitest';
import { useGameStore } from './store';

beforeEach(() => {
    // Reset the store state before each test
    useGameStore.setState({ score: 100, isSeatbeltBuckled: false });
});

test('should not allow driving if seatbelt is unbuckled', () => {
    const store = useGameStore.getState();

    // Try to drive by checking initial state
    expect(store.isSeatbeltBuckled).toBe(false);
    expect(store.currentInstruction).toContain("Buckle your seatbelt");
});

test('should penalize score when a traffic violation occurs', () => {
    // Trigger a red light violation penalty of 20 points
    useGameStore.getState().addViolation("Ran a red light", 20);

    const updatedStore = useGameStore.getState();
    expect(updatedStore.score).toBe(80);
    expect(updatedStore.currentInstruction).toContain("⚠️ VIOLATION");
});