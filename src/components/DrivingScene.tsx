
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Road from "./Road";
import Ground from "./Ground";
import Roadside from "./Roadside";
import Car from "./Car";

export default function DrivingScene() {
    const [orbitEnabled, setOrbitEnabled] = useState(false);

    return (
        <div className="relative h-full w-full">
            <div className="absolute right-4 top-4 z-10">
                <button
                    onClick={() => setOrbitEnabled((enabled) => !enabled)}
                    className="rounded-lg border border-white/20 bg-slate-950/85 px-4 py-2 text-sm text-white shadow-lg backdrop-blur hover:bg-slate-800"
                >
                    Orbit: {orbitEnabled ? "ON" : "OFF"}
                </button>
            </div>

            <Canvas
                shadows
                dpr={[1, 2]}
                camera={{
                    position: [0, 5.5, 9],
                    fov: 60,
                    near: 0.1,
                    far: 2000,
                }}
            >
                <color attach="background" args={["#b9ddf4"]} />
                <fog attach="fog" args={["#b9ddf4", 150, 500]} />

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
                />

                <Ground />
                <Road />
                <Roadside />
                <Car orbitEnabled={orbitEnabled} />

                {orbitEnabled && (
                    <OrbitControls
                        makeDefault
                        target={[0, 0.6, 0]}
                        enableDamping
                        minDistance={4}
                        maxDistance={35}
                        maxPolarAngle={Math.PI / 2.05}
                    />
                )}
            </Canvas>
        </div>
    );
}
