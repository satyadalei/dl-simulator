
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Road from "./Road";
import Car from "./Car";
import Ground from "./Ground";

function SceneContent() {
    return (
        <>
            {/* General illumination */}
            <ambientLight intensity={1.2} />

            {/* Directional sunlight */}
            <directionalLight
                position={[8, 12, 5]}
                intensity={2}
                castShadow
            />

            <Ground />
            <Road />
            <Car />

            {/* Camera navigation */}
            <OrbitControls
                target={[0, 0.5, 0]}
                enableDamping
                maxPolarAngle={Math.PI / 2.05}
            />
        </>
    );
}

export default function DrivingScene() {
    return (
        <Canvas
            shadows
            camera={{
                position: [8, 8, 12],
                fov: 50,
                near: 0.1,
                far: 300,
            }}
        >
            <color attach="background" args={["#b9ddf4"]} />
            <SceneContent />
        </Canvas>
    );
}
