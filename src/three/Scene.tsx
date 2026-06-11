import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2 } from 'three'
import ParticleField from './ParticleField'
import Crystal from './Crystal'
import GridPlane from './GridPlane'
import FloatingShards from './FloatingShards'
import { useTime, pad } from '../hooks/useTime'

function CameraRig() {
  const t = useRef(0)
  useFrame(({ camera, clock }) => {
    t.current = clock.getElapsedTime()
    camera.position.x = Math.sin(t.current * 0.055) * 1.2
    camera.position.y = Math.cos(t.current * 0.038) * 0.5 + 2.4
    camera.lookAt(0, 0, 0)
  })
  return null
}

function ClockText() {
  const now = useTime()
  const h = pad(now.getHours())
  const m = pad(now.getMinutes())
  const s = pad(now.getSeconds())
  const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const timeStr = `${h}:${m}:${s}`
  const dateStr = `${DAYS[now.getDay()]}  ${pad(now.getDate())} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`

  return (
    <group position={[-4.5, 1.8, -3]}>
      <Text fontSize={1.05} color="#00F5FF" anchorX="left" anchorY="middle"
        material-toneMapped={false} material-transparent={true} material-opacity={0.92}>
        {timeStr}
      </Text>
      <Text position={[0, -0.75, 0]} fontSize={0.24} color="#8B5CF6" anchorX="left" anchorY="middle"
        material-toneMapped={false} material-transparent={true} material-opacity={0.75}>
        {dateStr}
      </Text>
    </group>
  )
}

export default function Scene3D() {
  return (
    <Canvas
      className="canvas-bg"
      camera={{ position: [0, 2.4, 10], fov: 58, near: 0.1, far: 500 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={['#000510']} />

      <Suspense fallback={null}>
        <ambientLight intensity={0.015} />
        <pointLight position={[0, 0, 0]} intensity={4} color="#00F5FF" distance={28} decay={2} />
        <pointLight position={[-8, 4, -4]} intensity={1.2} color="#8B5CF6" distance={22} decay={2} />
        <pointLight position={[6, -2, -6]} intensity={0.6} color="#F0ABFC" distance={18} decay={2} />

        <CameraRig />
        <GridPlane />
        <ParticleField />
        <Crystal />
        <FloatingShards />
        <ClockText />

        <EffectComposer>
          <Bloom intensity={1.6} luminanceThreshold={0.08} luminanceSmoothing={0.85} mipmapBlur />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new Vector2(0.0006, 0.0006)}
            radialModulation={false}
            modulationOffset={0}
          />
          <Vignette eskil={false} offset={0.08} darkness={0.72} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}
