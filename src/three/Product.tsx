import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Aurora — a procedurally-built premium device:
 * a machined titanium core, a glowing accent ring, and a
 * faceted sapphire-glass dome. No external model required.
 */
export default function Product({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null!)
  const ring = useRef<THREE.Mesh>(null!)

  useFrame((_, delta) => {
    if (group.current) {
      // continuous showcase rotation
      group.current.rotation.y += delta * 0.35
      // gentle parallax toward the cursor
      const targetX = pointer.current.y * 0.25
      const targetZ = pointer.current.x * 0.2
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.05)
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetZ, 0.05)
    }
    if (ring.current) {
      ring.current.rotation.z += delta * 0.8
    }
  })

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.7} floatingRange={[-0.08, 0.08]}>
      <group ref={group} scale={1.35} dispose={null}>
        {/* Brushed titanium core body */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1, 1, 0.42, 96]} />
          <meshStandardMaterial
            color="#c9ccd6"
            metalness={1}
            roughness={0.28}
            envMapIntensity={1.4}
          />
        </mesh>

        {/* Chamfered bezel */}
        <mesh position={[0, 0.22, 0]} castShadow>
          <torusGeometry args={[1, 0.07, 32, 96]} />
          <meshStandardMaterial color="#e8eaf0" metalness={1} roughness={0.15} envMapIntensity={1.8} />
        </mesh>
        <mesh position={[0, -0.22, 0]} castShadow>
          <torusGeometry args={[1, 0.07, 32, 96]} />
          <meshStandardMaterial color="#e8eaf0" metalness={1} roughness={0.15} envMapIntensity={1.8} />
        </mesh>

        {/* Glowing accent ring (drives the bloom) */}
        <mesh ref={ring} position={[0, 0.235, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.72, 0.022, 24, 120]} />
          <meshStandardMaterial
            color="#9b8cff"
            emissive="#9b8cff"
            emissiveIntensity={3.2}
            toneMapped={false}
          />
        </mesh>

        {/* Inner emissive disc seen through the glass */}
        <mesh position={[0, 0.235, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.66, 96]} />
          <meshStandardMaterial
            color="#0b0d14"
            emissive="#3ad6c5"
            emissiveIntensity={0.5}
            metalness={0.6}
            roughness={0.3}
            toneMapped={false}
          />
        </mesh>

        {/* Faceted sapphire-glass dome */}
        <mesh position={[0, 0.28, 0]} castShadow>
          <sphereGeometry args={[0.82, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2.4]} />
          <MeshTransmissionMaterial
            transmission={1}
            thickness={0.45}
            roughness={0.04}
            ior={1.7}
            chromaticAberration={0.06}
            anisotropy={0.3}
            distortion={0.2}
            distortionScale={0.3}
            temporalDistortion={0.1}
            color="#dfe2ff"
            background={new THREE.Color('#070810')}
          />
        </mesh>

        {/* Crown / side detail */}
        <mesh position={[1.02, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.16, 32]} />
          <meshStandardMaterial color="#9b8cff" metalness={1} roughness={0.2} emissive="#9b8cff" emissiveIntensity={0.4} />
        </mesh>
      </group>
    </Float>
  )
}
