
import { useState } from "react";
import type { ThreeElements } from "@react-three/fiber";

type WheelProps = {
    position: [number, number, number];
    steering?: number;
};

function Wheel({ position, steering = 0 }: WheelProps) {
    return (
        <group position={position} rotation={[0, steering, 0]}>
            {/* The cylinder's axle points along X */}
            <mesh
                rotation={[0, 0, Math.PI / 2]}
                castShadow
                receiveShadow
            >
                <cylinderGeometry args={[0.34, 0.34, 0.24, 24]} />
                <meshStandardMaterial
                    color="#17191d"
                    roughness={0.88}
                />
            </mesh>

            {/* Simple silver hub */}
            <mesh
                position={[0.125, 0, 0]}
                rotation={[0, 0, Math.PI / 2]}
            >
                <cylinderGeometry args={[0.16, 0.16, 0.012, 20]} />
                <meshStandardMaterial
                    color="#b9c2cc"
                    metalness={0.65}
                    roughness={0.3}
                />
            </mesh>
        </group>
    );
}

export default function Car() {
    const [steering, setSteering] = useState(0);

    return (
        <group position={[0, 0, 0]}>
            {/* Main chassis */}
            <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.85, 0.42, 3.8]} />
                <meshStandardMaterial
                    color="#d71935"
                    metalness={0.2}
                    roughness={0.38}
                />
            </mesh>

            {/* Hood — front is toward negative Z */}
            <mesh
                position={[0, 0.79, -1.2]}
                rotation={[0.035, 0, 0]}
                castShadow
            >
                <boxGeometry args={[1.72, 0.16, 1.25]} />
                <meshStandardMaterial
                    color="#ed243d"
                    metalness={0.18}
                    roughness={0.35}
                />
            </mesh>

            {/* Rear boot */}
            <mesh position={[0, 0.76, 1.3]} castShadow>
                <boxGeometry args={[1.72, 0.15, 0.85]} />
                <meshStandardMaterial color="#d71935" roughness={0.38} />
            </mesh>

            {/* Cabin */}
            <mesh position={[0, 1.03, -0.12]} castShadow>
                <boxGeometry args={[1.4, 0.62, 1.75]} />
                <meshStandardMaterial
                    color="#b7dce8"
                    metalness={0.15}
                    roughness={0.22}
                />
            </mesh>

            {/* Front windshield */}
            <mesh
                position={[0, 1.13, -0.99]}
                rotation={[-0.3, 0, 0]}
            >
                <boxGeometry args={[1.25, 0.42, 0.045]} />
                <meshStandardMaterial
                    color="#244653"
                    metalness={0.15}
                    roughness={0.18}
                />
            </mesh>

            {/* Rear windshield */}
            <mesh
                position={[0, 1.13, 0.76]}
                rotation={[0.3, 0, 0]}
            >
                <boxGeometry args={[1.2, 0.38, 0.045]} />
                <meshStandardMaterial color="#244653" roughness={0.2} />
            </mesh>

            {/* Side windows */}
            {[-1, 1].map((side) => (
                <mesh
                    key={side}
                    position={[side * 0.711, 1.12, -0.1]}
                >
                    <boxGeometry args={[0.025, 0.34, 1.25]} />
                    <meshStandardMaterial
                        color="#244653"
                        roughness={0.2}
                    />
                </mesh>
            ))}

            {/* Front headlights */}
            {[-0.63, 0.63].map((x) => (
                <mesh key={x} position={[x, 0.67, -1.94]}>
                    <boxGeometry args={[0.36, 0.12, 0.035]} />
                    <meshStandardMaterial
                        color="#fff1b8"
                        emissive="#ffdb75"
                        emissiveIntensity={0.25}
                    />
                </mesh>
            ))}

            {/* Rear lights */}
            {[-0.64, 0.64].map((x) => (
                <mesh key={x} position={[x, 0.66, 1.94]}>
                    <boxGeometry args={[0.28, 0.13, 0.035]} />
                    <meshStandardMaterial
                        color="#ff334b"
                        emissive="#c90020"
                        emissiveIntensity={0.3}
                    />
                </mesh>
            ))}

            {/* Wheels: two front and two rear */}
            <Wheel position={[-0.94, 0.41, -1.18]} steering={steering} />
            <Wheel position={[0.94, 0.41, -1.18]} steering={steering} />
            <Wheel position={[-0.94, 0.41, 1.18]} />
            <Wheel position={[0.94, 0.41, 1.18]} />
        </group>
    );
}
