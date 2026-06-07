import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useGameStore } from '../store/store';

// Helper component for rendering 3D trees
function Tree({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            {/* Trunk */}
            <mesh position={[0, 0.8, 0]} castShadow>
                <cylinderGeometry args={[0.15, 0.22, 1.6, 8]} />
                <meshStandardMaterial color="#5c4033" roughness={0.9} />
            </mesh>
            {/* Leaves */}
            <mesh position={[0, 2.2, 0]} castShadow>
                <coneGeometry args={[1.0, 2.0, 8]} />
                <meshStandardMaterial color="#276749" roughness={0.8} />
            </mesh>
        </group>
    );
}

// Helper component for rendering 3D streetlights
function StreetLight({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
    return (
        <group position={position} rotation={[0, rotationY, 0]}>
            {/* Pole */}
            <mesh position={[0, 2.0, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.1, 4.0, 8]} />
                <meshStandardMaterial color="#4a5568" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Arm */}
            <mesh position={[0.4, 4.0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
                <meshStandardMaterial color="#4a5568" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Lamp Head */}
            <mesh position={[0.8, 3.9, 0]}>
                <boxGeometry args={[0.3, 0.12, 0.2]} />
                <meshStandardMaterial color="#2d3748" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Light bulb glowing */}
            <mesh position={[0.8, 3.82, 0]}>
                <sphereGeometry args={[0.07, 8, 8]} />
                <meshStandardMaterial color="#ffffff" emissive="#fffae0" emissiveIntensity={1.5} />
            </mesh>
            <pointLight position={[0.8, 3.6, 0]} intensity={1.5} distance={10} color="#fffae0" decay={2} />
        </group>
    );
}

export function Environment() {
    const addViolation = useGameStore((state) => state.addViolation);
    const currentSpeed = useGameStore((state) => state.speed);
    const trafficLight = useGameStore((state) => state.trafficLight);

    const handleStopIntersectionEnter = () => {
        // If driver enters/crosses the stop line while light is red or yellow, trigger violation
        if (trafficLight === 'red') {
            addViolation("Ran a RED traffic light! You must stop before the line.", 30);
        } else if (trafficLight === 'yellow') {
            addViolation("Failed to stop at a YELLOW traffic light! Prepare to stop.", 10);
        }
    };

    return (
        <>
            {/* Main Asphalt Road */}
            <mesh position={[0, 0.025, 0]} receiveShadow>
                <boxGeometry args={[8, 0.05, 100]} />
                <meshStandardMaterial color="#1a202c" roughness={0.8} />
            </mesh>

            {/* Stop Line (White band across the road) */}
            <mesh position={[0, 0.055, -12]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[8, 0.6]} />
                <meshStandardMaterial color="#ffffff" roughness={1.0} />
            </mesh>

            {/* Center Dashed Lane Markings */}
            {Array.from({ length: 17 }).map((_, i) => {
                const zPos = 48 - i * 6;
                // Skip markings right around the intersection area to look realistic
                if (zPos > -18 && zPos < -6) return null;
                return (
                    <mesh key={i} position={[0, 0.051, zPos]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                        <planeGeometry args={[0.15, 2.0]} />
                        <meshStandardMaterial color="#ffffff" roughness={1.0} />
                    </mesh>
                );
            })}

            {/* Yellow Edge Lines */}
            <mesh position={[-3.85, 0.051, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[0.08, 100]} />
                <meshStandardMaterial color="#ecc94b" roughness={1.0} />
            </mesh>
            <mesh position={[3.85, 0.051, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[0.08, 100]} />
                <meshStandardMaterial color="#ecc94b" roughness={1.0} />
            </mesh>

            {/* Left Sidewalk Curb (Physical Collider) */}
            <RigidBody type="fixed" onCollisionEnter={() => addViolation("Collision: Drove onto the left sidewalk curb!", 15)}>
                <mesh position={[-5, 0.1, 0]} receiveShadow castShadow>
                    <boxGeometry args={[2, 0.2, 100]} />
                    <meshStandardMaterial color="#718096" roughness={0.7} />
                </mesh>
            </RigidBody>

            {/* Right Sidewalk Curb (Physical Collider) */}
            <RigidBody type="fixed" onCollisionEnter={() => addViolation("Collision: Drove onto the right sidewalk curb!", 15)}>
                <mesh position={[5, 0.1, 0]} receiveShadow castShadow>
                    <boxGeometry args={[2, 0.2, 100]} />
                    <meshStandardMaterial color="#718096" roughness={0.7} />
                </mesh>
            </RigidBody>

            {/* Traffic Light Post Structure */}
            <group position={[4.5, 0, -13]}>
                {/* Vertical Pole */}
                <mesh position={[0, 2.5, 0]} castShadow>
                    <cylinderGeometry args={[0.08, 0.12, 5.0, 12]} />
                    <meshStandardMaterial color="#2d3748" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Horizontal Overhead Arm */}
                <mesh position={[-2.2, 5.0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                    <cylinderGeometry args={[0.06, 0.06, 4.4, 12]} />
                    <meshStandardMaterial color="#2d3748" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Light Hood / Signal Head */}
                <mesh position={[-4.0, 4.2, 0]} castShadow>
                    <boxGeometry args={[0.7, 1.8, 0.7]} />
                    <meshStandardMaterial color="#1a202c" metalness={0.6} roughness={0.4} />
                </mesh>

                {/* RED Light Bulb */}
                <mesh position={[-4.0, 4.7, 0.38]}>
                    <sphereGeometry args={[0.18, 16, 16]} />
                    <meshStandardMaterial
                        color={trafficLight === 'red' ? '#ff3b30' : '#400a0a'}
                        emissive={trafficLight === 'red' ? '#ff3b30' : '#000000'}
                        emissiveIntensity={trafficLight === 'red' ? 5.0 : 0}
                        roughness={0.1}
                    />
                </mesh>

                {/* YELLOW Light Bulb */}
                <mesh position={[-4.0, 4.2, 0.38]}>
                    <sphereGeometry args={[0.18, 16, 16]} />
                    <meshStandardMaterial
                        color={trafficLight === 'yellow' ? '#ffcc00' : '#403300'}
                        emissive={trafficLight === 'yellow' ? '#ffcc00' : '#000000'}
                        emissiveIntensity={trafficLight === 'yellow' ? 5.0 : 0}
                        roughness={0.1}
                    />
                </mesh>

                {/* GREEN Light Bulb */}
                <mesh position={[-4.0, 3.7, 0.38]}>
                    <sphereGeometry args={[0.18, 16, 16]} />
                    <meshStandardMaterial
                        color={trafficLight === 'green' ? '#4cd964' : '#0a300a'}
                        emissive={trafficLight === 'green' ? '#4cd964' : '#000000'}
                        emissiveIntensity={trafficLight === 'green' ? 5.0 : 0}
                        roughness={0.1}
                    />
                </mesh>

                {/* Pointlight showing traffic glow on asphalt */}
                <pointLight
                    position={[-4.0, 3.0, 1.5]}
                    color={trafficLight === 'red' ? '#ff3b30' : trafficLight === 'yellow' ? '#ffcc00' : '#4cd964'}
                    intensity={2.5}
                    distance={12}
                    decay={2}
                />
            </group>

            {/* Invisible Physics Sensor Collider at the intersection crossing */}
            <CuboidCollider
                position={[0, 0.5, -13]}
                args={[4.0, 1.0, 0.8]} // covers width of road, height of car, and thin depth at stop line
                sensor
                onIntersectionEnter={handleStopIntersectionEnter}
            />

            {/* Tree decorations along left/right sidewalks */}
            <Tree position={[-6.0, 0.2, 35]} />
            <Tree position={[6.0, 0.2, 25]} />
            <Tree position={[-6.0, 0.2, 15]} />
            <Tree position={[6.0, 0.2, 5]} />
            <Tree position={[-6.0, 0.2, -5]} />
            <Tree position={[6.0, 0.2, -15]} />
            <Tree position={[-6.0, 0.2, -25]} />
            <Tree position={[6.0, 0.2, -35]} />

            {/* Streetlights along sidewalk */}
            <StreetLight position={[-6.0, 0.2, 20]} rotationY={0} />
            <StreetLight position={[6.0, 0.2, 10]} rotationY={Math.PI} />
            <StreetLight position={[-6.0, 0.2, -10]} rotationY={0} />
            <StreetLight position={[6.0, 0.2, -30]} rotationY={Math.PI} />
        </>
    );
}