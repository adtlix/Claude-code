import { useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';
import type { Task } from '../../types';

export const CATEGORY_COLORS: Record<string, string> = {
  work: '#3b82f6',
  personal: '#a855f7',
  health: '#22c55e',
  learning: '#f59e0b',
  urgent: '#ef4444',
  default: '#64748b',
};

interface TaskCardProps {
  task: Task;
  index: number;
}

export function TaskCard({ task, index }: TaskCardProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  const toggleTask = useAppStore((s) => s.toggleTask);
  const setEditingTask = useAppStore((s) => s.setEditingTask);
  const deleteTask = useAppStore((s) => s.deleteTask);
  const dragState = useAppStore((s) => s.dragState);

  const isBeingDragged = dragState.activeId === task.id;
  const colorHex = CATEGORY_COLORS[task.category] ?? CATEGORY_COLORS['default']!;
  const isDone = task.status === 'done';

  const tiltRef = useRef(0);
  const scaleRef = useRef(1);

  useFrame(() => {
    if (!groupRef.current) return;

    // Tilt physics: read drag delta from store, apply to rotation
    const targetTilt = isBeingDragged ? (dragState.delta.x / 400) * 0.5 : 0;
    tiltRef.current = THREE.MathUtils.lerp(tiltRef.current, targetTilt, 0.1);
    groupRef.current.rotation.z = tiltRef.current;

    // Lift card during drag
    const targetY = isBeingDragged ? 0.15 : 0;
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.12);

    // Scale on hover
    const targetScale = hovered ? 1.04 : isBeingDragged ? 1.02 : 1;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, 0.1);
    groupRef.current.scale.setScalar(scaleRef.current);
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    toggleTask(task.id);
  };

  const handleDoubleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setEditingTask(task.id);
  };

  const handleContextMenu = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    e.nativeEvent.preventDefault();
    deleteTask(task.id);
  };

  return (
    <group ref={groupRef} position={[0, index * -0.62, 0]}>
      <RoundedBox
        args={[1.85, 0.52, 0.07]}
        radius={0.05}
        smoothness={4}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      >
        <meshStandardMaterial
          color={isDone ? '#1e293b' : colorHex}
          emissive={colorHex}
          emissiveIntensity={hovered ? 0.2 : isBeingDragged ? 0.3 : 0.04}
          transparent
          opacity={isDone ? 0.45 : 0.88}
          roughness={0.25}
          metalness={0.15}
        />
      </RoundedBox>

      <Text
        position={[-0.7, 0.01, 0.045]}
        fontSize={0.095}
        maxWidth={1.55}
        textAlign="left"
        anchorX="left"
        anchorY="middle"
        color={isDone ? '#475569' : '#f1f5f9'}
      >
        {task.title}
      </Text>

      {/* Strikethrough for done tasks */}
      {isDone && (
        <mesh position={[0.025, 0.01, 0.046]}>
          <planeGeometry args={[1.5, 0.012]} />
          <meshBasicMaterial color="#475569" transparent opacity={0.7} />
        </mesh>
      )}

      {/* Category indicator dot */}
      <mesh position={[0.85, 0.01, 0.046]}>
        <circleGeometry args={[0.04, 12]} />
        <meshBasicMaterial color={colorHex} transparent opacity={isDone ? 0.3 : 0.8} />
      </mesh>
    </group>
  );
}
