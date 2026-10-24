
import { Canvas } from "@react-three/fiber";

import Road from "./Road";
import Ground from "./Ground";
import Roadside from "./Roadside";
import Car from "./Car";

function SceneContent() {
    return (
        <>
            <ambientLight intensity={0.7} />

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
        </>
    );
}

export default function DrivingScene() {
    return (
        <Canvas
            shadows
            dpr={[1, 2]}
            camera={{
                position: [0, 5.5, 9],
                fov: 60,
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
