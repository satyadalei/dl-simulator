import { Canvas } from '@react-three/fiber';
import { KeyboardControls, OrbitControls } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import { useGameStore } from './store/store';
import { Vehicle } from './components/Vehicle';
import { Environment } from './components/Environment';
import { Hud } from './components/Hud';

export default function App() {
  const currentInstruction = useGameStore((state) => state.currentInstruction);

  // Map keys for player input
  const keyboardMap = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  ];

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* 2D HTML User Interface Overlay */}
      <Hud />

      {/* 3D Simulation View */}
      <KeyboardControls map={keyboardMap}>
        <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />

          <Physics debug>
            {/* The Driving Car */}
            <Vehicle />

            {/* Road, Signs, and Checkpoints */}
            <Environment />

            {/* Static Ground Floor */}
            <RigidBody type="fixed">
              <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#2f855a" />
              </mesh>
            </RigidBody>
          </Physics>

          <OrbitControls makeDefault />
        </Canvas>
      </KeyboardControls>
    </div>
  );
}