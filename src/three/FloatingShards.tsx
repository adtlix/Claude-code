import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'

interface ShardProps {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
  speed: number
  phase: number
}

function Shard({ position, rotation, scale, speed, phase }: ShardProps) {
  const ref = useRef<Group>(null)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.x = rotation[0] + t * speed * 0.4
    ref.current.rotation.y = rotation[1] + t * speed * 0.6
    ref.current.rotation.z = rotation[2] + t * speed * 0.3
    ref.current.position.y = position[1] + Math.sin(t * 0.3 + phase) * 0.4
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#00FF41"
          emissive="#00FF41"
          emissiveIntensity={0.6}
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  )
}

export default function FloatingShards() {
  const shards = useMemo<ShardProps[]>(() => [
    { position: [-7, 1, -5], rotation: [0.3, 0.5, 0.1], scale: 0.6, speed: 0.3, phase: 0 },
    { position: [6, -1, -7], rotation: [0.8, 0.2, 0.6], scale: 0.4, speed: 0.5, phase: 1.2 },
    { position: [-5, 3, -9], rotation: [0.1, 0.9, 0.3], scale: 0.9, speed: 0.2, phase: 2.4 },
    { position: [9, 2, -4], rotation: [0.6, 0.4, 0.8], scale: 0.35, speed: 0.7, phase: 0.8 },
    { position: [-9, -2, -6], rotation: [0.4, 0.7, 0.2], scale: 0.55, speed: 0.4, phase: 1.9 },
    { position: [4, 4, -11], rotation: [0.9, 0.1, 0.5], scale: 0.7, speed: 0.25, phase: 3.1 },
    { position: [-3, -3, -8], rotation: [0.2, 0.6, 0.9], scale: 0.45, speed: 0.6, phase: 0.4 },
    { position: [7, -3, -10], rotation: [0.5, 0.3, 0.7], scale: 0.5, speed: 0.35, phase: 2.0 },
  ], [])

  return (
    <group>
      {shards.map((s, i) => <Shard key={i} {...s} />)}
    </group>
  )
}
