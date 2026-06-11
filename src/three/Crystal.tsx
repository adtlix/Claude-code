import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Group, Mesh, ShaderMaterial, Color, AdditiveBlending, BufferGeometry, Float32BufferAttribute, LineSegments, LineBasicMaterial } from 'three'

// ── Shared Noise ─────────────────────────────────────────────────────────────
const NOISE_GLSL = /* glsl */`
vec4 permute(vec4 x){return mod(((x*34.)+1.)*x,289.);}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod(i,289.);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=1./7.;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=inversesqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`

// ── Core Crystal Shader ───────────────────────────────────────────────────────
const coreVert = /* glsl */`
${NOISE_GLSL}
uniform float uTime;
varying vec3 vNormal;
varying vec3 vPos;
varying float vDisplace;

void main(){
  vNormal = normalize(normalMatrix * normal);
  float n = snoise(position*0.9 + uTime*0.12)*0.12
           + snoise(position*2.2 - uTime*0.18)*0.05;
  vDisplace = n;
  vec3 p = position + normal*n;
  vPos = (modelMatrix * vec4(p,1.)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.);
}
`
const coreFrag = /* glsl */`
uniform vec3 uCyan;
uniform vec3 uViolet;
uniform float uTime;
varying vec3 vNormal;
varying vec3 vPos;
varying float vDisplace;

void main(){
  vec3 view = normalize(cameraPosition - vPos);
  float fresnel = pow(1. - max(dot(vNormal,view),0.), 2.4);
  float height = clamp((vPos.y + 2.)/4., 0., 1.);
  vec3 col = mix(uCyan, uViolet, height);
  col += fresnel * uCyan * 1.1;
  col += step(.09, vDisplace)*uCyan*0.5;
  float pulse = .85 + .15*sin(uTime*1.6);
  gl_FragColor = vec4(col*pulse, (.55+fresnel*.45)*pulse);
}
`

// ── Shard Shader ─────────────────────────────────────────────────────────────
const shardFrag = /* glsl */`
uniform vec3 uColor;
uniform float uTime;
varying vec3 vNormal;
varying vec3 vPos;
varying float vDisplace;

void main(){
  vec3 view = normalize(cameraPosition - vPos);
  float fresnel = pow(1. - max(dot(vNormal,view),0.), 3.);
  vec3 col = uColor + fresnel * uColor * 0.8;
  float pulse = .7 + .3*sin(uTime*2.+vPos.x*3.);
  gl_FragColor = vec4(col*pulse, (.35+fresnel*.5)*pulse);
}
`

function CrystalMesh({ position, rotation, scale, colorKey, detail = 1 }: {
  position: [number,number,number]
  rotation: [number,number,number]
  scale: number
  colorKey: 'cyan' | 'violet' | 'pink'
  detail?: number
}) {
  const ref = useRef<Mesh>(null)
  const matRef = useRef<ShaderMaterial>(null)

  const color = colorKey === 'cyan' ? new Color('#00F5FF')
    : colorKey === 'violet' ? new Color('#8B5CF6')
    : new Color('#F0ABFC')

  const uniforms = useMemo(() => ({
    uColor: { value: color },
    uTime: { value: 0 },
  }), [])

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.getElapsedTime()
    if (ref.current) {
      ref.current.rotation.x += 0.004
      ref.current.rotation.y += 0.006
    }
  })

  return (
    <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
      <icosahedronGeometry args={[1, detail]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={coreVert}
        fragmentShader={shardFrag}
        uniforms={uniforms}
        transparent depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>
  )
}

function EnergyLines({ orbitPositions }: { orbitPositions: [number,number,number][] }) {
  const geo = useMemo(() => {
    const g = new BufferGeometry()
    const pts: number[] = []
    orbitPositions.forEach(([x,y,z]) => {
      pts.push(0, 0, 0, x, y, z)
    })
    g.setAttribute('position', new Float32BufferAttribute(pts, 3))
    return g
  }, [])

  const matRef = useRef<LineBasicMaterial>(null)
  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.opacity = 0.2 + 0.15 * Math.sin(clock.getElapsedTime() * 1.8)
  })

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial ref={matRef} color="#00F5FF" transparent opacity={0.3} />
    </lineSegments>
  )
}

export default function Crystal() {
  const groupRef = useRef<Group>(null)
  const coreRef  = useRef<Mesh>(null)
  const coreMatRef = useRef<ShaderMaterial>(null)
  const orbit1Ref = useRef<Group>(null)
  const orbit2Ref = useRef<Group>(null)
  const { mouse } = useThree()

  const coreUniforms = useMemo(() => ({
    uTime:   { value: 0 },
    uCyan:   { value: new Color('#00F5FF') },
    uViolet: { value: new Color('#8B5CF6') },
  }), [])

  // Orbit positions (for energy lines)
  const innerPos: [number,number,number][] = useMemo(() => [
    [2.4, 0, 0],
    [-1.2, 0, 2.08],
    [-1.2, 0, -2.08],
  ], [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (coreMatRef.current) coreMatRef.current.uniforms.uTime.value = t
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.07
      coreRef.current.rotation.x = t * 0.04
    }
    if (orbit1Ref.current) orbit1Ref.current.rotation.y = t * 0.22
    if (orbit2Ref.current) {
      orbit2Ref.current.rotation.y = -t * 0.14
      orbit2Ref.current.rotation.x = t * 0.08
    }
    if (groupRef.current) {
      // Subtle mouse tilt
      groupRef.current.rotation.y += (mouse.x * 0.3 - groupRef.current.rotation.y) * 0.03
      groupRef.current.rotation.x += (-mouse.y * 0.15 - groupRef.current.rotation.x) * 0.03
    }
  })

  return (
    <group ref={groupRef} position={[1.5, 0, -2]}>
      {/* Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.4, 5]} />
        <shaderMaterial
          ref={coreMatRef}
          vertexShader={coreVert}
          fragmentShader={coreFrag}
          uniforms={coreUniforms}
          transparent depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      {/* Energy lines from core to inner shards */}
      <EnergyLines orbitPositions={innerPos} />

      {/* Inner orbit - 3 violet shards */}
      <group ref={orbit1Ref}>
        {innerPos.map(([x,y,z], i) => (
          <CrystalMesh key={i}
            position={[x, y, z]}
            rotation={[i * 1.2, i * 0.8, 0]}
            scale={0.42}
            colorKey={i === 1 ? 'violet' : 'pink'}
            detail={1}
          />
        ))}
      </group>

      {/* Outer orbit - 5 tiny cyan shards at different inclinations */}
      <group ref={orbit2Ref}>
        {[0,1,2,3,4].map(i => {
          const angle = (i / 5) * Math.PI * 2
          return (
            <CrystalMesh key={i}
              position={[Math.cos(angle) * 3.8, Math.sin(angle * 0.6) * 0.8, Math.sin(angle) * 3.8]}
              rotation={[angle * 0.5, angle, 0]}
              scale={0.22}
              colorKey={i % 2 === 0 ? 'cyan' : 'violet'}
              detail={0}
            />
          )
        })}
      </group>
    </group>
  )
}
