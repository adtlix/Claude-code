import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, ShaderMaterial, BufferGeometry, Float32BufferAttribute } from 'three'

const vertexShader = /* glsl */`
attribute float aSize;
attribute float aPhase;
uniform float uTime;
varying float vAlpha;

void main() {
  vAlpha = 0.3 + 0.4 * sin(aPhase + uTime * 0.5);
  vec3 pos = position;
  pos.y += sin(uTime * 0.2 + aPhase) * 0.08;
  pos.x += cos(uTime * 0.15 + aPhase * 1.3) * 0.05;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = aSize * (300.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`

const fragmentShader = /* glsl */`
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float alpha = (1.0 - d * 2.0) * vAlpha;
  gl_FragColor = vec4(0.0, 1.0, 0.255, alpha);
}
`

const COUNT = 2800

export default function ParticleField() {
  const matRef = useRef<ShaderMaterial>(null)
  const geoRef = useRef<BufferGeometry>(null)

  const { positions, sizes, phases } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const sizes = new Float32Array(COUNT)
    const phases = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      const r = 12 + Math.random() * 20
      const theta = Math.random() * Math.PI * 2
      const phi = (Math.random() - 0.5) * Math.PI * 0.7

      positions[i * 3]     = r * Math.cos(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) - 1
      positions[i * 3 + 2] = r * Math.cos(phi) * Math.sin(theta) - 8

      sizes[i] = 0.4 + Math.random() * 1.4
      phases[i] = Math.random() * Math.PI * 2
    }
    return { positions, sizes, phases }
  }, [])

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  return (
    <points ref={geoRef as never}>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={COUNT} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aPhase" count={COUNT} array={phases} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ uTime: { value: 0 } }}
        transparent
        depthWrite={false}
      />
    </points>
  )
}
