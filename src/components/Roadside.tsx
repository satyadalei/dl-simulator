
function Tree({
    position,
    scale = 1,
}: {
    position: [number, number, number];
    scale?: number;
}) {
    return (
        <group position={position} scale={scale}>
            {/* Trunk */}
            <mesh position={[0, 0.8, 0]} castShadow>
                <cylinderGeometry args={[0.13, 0.2, 1.6, 8]} />
                <meshStandardMaterial color="#795438" />
            </mesh>

            {/* Lower foliage */}
            <mesh position={[0, 1.8, 0]} castShadow>
                <coneGeometry args={[1.05, 1.7, 8]} />
                <meshStandardMaterial color="#3f7544" roughness={1} />
            </mesh>

            {/* Upper foliage */}
            <mesh position={[0, 2.65, 0]} castShadow>
                <coneGeometry args={[0.72, 1.35, 8]} />
                <meshStandardMaterial color="#568b4d" roughness={1} />
            </mesh>
        </group>
    );
}

export default function Roadside() {
    return (
        <group>
            {Array.from({ length: 160 }, (_, i) => {
                const z = -790 + i * 10;

                return (
                    <group key={i}>
                        <Tree
                            position={[-7.5 - (i % 3) * 1.5, 0, z]}
                            scale={0.8 + (i % 3) * 0.15}
                        />
                        <Tree
                            position={[7.5 + (i % 2) * 1.5, 0, z - 4]}
                            scale={0.9 + (i % 4) * 0.1}
                        />
                    </group>
                );
            })}
        </group>
    );
}
