import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2 } from 'three'
import ParticleField from './ParticleField'
import GlowOrb from './GlowOrb'
import GridPlane from './GridPlane'
import FloatingShards from './FloatingShards'

function CameraRig() {
  const t = useRef(0)
  useFrame(({ camera, clock }) => {
    t.current = clock.getElapsedTime()
    camera.position.x = Math.sin(t.current * 0.06) * 1.5
    camera.position.y = Math.cos(t.current * 0.04) * 0.6 + 2.5
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function Scene3D() {
  return (
    <Canvas
      className="canvas-bg"
      camera={{ position: [0, 2.5, 10], fov: 60, near: 0.1, far: 500 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={['#000000']} />

      <Suspense fallback={null}>
        <ambientLight intensity={0.02} />
        <pointLight position={[0, 0, 0]} intensity={3} color="#00FF41" distance={25} decay={2} />
        <pointLight position={[-8, 4, -4]} intensity={0.8} color="#004420" distance={20} decay={2} />

        <CameraRig />
        <GridPlane />
        <ParticleField />
        <GlowOrb />
        <FloatingShards />

        <EffectComposer>
          <Bloom
            intensity={1.4}
            luminanceThreshold={0.12}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new Vector2(0.0005, 0.0005)}
            radialModulation={false}
            modulationOffset={0}
          />
          <Vignette eskil={false} offset={0.1} darkness={0.7} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}
