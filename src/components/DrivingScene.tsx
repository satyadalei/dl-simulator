
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Road from "./Road";
import Car from "./Car";
import Ground from "./Ground";
import Roadside from "./Roadside";

function SceneContent() {
    return (
        <>
            {/* Soft base illumination */}
            <ambientLight intensity={0.7} />

            {/* Daylight and shadows */}
            <directionalLight
                position={[-8, 16, 8]}
                intensity={2.2}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-left={-18}
                shadow-camera-right={18}
                shadow-camera-top={25}
                shadow-camera-bottom={-25}
                shadow-normalBias={0.04}
            />

            <Ground />
            <Road />
            <Roadside />
            <Car />

            <OrbitControls
                target={[0, 0.6, 0]}
                enableDamping
                minDistance={6}
                maxDistance={35}
                maxPolarAngle={Math.PI / 2.05}
            />
        </>
    );
}

export default function DrivingScene() {
    return (
        <Canvas
            shadows
            dpr={[1, 2]}
            camera={{
                position: [9, 9, 14],
                fov: 50,
                near: 0.1,
                far: 500,
            }}
        >
            <color attach="background" args={["#b9ddf4"]} />
            <fog attach="fog" args={["#b9ddf4", 90, 240]} />

            <SceneContent />
        </Canvas>
    );
}
