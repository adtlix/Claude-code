import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { ShaderMaterial } from 'three'

const vertexShader = /* glsl */`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = /* glsl */`
uniform float uTime;
varying vec2 vUv;

float grid(vec2 uv, float res) {
  vec2 g = abs(fract(uv * res - 0.5) - 0.5) / fwidth(uv * res);
  return 1.0 - min(min(g.x, g.y), 1.0);
}

void main() {
  vec2 uv = vUv - 0.5;
  float dist = length(uv);

  // Two grid scales
  float g1 = grid(vUv, 20.0) * 0.5;
  float g2 = grid(vUv, 4.0);
  float g = max(g1, g2);

  // Fade from center + perspective
  float fade = 1.0 - smoothstep(0.0, 0.5, dist);
  float edgeFade = 1.0 - smoothstep(0.3, 0.5, dist);

  // Slow pulse sweep
  float sweep = sin(uv.x * 6.0 - uTime * 0.4) * 0.5 + 0.5;
  float highlight = g2 * sweep * 0.3;

  float alpha = (g * fade + highlight) * edgeFade;
  gl_FragColor = vec4(0.0, 1.0, 0.255, alpha * 0.4);
}
`

export default function GridPlane() {
  const matRef = useRef<ShaderMaterial>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.getElapsedTime()
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.5, 0]}>
      <planeGeometry args={[60, 60, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}
