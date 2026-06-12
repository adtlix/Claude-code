import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
#define PI 3.14159265359
uniform float uProgress;
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
varying vec2 vUv;

void main() {
  vec2 c = vec2(0.5);
  vec2 dir = vUv - c;
  float dist = length(dir);

  if (dist < 0.36 || dist > 0.49) discard;

  // Map angle: start at top (-PI/2), go clockwise
  float angle = atan(dir.x, dir.y); // atan2 clockwise from top
  float t = (angle + PI) / (2.0 * PI); // 0..1, clockwise from top

  float mask = step(t, uProgress);
  if (mask < 0.5) discard;

  vec3 color = mix(uColorA, uColorB, t / max(uProgress, 0.001));
  float pulse = 0.88 + 0.12 * sin(uTime * 1.8 + t * 6.28);

  gl_FragColor = vec4(color * pulse, 0.95);
}
`;

interface ProgressArcProps {
  progress: number;
}

export function ProgressArc({ progress }: ProgressArcProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  useEffect(() => {
    if (matRef.current) matRef.current.uniforms['uProgress']!.value = progress;
  }, [progress]);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms['uTime']!.value = clock.elapsedTime;
  });

  const pct = Math.round(progress * 100);

  return (
    <group position={[0, 5.2, 0]}>
      <mesh>
        <planeGeometry args={[2.6, 2.6]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            uProgress: { value: 0 },
            uTime: { value: 0 },
            uColorA: { value: new THREE.Color('#3b82f6') },
            uColorB: { value: new THREE.Color('#a855f7') },
          }}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Text
        position={[0, 0, 0.01]}
        fontSize={0.38}
        color="#f1f5f9"
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        {pct}%
      </Text>
    </group>
  );
}
