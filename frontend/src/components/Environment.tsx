import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useGameStore } from '../store/store';

export function Environment() {
    const addViolation = useGameStore((state) => state.addViolation);
    const currentSpeed = useGameStore((state) => state.speed);

    const handleStopIntersectionEnter = () => {
        // Check if player actually stopped at the designated Stop intersection line
        if (currentSpeed > 0) {
            addViolation("Failed to stop completely at a Stop Intersection!", 20);
        }
    };

    return (
        <>
            {/* Visual Red Stop Sign Post */}
            <mesh position={[4, 1.5, -15]}>
                <boxGeometry args={[0.3, 3, 0.3]} />
                <meshStandardMaterial color="#718096" />
            </mesh>
            <mesh position={[4, 3, -15]}>
                <octahedronGeometry args={[0.6]} />
                <meshStandardMaterial color="#e53e3e" />
            </mesh>

            {/* Invisible Rapier Physics Sensor for the Intersection Checkpoint */}
            <CuboidCollider
                position={[0, 0.5, -15]}
                args={[4, 1, 1]} // Width, height, depth of the radar zone
                sensor
                onIntersectionEnter={handleStopIntersectionEnter}
            />
        </>
    );
}