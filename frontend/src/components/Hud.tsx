import { useEffect } from 'react';
import { useGameStore } from '../store/store';

export function Hud() {
    const {
        speed,
        score,
        currentInstruction,
        isSeatbeltBuckled,
        toggleSeatbelt,
        trafficLight,
        trafficLightTimer,
        violationsCount,
        resetGame
    } = useGameStore();

    const tickTrafficLight = useGameStore((state) => state.tickTrafficLight);

    // Set up a 1-second interval to tick the traffic light timer
    useEffect(() => {
        const interval = setInterval(() => {
            tickTrafficLight();
        }, 1000);
        return () => clearInterval(interval);
    }, [tickTrafficLight]);

    // Check if the current instruction represents a violation
    const isViolationActive = currentInstruction.startsWith("⚠️ VIOLATION");

    return (
        <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: 10, display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between', padding: '24px', boxSizing: 'border-box',
            fontFamily: "'Outfit', 'Inter', sans-serif"
        }}>
            {/* CSS styles inject for keyframes animations */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
                @keyframes pulse-vignette {
                    0% { box-shadow: inset 0 0 30px rgba(239, 68, 68, 0.4); }
                    50% { box-shadow: inset 0 0 60px rgba(239, 68, 68, 0.85); }
                    100% { box-shadow: inset 0 0 30px rgba(239, 68, 68, 0.4); }
                }
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }
            `}</style>

            {/* 1. Violation Warning Vignette Overlay */}
            {isViolationActive && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    pointerEvents: 'none', zIndex: 5,
                    animation: 'pulse-vignette 1.5s infinite ease-in-out'
                }} />
            )}

            {/* 2. Top Bar Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', zIndex: 12 }}>
                {/* Instruction Banner */}
                <div style={{
                    backdropFilter: 'blur(12px)',
                    backgroundColor: isViolationActive ? 'rgba(153, 27, 27, 0.85)' : 'rgba(15, 23, 42, 0.75)',
                    color: '#f8fafc',
                    padding: '14px 24px',
                    borderRadius: '12px',
                    border: isViolationActive ? '1px solid #f87171' : '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                    maxWidth: '480px',
                    pointerEvents: 'auto',
                    transition: 'all 0.3s ease'
                }}>
                    <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: isViolationActive ? '#fecaca' : '#94a3b8', fontWeight: 600, marginBottom: '2px' }}>
                        {isViolationActive ? '🚨 Penalty Warning' : '📋 Active Instruction'}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 500, lineHeight: 1.4 }}>
                        {currentInstruction}
                    </div>
                </div>

                {/* Score and Stats Display */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    {/* Violations Counter */}
                    <div style={{
                        backdropFilter: 'blur(12px)',
                        backgroundColor: 'rgba(15, 23, 42, 0.75)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#f8fafc',
                        padding: '14px 20px',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '90px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                    }}>
                        <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Violations</span>
                        <span style={{ fontSize: '20px', fontWeight: 800, color: violationsCount > 0 ? '#f87171' : '#f8fafc' }}>
                            {violationsCount}
                        </span>
                    </div>

                    {/* Main Driving Score */}
                    <div style={{
                        backdropFilter: 'blur(12px)',
                        backgroundColor: 'rgba(15, 23, 42, 0.75)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: score > 70 ? '#34d399' : score > 40 ? '#fbbf24' : '#f87171',
                        padding: '14px 24px',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '120px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                    }}>
                        <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Driving Score</span>
                        <span style={{ fontSize: '24px', fontWeight: 800 }}>
                            {score} <span style={{ fontSize: '14px', fontWeight: 500, color: '#94a3b8' }}>pts</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* 3. Middle Side elements (Floating controls instructions and Traffic light HUD) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', zIndex: 12 }}>
                {/* Keyboard Controls Cheat Sheet */}
                <div style={{
                    backdropFilter: 'blur(12px)',
                    backgroundColor: 'rgba(15, 23, 42, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#f8fafc',
                    padding: '16px',
                    borderRadius: '12px',
                    width: '210px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                    pointerEvents: 'auto'
                }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: '#3b82f6', letterSpacing: '0.05em', marginBottom: '8px' }}>
                        🎮 Steering Controls
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Accelerate</span>
                            <kbd style={{ backgroundColor: '#334155', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>W / ↑</kbd>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Brake / Rev</span>
                            <kbd style={{ backgroundColor: '#334155', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>S / ↓</kbd>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Steer Left</span>
                            <kbd style={{ backgroundColor: '#334155', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>A / ←</kbd>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Steer Right</span>
                            <kbd style={{ backgroundColor: '#334155', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>D / →</kbd>
                        </div>
                    </div>
                </div>

                {/* 2D Mini Traffic Light HUD Display */}
                <div style={{
                    backdropFilter: 'blur(12px)',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    padding: '16px 14px',
                    borderRadius: '20px',
                    border: '1.5px solid rgba(255, 255, 255, 0.1)',
                    width: '60px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    alignItems: 'center',
                    boxShadow: '0 15px 25px -5px rgba(0, 0, 0, 0.4)',
                    pointerEvents: 'auto'
                }}>
                    {/* Red Light */}
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        backgroundColor: trafficLight === 'red' ? '#ef4444' : '#311010',
                        border: trafficLight === 'red' ? '2.5px solid #fca5a5' : '1px solid rgba(255, 255, 255, 0.05)',
                        boxShadow: trafficLight === 'red' ? '0 0 16px #ef4444, inset 0 0 6px #ef4444' : 'none',
                        transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#ffffff', fontSize: '13px', fontWeight: 800
                    }}>
                        {trafficLight === 'red' && trafficLightTimer}
                    </div>

                    {/* Yellow Light */}
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        backgroundColor: trafficLight === 'yellow' ? '#fbbf24' : '#352509',
                        border: trafficLight === 'yellow' ? '2.5px solid #fde047' : '1px solid rgba(255, 255, 255, 0.05)',
                        boxShadow: trafficLight === 'yellow' ? '0 0 16px #fbbf24, inset 0 0 6px #fbbf24' : 'none',
                        transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#000000', fontSize: '13px', fontWeight: 800
                    }}>
                        {trafficLight === 'yellow' && trafficLightTimer}
                    </div>

                    {/* Green Light */}
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        backgroundColor: trafficLight === 'green' ? '#10b981' : '#052c1e',
                        border: trafficLight === 'green' ? '2.5px solid #6ee7b7' : '1px solid rgba(255, 255, 255, 0.05)',
                        boxShadow: trafficLight === 'green' ? '0 0 16px #10b981, inset 0 0 6px #10b981' : 'none',
                        transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#ffffff', fontSize: '13px', fontWeight: 800
                    }}>
                        {trafficLight === 'green' && trafficLightTimer}
                    </div>
                </div>
            </div>

            {/* 4. Bottom Bar Controls & Dashboard */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', zIndex: 12 }}>
                {/* Seatbelt and Reset Actions */}
                <div style={{ display: 'flex', gap: '12px', pointerEvents: 'auto' }}>
                    {/* Seatbelt Interactivity Button */}
                    <button
                        onClick={toggleSeatbelt}
                        style={{
                            padding: '14px 24px', fontSize: '14px', fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer',
                            backgroundColor: isSeatbeltBuckled ? '#059669' : '#dc2626', color: '#fff', border: 'none',
                            boxShadow: isSeatbeltBuckled ? '0 4px 14px rgba(5, 150, 105, 0.4)' : '0 4px 14px rgba(220, 38, 38, 0.4)',
                            transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        <span>{isSeatbeltBuckled ? '🔒' : '🔓'}</span>
                        {isSeatbeltBuckled ? 'Seatbelt Buckled' : 'Buckle Seatbelt'}
                    </button>

                    {/* Reset Simulation Button */}
                    <button
                        onClick={resetGame}
                        style={{
                            padding: '14px 24px', fontSize: '14px', fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer',
                            backgroundColor: '#3b82f6', color: '#fff', border: 'none',
                            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                            transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        <span>🔄</span>
                        Reset Simulation
                    </button>
                </div>

                {/* Dashboard Speedometer Dial */}
                <div style={{
                    backdropFilter: 'blur(12px)',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    color: '#ffffff',
                    padding: '16px 28px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    textAlign: 'center',
                    boxShadow: '0 15px 25px -5px rgba(0, 0, 0, 0.4)',
                    minWidth: '100px'
                }}>
                    <div style={{ fontSize: '42px', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '-1px', color: speed > 40 ? '#f59e0b' : '#38bdf8' }}>
                        {speed}
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                        KM/H
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 500 }}>
                        Speed Limit: 40
                    </div>
                </div>
            </div>
        </div>
    );
}