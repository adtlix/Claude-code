import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Background } from './Background';
import { WeekGrid } from './WeekGrid';
import { ProgressArc } from './ProgressArc';

interface PlannerSceneProps {
  progress: number;
  dropTargetDayId: string | null;
  interactionDisabled: boolean;
}

export function PlannerScene({ progress, dropTargetDayId, interactionDisabled }: PlannerSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 1, 14], fov: 55, near: 0.1, far: 200 }}
      dpr={[1, 2]}
      shadows
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      style={{
        position: 'absolute',
        inset: 0,
        // Disable pointer events on canvas when command palette is open
        pointerEvents: interactionDisabled ? 'none' : 'auto',
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 10, 6]}
          intensity={1.4}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-8, 5, 3]} intensity={0.6} color="#6366f1" />

        <Background progress={progress} />
        <WeekGrid dropTargetDayId={dropTargetDayId} />
        <ProgressArc progress={progress} />

        <OrbitControls
          enabled={!interactionDisabled}
          enablePan={false}
          minDistance={6}
          maxDistance={22}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          enableDamping
          dampingFactor={0.08}
        />
      </Suspense>
    </Canvas>
  );
}
