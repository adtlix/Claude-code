import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ShaderMaterial, BufferGeometry, Float32BufferAttribute } from 'three'

const vert = /* glsl */`
attribute float aSize;
attribute float aPhase;
attribute float aColorMix;
uniform float uTime;
varying float vAlpha;
varying float vColorMix;

void main(){
  vAlpha = .25 + .45*sin(aPhase + uTime*.45);
  vColorMix = aColorMix;
  vec3 p = position;
  p.y += sin(uTime*.18 + aPhase)*.1;
  p.x += cos(uTime*.13 + aPhase*1.3)*.07;
  vec4 mv = modelViewMatrix * vec4(p,1.);
  gl_PointSize = aSize*(260./-mv.z);
  gl_Position = projectionMatrix * mv;
}
`

const frag = /* glsl */`
varying float vAlpha;
varying float vColorMix;

void main(){
  vec2 uv = gl_PointCoord - .5;
  float d = length(uv);
  if(d>.5) discard;
  float a = (1.-d*2.)*vAlpha;
  vec3 cyan   = vec3(0.,0.957,1.);
  vec3 violet = vec3(.545,.361,.965);
  vec3 col = mix(cyan, violet, vColorMix);
  gl_FragColor = vec4(col, a);
}
`

const COUNT = 2400

export default function ParticleField() {
  const matRef  = useRef<ShaderMaterial>(null)
  const geoRef  = useRef<BufferGeometry>(null)

  const { positions, sizes, phases, colorMix } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const sizes     = new Float32Array(COUNT)
    const phases    = new Float32Array(COUNT)
    const colorMix  = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      const r = 10 + Math.random() * 22
      const theta = Math.random() * Math.PI * 2
      const phi   = (Math.random() - .5) * Math.PI * .65
      positions[i*3]   = r * Math.cos(phi) * Math.cos(theta)
      positions[i*3+1] = r * Math.sin(phi) - 1
      positions[i*3+2] = r * Math.cos(phi) * Math.sin(theta) - 8
      sizes[i]     = .4 + Math.random() * 1.2
      phases[i]    = Math.random() * Math.PI * 2
      colorMix[i]  = Math.random()
    }
    return { positions, sizes, phases, colorMix }
  }, [])

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.getElapsedTime()
  })

  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={COUNT} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aPhase" count={COUNT} array={phases} itemSize={1} />
        <bufferAttribute attach="attributes-aColorMix" count={COUNT} array={colorMix} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={{ uTime: { value: 0 } }}
        transparent depthWrite={false}
      />
    </points>
  )
}
