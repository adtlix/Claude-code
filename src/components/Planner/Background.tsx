import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
varying vec2 vUv;

void main() {
  vec3 cold = vec3(0.04, 0.04, 0.09);
  vec3 warm = vec3(0.06, 0.02, 0.14);
  vec3 active = vec3(0.02, 0.07, 0.14);

  float noise = sin(vUv.x * 7.0 + uTime * 0.25) * sin(vUv.y * 5.0 + uTime * 0.18) * 0.012;
  vec3 a = mix(cold, warm, uProgress);
  vec3 b = mix(cold, active, uProgress);
  vec3 color = mix(a, b, vUv.y + noise);

  gl_FragColor = vec4(color, 1.0);
}
`;

interface BackgroundProps {
  progress: number;
}

export function Background({ progress }: BackgroundProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms['uTime']!.value = clock.elapsedTime;
    matRef.current.uniforms['uProgress']!.value = progress;
  });

  return (
    <mesh position={[0, 0, -20]} scale={[80, 50, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ uTime: { value: 0 }, uProgress: { value: 0 } }}
        depthWrite={false}
      />
    </mesh>
  );
}
