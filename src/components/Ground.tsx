
export default function Ground() {
    return (
        <group>
            {/* Large grassy terrain */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.06, 0]}
                receiveShadow
            >
                <planeGeometry args={[500, 500]} />
                <meshStandardMaterial
                    color="#759b5b"
                    roughness={1}
                />
            </mesh>
        </group>
    );
}
