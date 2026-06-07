import { expect, test, beforeEach } from 'vitest';
import { useGameStore } from './store';

beforeEach(() => {
    // Reset the store state before each test
    useGameStore.getState().resetGame();
});

test('should not allow driving if seatbelt is unbuckled', () => {
    const store = useGameStore.getState();

    // Try to drive by checking initial state
    expect(store.isSeatbeltBuckled).toBe(false);
    expect(store.currentInstruction).toContain("Buckle your seatbelt");
});

test('should penalize score and track violation count when a traffic violation occurs', () => {
    const initialStore = useGameStore.getState();
    expect(initialStore.violationsCount).toBe(0);

    // Trigger a red light violation penalty of 30 points
    useGameStore.getState().addViolation("Ran a red light", 30);

    const updatedStore = useGameStore.getState();
    expect(updatedStore.score).toBe(70);
    expect(updatedStore.violationsCount).toBe(1);
    expect(updatedStore.currentInstruction).toContain("⚠️ VIOLATION");
});

test('should cycle traffic light color when timer reaches zero', () => {
    const store = useGameStore.getState();
    
    // Initial state: green, 8 seconds
    expect(store.trafficLight).toBe('green');
    expect(store.trafficLightTimer).toBe(8);

    // Tick timer 7 times -> remains green, timer goes down to 1
    for (let i = 0; i < 7; i++) {
        useGameStore.getState().tickTrafficLight();
    }
    expect(useGameStore.getState().trafficLight).toBe('green');
    expect(useGameStore.getState().trafficLightTimer).toBe(1);

    // 8th tick -> transitions to yellow, timer reset to 3
    useGameStore.getState().tickTrafficLight();
    expect(useGameStore.getState().trafficLight).toBe('yellow');
    expect(useGameStore.getState().trafficLightTimer).toBe(3);

    // Tick 3 times -> transitions to red, timer reset to 8
    for (let i = 0; i < 3; i++) {
        useGameStore.getState().tickTrafficLight();
    }
    expect(useGameStore.getState().trafficLight).toBe('red');
    expect(useGameStore.getState().trafficLightTimer).toBe(8);

    // Tick 8 times -> transitions back to green, timer reset to 8
    for (let i = 0; i < 8; i++) {
        useGameStore.getState().tickTrafficLight();
    }
    expect(useGameStore.getState().trafficLight).toBe('green');
    expect(useGameStore.getState().trafficLightTimer).toBe(8);
});

test('should reset all states on game reset', () => {
    // Set some dirty states
    useGameStore.setState({
        score: 40,
        isSeatbeltBuckled: true,
        speed: 30,
        violationsCount: 3,
        trafficLight: 'red',
        trafficLightTimer: 2,
    });

    const initialResetTrigger = useGameStore.getState().resetTrigger;
    useGameStore.getState().resetGame();

    const resetStore = useGameStore.getState();
    expect(resetStore.score).toBe(100);
    expect(resetStore.isSeatbeltBuckled).toBe(false);
    expect(resetStore.speed).toBe(0);
    expect(resetStore.violationsCount).toBe(0);
    expect(resetStore.trafficLight).toBe('green');
    expect(resetStore.trafficLightTimer).toBe(8);
    expect(resetStore.resetTrigger).toBe(initialResetTrigger + 1);
});