import { useGameStore } from '../store/store';

export function Hud() {
    const { speed, score, currentInstruction, isSeatbeltBuckled, toggleSeatbelt } = useGameStore();

    return (
        <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: 10, display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between', padding: '20px', boxSizing: 'border-box',
            fontFamily: 'sans-serif'
        }}>

            {/* Top Bar Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.75)', color: '#fff', padding: '12px 20px', borderRadius: '8px', pointerEvents: 'auto' }}>
                    <strong>📋 Instructions:</strong> {currentInstruction}
                </div>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.75)', color: score > 50 ? '#48bb78' : '#f56565', padding: '12px 20px', borderRadius: '8px', fontSize: '18px' }}>
                    <strong>Driving Score:</strong> {score} pts
                </div>
            </div>

            {/* Bottom Bar Controls & Dashboard Dashboard */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
                {/* Seatbelt Interactivity Button */}
                <button
                    onClick={toggleSeatbelt}
                    style={{
                        pointerEvents: 'auto', padding: '12px 24px', fontSize: '14px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer',
                        backgroundColor: isSeatbeltBuckled ? '#38a169' : '#e53e3e', color: '#fff', border: 'none', transition: '0.2s'
                    }}
                >
                    {isSeatbeltBuckled ? '🔒 Seatbelt: Buckled' : '🔓 Seatbelt: Unbuckled'}
                </button>

                {/* Live Speed readout */}
                <div style={{ backgroundColor: 'rgba(0,0,0,0.85)', color: '#fff', padding: '15px 30px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{speed}</div>
                    <div style={{ fontSize: '12px', color: '#a0aec0', textTransform: 'uppercase' }}>km/h</div>
                </div>
            </div>

        </div>
    );
}