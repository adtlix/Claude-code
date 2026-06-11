import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, ShaderMaterial, Color, AdditiveBlending } from 'three'

const vertexShader = /* glsl */`
uniform float uTime;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vDisplacement;

// Simplex 3D noise
vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = inversesqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vNormal = normalize(normalMatrix * normal);
  float n1 = snoise(position * 0.6 + uTime * 0.18) * 0.22;
  float n2 = snoise(position * 1.4 - uTime * 0.12) * 0.10;
  float n3 = snoise(position * 3.0 + uTime * 0.25) * 0.04;
  float displacement = n1 + n2 + n3;
  vDisplacement = displacement;
  vec3 newPos = position + normal * displacement;
  vPosition = newPos;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
}
`

const fragmentShader = /* glsl */`
uniform vec3 uColorCore;
uniform vec3 uColorEdge;
uniform float uTime;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vDisplacement;

void main() {
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = 1.0 - max(dot(vNormal, viewDir), 0.0);
  fresnel = pow(fresnel, 2.2);

  float pulse = 0.85 + 0.15 * sin(uTime * 1.4);
  vec3 color = mix(uColorCore, uColorEdge, fresnel * pulse);

  // Bright displacement spikes
  float spike = step(0.18, vDisplacement);
  color += spike * uColorEdge * 0.6;

  float alpha = 0.55 + fresnel * 0.45;
  gl_FragColor = vec4(color * pulse, alpha);
}
`

const haloFrag = /* glsl */`
uniform float uTime;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = 1.0 - max(dot(vNormal, viewDir), 0.0);
  fresnel = pow(fresnel, 4.0);
  float pulse = 0.7 + 0.3 * sin(uTime * 0.9 + 1.5);
  gl_FragColor = vec4(0.0, 1.0, 0.255, fresnel * pulse * 0.5);
}
`

const haloVert = /* glsl */`
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export default function GlowOrb() {
  const meshRef = useRef<Mesh>(null)
  const haloRef = useRef<Mesh>(null)
  const matRef = useRef<ShaderMaterial>(null)
  const haloMatRef = useRef<ShaderMaterial>(null)

  const uniforms = useMemo(() => ({
    uTime:      { value: 0 },
    uColorCore: { value: new Color('#003010') },
    uColorEdge: { value: new Color('#00FF41') },
  }), [])

  const haloUniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.08
      meshRef.current.rotation.x = t * 0.04
    }
    if (haloRef.current) {
      haloRef.current.rotation.y = t * 0.06
      haloRef.current.rotation.z = t * 0.03
    }
    if (matRef.current) matRef.current.uniforms.uTime.value = t
    if (haloMatRef.current) haloMatRef.current.uniforms.uTime.value = t
  })

  return (
    <group position={[1.8, 0.4, -3]}>
      {/* Core orb */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.0, 7]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
      {/* Outer halo */}
      <mesh ref={haloRef}>
        <icosahedronGeometry args={[2.6, 3]} />
        <shaderMaterial
          ref={haloMatRef}
          vertexShader={haloVert}
          fragmentShader={haloFrag}
          uniforms={haloUniforms}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          side={2}
        />
      </mesh>
    </group>
  )
}
