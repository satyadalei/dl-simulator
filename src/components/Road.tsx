export default function Road() {
    return (
        <group>
            {/* Asphalt surface */}
            <mesh
                position={[0, 0.02, 0]}
                receiveShadow
            >
                <boxGeometry args={[8, 0.1, 100]} />
                <meshStandardMaterial color="#34383f" />
            </mesh>

            {/* Left road boundary */}
            <mesh position={[-3.8, 0.08, 0]}>
                <boxGeometry args={[0.12, 0.02, 100]} />
                <meshStandardMaterial color="white" />
            </mesh>

            {/* Right road boundary */}
            <mesh position={[3.8, 0.08, 0]}>
                <boxGeometry args={[0.12, 0.02, 100]} />
                <meshStandardMaterial color="white" />
            </mesh>

            {/* Center lane markings */}
            {Array.from({ length: 20 }, (_, i) => (
                <mesh
                    key={i}
                    position={[0, 0.085, -47.5 + i * 5]}
                >
                    <boxGeometry args={[0.12, 0.02, 2.5]} />
                    <meshStandardMaterial color="#f8fafc" />
                </mesh>
            ))}
        </group>
    );
}
