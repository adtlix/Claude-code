import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ShaderMaterial } from 'three'

const vert = /* glsl */`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`

const frag = /* glsl */`
uniform float uTime;
varying vec2 vUv;

float grid(vec2 uv, float res){
  vec2 g=abs(fract(uv*res-.5)-.5)/fwidth(uv*res);
  return 1.-min(min(g.x,g.y),1.);
}

void main(){
  vec2 uv=vUv-.5;
  float dist=length(uv);
  float g1=grid(vUv,20.)*.4;
  float g2=grid(vUv,4.);
  float g=max(g1,g2);
  float fade=(1.-smoothstep(.0,.5,dist))*(1.-smoothstep(.3,.5,dist));
  // Cyan/violet sweep
  float sweepCyan   = g2*sin(uv.x*5. - uTime*.35)*.5+.5;
  float sweepViolet = g2*sin(uv.y*4. + uTime*.25)*.5+.5;
  float alpha = (g*fade)*0.35;
  vec3 cyan   = vec3(0.,.957,1.);
  vec3 violet = vec3(.545,.361,.965);
  vec3 col = mix(cyan, violet, sweepViolet*.4);
  gl_FragColor = vec4(col, alpha + sweepCyan*.06*fade);
}
`

export default function GridPlane() {
  const matRef  = useRef<ShaderMaterial>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.getElapsedTime()
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.5, 0]}>
      <planeGeometry args={[60, 60, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent depthWrite={false}
      />
    </mesh>
  )
}
