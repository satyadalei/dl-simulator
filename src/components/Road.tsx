
export default function Road() {
    const roadLength = 300;
    const dashCount = 60;

    return (
        <group>
            {/* Main asphalt */}
            <mesh
                position={[0, 0.02, 0]}
                receiveShadow
            >
                <boxGeometry args={[8, 0.1, roadLength]} />
                <meshStandardMaterial
                    color="#30343b"
                    roughness={0.95}
                />
            </mesh>

            {/* Road shoulders */}
            {[-1, 1].map((side) => (
                <mesh
                    key={side}
                    position={[side * 4.15, 0.005, 0]}
                    receiveShadow
                >
                    <boxGeometry args={[0.35, 0.08, roadLength]} />
                    <meshStandardMaterial
                        color="#8b8d8a"
                        roughness={1}
                    />
                </mesh>
            ))}

            {/* White edge lines */}
            {[-1, 1].map((side) => (
                <mesh
                    key={side}
                    position={[side * 3.75, 0.078, 0]}
                >
                    <boxGeometry args={[0.1, 0.018, roadLength]} />
                    <meshStandardMaterial color="#f5f5f5" />
                </mesh>
            ))}

            {/* Dashed center line */}
            {Array.from({ length: dashCount }, (_, i) => (
                <mesh
                    key={i}
                    position={[0, 0.079, -147.5 + i * 5]}
                >
                    <boxGeometry args={[0.12, 0.018, 2.5]} />
                    <meshStandardMaterial
                        color="#f5f5f5"
                        roughness={0.8}
                    />
                </mesh>
            ))}
        </group>
    );
}
