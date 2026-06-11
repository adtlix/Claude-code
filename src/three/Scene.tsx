import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import { EffectComposer, Bloom, SMAA, Vignette } from '@react-three/postprocessing'
import Product from './Product'

export default function Scene() {
  const pointer = useRef({ x: 0, y: 0 })

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.6, 5], fov: 38, near: 0.1, far: 100 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      onPointerMove={(e) => {
        pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
        pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
      }}
    >
      <color attach="background" args={['#05060a']} />
      <fog attach="fog" args={['#05060a', 7, 16]} />

      <ambientLight intensity={0.35} />
      <spotLight position={[5, 8, 4]} angle={0.4} penumbra={1} intensity={120} castShadow color="#ffffff" />
      <pointLight position={[-6, -2, -4]} intensity={40} color="#3ad6c5" />
      <pointLight position={[6, 2, -2]} intensity={30} color="#9b8cff" />

      <Suspense fallback={null}>
        <Product pointer={pointer} />

        <ContactShadows
          position={[0, -1.25, 0]}
          opacity={0.55}
          scale={11}
          blur={3}
          far={4}
          resolution={512}
          color="#000000"
        />

        <Environment preset="city" environmentIntensity={0.9} />
      </Suspense>

      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={0.85} mipmapBlur />
        <SMAA />
        <Vignette eskil={false} offset={0.18} darkness={0.72} />
      </EffectComposer>

      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Canvas>
  )
}
