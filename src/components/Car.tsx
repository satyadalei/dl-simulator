
function Wheel({ position }: {
    position: [number, number, number]
}) {
    return (
        <mesh
            position={position}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
        >
            <cylinderGeometry args={[0.38, 0.38, 0.22, 24]} />
            <meshStandardMaterial color="#17191d" />
        </mesh>
    );
}

export default function Car() {
    return (
        <group position={[0, 0, 0]}>
            {/* Main body */}
            <mesh position={[0, 0.65, 0]} castShadow>
                <boxGeometry args={[1.9, 0.55, 3.8]} />
                <meshStandardMaterial
                    color="#e63946"
                    roughness={0.4}
                    metalness={0.15}
                />
            </mesh>

            {/* Cabin */}
            <mesh position={[0, 1.15, -0.25]} castShadow>
                <boxGeometry args={[1.45, 0.65, 1.8]} />
                <meshStandardMaterial
                    color="#a9d6e5"
                    roughness={0.25}
                    metalness={0.1}
                />
            </mesh>

            {/* Four wheels */}
            <Wheel position={[-1, 0.4, 1.15]} />
            <Wheel position={[1, 0.4, 1.15]} />
            <Wheel position={[-1, 0.4, -1.15]} />
            <Wheel position={[1, 0.4, -1.15]} />
        </group>
    );
}
