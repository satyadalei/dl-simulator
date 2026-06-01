import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { useGameStore } from '../store/store';
import * as THREE from 'three';

export function Vehicle() {
    const rbRef = useRef<RapierRigidBody>(null);
    const [, getKeys] = useKeyboardControls();
    const isSeatbeltBuckled = useGameStore((state) => state.isSeatbeltBuckled);
    const setSpeed = useGameStore((state) => state.setSpeed);

    useFrame((state) => {
        if (!rbRef.current) return;

        // Fetch live inputs
        const { forward, backward, left, right } = getKeys();

        // Prevent driving if seatbelt isn't buckled (Traffic Rule 1)
        if (!isSeatbeltBuckled) return;

        // Basic Movement Logic vectors
        const linVel = rbRef.current.linvel();
        const currentSpeed = Math.sqrt(linVel.x ** 2 + linVel.z ** 2);
        setSpeed(Math.round(currentSpeed * 3.6)); // Convert to km/h roughly

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
        if (left && (forward || backward)) rbRef.current.setAngvel({ x: 0, y: 2, z: 0 }, true);
        if (right && (forward || backward)) rbRef.current.setAngvel({ x: 0, y: -2, z: 0 }, true);

        // Make camera smoothly follow behind the vehicle
        const pos = rbRef.current.translation();
        const camOffset = new THREE.Vector3(0, 4, 8).applyQuaternion(quaternion);
        state.camera.position.lerp(new THREE.Vector3(pos.x + camOffset.x, pos.y + camOffset.y, pos.z + camOffset.z), 0.1);
        state.camera.lookAt(pos.x, pos.y, pos.z);
    });

    return (
        <RigidBody ref={rbRef} position={[0, 1, 0]} mass={1} enabledRotations={[false, true, false]}>
            {/* Car Body Chassis */}
            <mesh castShadow>
                <boxGeometry args={[1.8, 1, 4]} />
                <meshStandardMaterial color="#e53e3e" />
            </mesh>
        </RigidBody>
    );
}