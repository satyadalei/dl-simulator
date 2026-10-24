
export default function Ground() {
    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.06, 0]}
            receiveShadow
        >
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial color="#739b58" />
        </mesh>
    );
}
