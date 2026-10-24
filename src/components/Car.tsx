
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import type { Group } from "three";

const MAX_FORWARD_SPEED = 12;
const MAX_REVERSE_SPEED = 5;
const ACCELERATION = 7;
const BRAKING = 12;
const FRICTION = 3;
const TURN_RATE = 1.5;
const WHEEL_RADIUS = 0.34;
const MAX_STEERING_ANGLE = 0.45;


type WheelProps = {
    position: [number, number, number];
    front?: boolean;
    speedRef: { current: number };
    steeringRef: { current: number };
};

function Wheel({
    position,
    front = false,
    speedRef,
    steeringRef,
}: WheelProps) {
    const wheelRef = useRef<Group>(null);

    useFrame((_, delta) => {
        if (!wheelRef.current) return;

        wheelRef.current.rotation.y = front
            ? steeringRef.current
            : 0;

        wheelRef.current.rotation.x -=
            (speedRef.current / WHEEL_RADIUS) * delta;
    });

    return (
        <group ref={wheelRef} position={position}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[WHEEL_RADIUS, WHEEL_RADIUS, 0.24, 24]} />
                <meshStandardMaterial color="#17191d" roughness={0.88} />
            </mesh>

            <mesh
                position={[0.125, 0, 0]}
                rotation={[0, 0, Math.PI / 2]}
            >
                <cylinderGeometry args={[0.15, 0.15, 0.015, 20]} />
                <meshStandardMaterial color="#b9c2cc" metalness={0.65} roughness={0.3} />
            </mesh>
        </group>
    );
}

type CarProps = {
    orbitEnabled: boolean;
};

export default function Car({ orbitEnabled }: CarProps) {
    const carRef = useRef<Group>(null);
    const speedRef = useRef(0);
    const steeringRef = useRef(0);

    const keys = useRef(new Set<string>());
    const { camera } = useThree();

    const cameraPosition = useRef(new Vector3());
    const cameraTarget = useRef(new Vector3());
    const desiredCameraPosition = useRef(new Vector3());
    const desiredCameraTarget = useRef(new Vector3());

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();

            if (
                ["arrowup", "arrowdown", "arrowleft", "arrowright", " "]
                    .includes(key)
            ) {
                event.preventDefault();
            }

            keys.current.add(key);
        };

        const onKeyUp = (event: KeyboardEvent) => {
            keys.current.delete(event.key.toLowerCase());
        };

        const onBlur = () => {
            keys.current.clear();
        };

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        window.addEventListener("blur", onBlur);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
            window.removeEventListener("blur", onBlur);
        };
    }, []);

    useFrame((_, delta) => {
        const car = carRef.current;
        if (!car) return;

        // Avoid large jumps after a paused or delayed frame.
        const dt = Math.min(delta, 0.05);
        const pressed = keys.current;

        const forward =
            pressed.has("w") || pressed.has("arrowup");
        const backward =
            pressed.has("s") || pressed.has("arrowdown");
        const left =
            pressed.has("a") || pressed.has("arrowleft");
        const right =
            pressed.has("d") || pressed.has("arrowright");

        // 1. Update speed.
        let speed = speedRef.current;

        if (forward && !backward) {
            speed += ACCELERATION * dt;
        } else if (backward && !forward) {
            // Brake first when moving forward.
            if (speed > 0.1) {
                speed = Math.max(0, speed - BRAKING * dt);
            } else {
                speed -= ACCELERATION * dt;
            }
        } else {
            // Gradually slow down when no pedal is pressed.
            if (speed > 0) {
                speed = Math.max(0, speed - FRICTION * dt);
            } else if (speed < 0) {
                speed = Math.min(0, speed + FRICTION * dt);
            }
        }

        speed = Math.max(
            -MAX_REVERSE_SPEED,
            Math.min(MAX_FORWARD_SPEED, speed)
        );

        speedRef.current = speed;

        // 2. Update steering.
        const steeringInput =
            (left ? 1 : 0) - (right ? 1 : 0);

        steeringRef.current +=
            (steeringInput * MAX_STEERING_ANGLE -
                steeringRef.current) *
            Math.min(1, dt * 8);

        // 3. Rotate the car only while moving.
        if (Math.abs(speed) > 0.05) {
            car.rotation.y +=
                steeringRef.current *
                TURN_RATE *
                Math.min(1, Math.abs(speed) / 3) *
                Math.sign(speed) *
                dt;
        }

        // 4. Move in the direction the car is facing.
        car.position.x -=
            Math.sin(car.rotation.y) * speed * dt;

        car.position.z -=
            Math.cos(car.rotation.y) * speed * dt;

        // 5. Follow the car with a smooth chase camera.
        if (!orbitEnabled) {
            desiredCameraPosition.current
                .set(0, 5.5, 9)
                .applyAxisAngle(
                    new Vector3(0, 1, 0),
                    car.rotation.y
                )
                .add(car.position);

            desiredCameraTarget.current
                .set(0, 0.8, -2)
                .applyAxisAngle(
                    new Vector3(0, 1, 0),
                    car.rotation.y
                )
                .add(car.position);

            // Initialize the camera without a large first-frame jump.
            if (cameraPosition.current.lengthSq() === 0) {
                cameraPosition.current.copy(camera.position);
                cameraTarget.current.copy(desiredCameraTarget.current);
            }

            const smoothing = 1 - Math.exp(-4 * dt);

            cameraPosition.current.lerp(
                desiredCameraPosition.current,
                smoothing
            );

            cameraTarget.current.lerp(
                desiredCameraTarget.current,
                smoothing
            );

            camera.position.copy(cameraPosition.current);
            camera.lookAt(cameraTarget.current);
        }
    });

    const speed = speedRef.current;
    const steering = steeringRef.current;

    return (
        <group ref={carRef} position={[0, 0, 0]}>
            {/* Main chassis */}
            <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.85, 0.42, 3.8]} />
                <meshStandardMaterial
                    color="#d71935"
                    metalness={0.2}
                    roughness={0.38}
                />
            </mesh>

            {/* Hood */}
            <mesh position={[0, 0.79, -1.2]} castShadow>
                <boxGeometry args={[1.72, 0.16, 1.25]} />
                <meshStandardMaterial color="#ed243d" roughness={0.35} />
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

            {/* Windshields */}
            <mesh position={[0, 1.13, -0.99]} rotation={[-0.3, 0, 0]}>
                <boxGeometry args={[1.25, 0.42, 0.045]} />
                <meshStandardMaterial color="#244653" roughness={0.18} />
            </mesh>

            <mesh position={[0, 1.13, 0.76]} rotation={[0.3, 0, 0]}>
                <boxGeometry args={[1.2, 0.38, 0.045]} />
                <meshStandardMaterial color="#244653" roughness={0.2} />
            </mesh>

            {/* Side windows */}
            {[-1, 1].map((side) => (
                <mesh key={side} position={[side * 0.711, 1.12, -0.1]}>
                    <boxGeometry args={[0.025, 0.34, 1.25]} />
                    <meshStandardMaterial color="#244653" roughness={0.2} />
                </mesh>
            ))}

            {/* Headlights */}
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

            {/* Animated wheels */}
            <Wheel
                position={[-0.94, 0.41, -1.18]}
                front
                speedRef={speedRef}
                steeringRef={steeringRef}
            />
            <Wheel
                position={[0.94, 0.41, -1.18]}
                front
                speedRef={speedRef}
                steeringRef={steeringRef}
            />
            <Wheel
                position={[-0.94, 0.41, 1.18]}
                speedRef={speedRef}
                steeringRef={steeringRef}
            />
            <Wheel
                position={[0.94, 0.41, 1.18]}
                speedRef={speedRef}
                steeringRef={steeringRef}
            />
            <Bumper />
        </group>
    );
}



function Bumper() {
    return (
        <mesh position={[0, 0.43, -2.02]} castShadow>
            <boxGeometry args={[1.9, 0.18, 0.16]} />
            <meshStandardMaterial
                color="#aeb6bf"
                metalness={0.55}
                roughness={0.35}
            />
        </mesh>
    );
}
