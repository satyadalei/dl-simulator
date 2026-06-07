import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { useGameStore } from '../store/store';
import * as THREE from 'three';

export function Vehicle() {
    const rbRef = useRef<RapierRigidBody>(null);
    const [, getKeys] = useKeyboardControls();
    const isSeatbeltBuckled = useGameStore((state) => state.isSeatbeltBuckled);
    const resetTrigger = useGameStore((state) => state.resetTrigger);
    const setSpeed = useGameStore((state) => state.setSpeed);

    // Listen to store reset triggers to teleport the vehicle back to the start
    useEffect(() => {
        if (rbRef.current) {
            rbRef.current.setTranslation({ x: 0, y: 1, z: 35 }, true);
            rbRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
            rbRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
            rbRef.current.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
        }
    }, [resetTrigger]);

    useFrame((state) => {
        if (!rbRef.current) return;

        // Fetch live inputs
        const { forward, backward, left, right } = getKeys();

        const linVel = rbRef.current.linvel();
        const currentSpeed = Math.sqrt(linVel.x ** 2 + linVel.z ** 2);
        setSpeed(Math.round(currentSpeed * 3.6)); // Convert to km/h

        // Prevent driving if seatbelt isn't buckled (decelerate to a stop if unbuckled mid-drive)
        if (!isSeatbeltBuckled) {
            rbRef.current.setLinvel(
                {
                    x: linVel.x * 0.9, // Apply braking friction
                    y: linVel.y,      // Maintain gravity
                    z: linVel.z * 0.9
                },
                true
            );
            rbRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
            return;
        }

        // Calculate forward movement direction based on car rotation
        const rotation = rbRef.current.rotation();
        const quaternion = new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);
        const forwardVector = new THREE.Vector3(0, 0, -1).applyQuaternion(quaternion);

        let speedIncrement = 0;
        if (forward) speedIncrement = 15;
        if (backward) speedIncrement = -10;

        // Apply forward/backward movement velocity
        rbRef.current.setLinvel(
            {
                x: forwardVector.x * speedIncrement,
                y: linVel.y, // Maintain gravity
                z: forwardVector.z * speedIncrement
            },
            true
        );

        // Apply steering rotation (Angular velocity)
        if (left && (forward || backward)) {
            // Turn opposite direction if going backward
            const directionMultiplier = speedIncrement >= 0 ? 1 : -1;
            rbRef.current.setAngvel({ x: 0, y: 2 * directionMultiplier, z: 0 }, true);
        } else if (right && (forward || backward)) {
            const directionMultiplier = speedIncrement >= 0 ? 1 : -1;
            rbRef.current.setAngvel({ x: 0, y: -2 * directionMultiplier, z: 0 }, true);
        } else {
            rbRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
        }

        // Make camera smoothly follow behind the vehicle
        const pos = rbRef.current.translation();
        const camOffset = new THREE.Vector3(0, 4, 8).applyQuaternion(quaternion);
        state.camera.position.lerp(new THREE.Vector3(pos.x + camOffset.x, pos.y + camOffset.y, pos.z + camOffset.z), 0.1);
        state.camera.lookAt(pos.x, pos.y, pos.z);
    });

    return (
        <RigidBody ref={rbRef} position={[0, 1, 35]} mass={1.5} enabledRotations={[false, true, false]}>
            <group>
                {/* 1. Main Car Chassis (Lower Body) */}
                <mesh castShadow receiveShadow position={[0, 0, 0]}>
                    <boxGeometry args={[1.8, 0.6, 4.0]} />
                    <meshStandardMaterial color="#3182ce" metalness={0.6} roughness={0.2} />
                </mesh>

                {/* 2. Cabin (Upper Body) */}
                <mesh castShadow position={[0, 0.55, -0.2]}>
                    <boxGeometry args={[1.5, 0.5, 2.0]} />
                    <meshStandardMaterial color="#2b6cb0" metalness={0.6} roughness={0.2} />
                </mesh>

                {/* 3. Windshield (Front Glass) */}
                <mesh position={[0, 0.6, -1.22]} rotation={[-0.4, 0, 0]}>
                    <boxGeometry args={[1.4, 0.45, 0.05]} />
                    <meshStandardMaterial color="#1a202c" metalness={0.9} roughness={0.1} transparent opacity={0.6} />
                </mesh>

                {/* 4. Rear Glass */}
                <mesh position={[0, 0.6, 0.82]} rotation={[0.4, 0, 0]}>
                    <boxGeometry args={[1.4, 0.45, 0.05]} />
                    <meshStandardMaterial color="#1a202c" metalness={0.9} roughness={0.1} transparent opacity={0.6} />
                </mesh>

                {/* 5. Wheels (Cylinders rotated on Z axis) */}
                {/* Rear Left */}
                <group position={[-1.0, -0.25, 1.2]} rotation={[0, 0, Math.PI / 2]}>
                    <mesh castShadow>
                        <cylinderGeometry args={[0.45, 0.45, 0.35, 16]} />
                        <meshStandardMaterial color="#1a202c" roughness={0.8} />
                    </mesh>
                    <mesh position={[0, 0.18, 0]}>
                        <cylinderGeometry args={[0.22, 0.22, 0.05, 12]} />
                        <meshStandardMaterial color="#cbd5e0" metalness={0.8} roughness={0.2} />
                    </mesh>
                </group>

                {/* Rear Right */}
                <group position={[1.0, -0.25, 1.2]} rotation={[0, 0, Math.PI / 2]}>
                    <mesh castShadow>
                        <cylinderGeometry args={[0.45, 0.45, 0.35, 16]} />
                        <meshStandardMaterial color="#1a202c" roughness={0.8} />
                    </mesh>
                    <mesh position={[0, -0.18, 0]}>
                        <cylinderGeometry args={[0.22, 0.22, 0.05, 12]} />
                        <meshStandardMaterial color="#cbd5e0" metalness={0.8} roughness={0.2} />
                    </mesh>
                </group>

                {/* Front Left */}
                <group position={[-1.0, -0.25, -1.2]} rotation={[0, 0, Math.PI / 2]}>
                    <mesh castShadow>
                        <cylinderGeometry args={[0.45, 0.45, 0.35, 16]} />
                        <meshStandardMaterial color="#1a202c" roughness={0.8} />
                    </mesh>
                    <mesh position={[0, 0.18, 0]}>
                        <cylinderGeometry args={[0.22, 0.22, 0.05, 12]} />
                        <meshStandardMaterial color="#cbd5e0" metalness={0.8} roughness={0.2} />
                    </mesh>
                </group>

                {/* Front Right */}
                <group position={[1.0, -0.25, -1.2]} rotation={[0, 0, Math.PI / 2]}>
                    <mesh castShadow>
                        <cylinderGeometry args={[0.45, 0.45, 0.35, 16]} />
                        <meshStandardMaterial color="#1a202c" roughness={0.8} />
                    </mesh>
                    <mesh position={[0, -0.18, 0]}>
                        <cylinderGeometry args={[0.22, 0.22, 0.05, 12]} />
                        <meshStandardMaterial color="#cbd5e0" metalness={0.8} roughness={0.2} />
                    </mesh>
                </group>

                {/* 6. Glowing Front Headlights */}
                <mesh position={[-0.7, 0.05, -2.01]}>
                    <sphereGeometry args={[0.12, 16, 16]} />
                    <meshStandardMaterial color="#fff" emissive="#fffae0" emissiveIntensity={3.0} />
                </mesh>
                <mesh position={[0.7, 0.05, -2.01]}>
                    <sphereGeometry args={[0.12, 16, 16]} />
                    <meshStandardMaterial color="#fff" emissive="#fffae0" emissiveIntensity={3.0} />
                </mesh>

                {/* 7. Glowing Rear Taillights (Red) */}
                <mesh position={[-0.7, 0.05, 2.01]}>
                    <boxGeometry args={[0.25, 0.12, 0.05]} />
                    <meshStandardMaterial color="#e53e3e" emissive="#ff2222" emissiveIntensity={2.5} />
                </mesh>
                <mesh position={[0.7, 0.05, 2.01]}>
                    <boxGeometry args={[0.25, 0.12, 0.05]} />
                    <meshStandardMaterial color="#e53e3e" emissive="#ff2222" emissiveIntensity={2.5} />
                </mesh>
            </group>
        </RigidBody>
    );
}