import { useRef } from 'react';
import { Text, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ErrorBoundary } from '../ErrorBoundary';
import { TaskCard } from './TaskCard';
import type { Task } from '../../types';
import { formatTime } from '../../lib/dateUtils';

interface DayColumnProps {
  dayId: string;
  name: string;
  tasks: Task[];
  positionX: number;
  isDropTarget: boolean;
}

function DayColumnInner({ dayId, name, tasks, isDropTarget }: Omit<DayColumnProps, 'positionX'>) {
  const plateRef = useRef<THREE.Mesh>(null!);
  const today = new Date().toISOString().split('T')[0];
  const isToday = dayId === today;
  const doneCount = tasks.filter((t) => t.status === 'done').length;

  useFrame(() => {
    if (!plateRef.current) return;
    const targetOpacity = isDropTarget ? 0.75 : isToday ? 0.5 : 0.35;
    const mat = plateRef.current.material as THREE.MeshStandardMaterial;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1);
    const targetScale = isDropTarget ? 1.025 : 1;
    plateRef.current.scale.x = THREE.MathUtils.lerp(plateRef.current.scale.x, targetScale, 0.1);
    plateRef.current.scale.z = THREE.MathUtils.lerp(plateRef.current.scale.z, targetScale, 0.1);
  });

  return (
    <group>
      {/* Base plate */}
      <RoundedBox
        ref={plateRef}
        args={[2.05, 8.5, 0.08]}
        radius={0.1}
        smoothness={4}
        position={[0, -0.5, -0.12]}
      >
        <meshStandardMaterial
          color={isToday ? '#1e1b4b' : '#0f172a'}
          transparent
          opacity={0.35}
          roughness={0.9}
        />
      </RoundedBox>

      {/* Today highlight border */}
      {isToday && (
        <RoundedBox args={[2.1, 8.55, 0.06]} radius={0.1} smoothness={4} position={[0, -0.5, -0.13]}>
          <meshStandardMaterial
            color="#6366f1"
            emissive="#6366f1"
            emissiveIntensity={0.4}
            transparent
            opacity={0.25}
          />
        </RoundedBox>
      )}

      {/* Day name */}
      <Text
        position={[0, 3.6, 0.05]}
        fontSize={0.2}
        color={isToday ? '#a5b4fc' : '#94a3b8'}
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        {name.slice(0, 3).toUpperCase()}
      </Text>

      {/* Date */}
      <Text
        position={[0, 3.25, 0.05]}
        fontSize={0.11}
        color="#475569"
        anchorX="center"
        anchorY="middle"
      >
        {formatTime(dayId)}
      </Text>

      {/* Task progress */}
      <Text
        position={[0, 2.9, 0.05]}
        fontSize={0.105}
        color={doneCount > 0 ? '#22c55e' : '#334155'}
        anchorX="center"
        anchorY="middle"
      >
        {doneCount}/{tasks.length}
      </Text>

      {/* Tasks (max 7 visible) */}
      <group position={[0, 2.4, 0]}>
        {tasks.slice(0, 7).map((task, i) => (
          <TaskCard key={task.id} task={task} index={i} />
        ))}
      </group>

      {/* Overflow indicator */}
      {tasks.length > 7 && (
        <Text
          position={[0, -1.6, 0.05]}
          fontSize={0.1}
          color="#475569"
          anchorX="center"
          anchorY="middle"
        >
          +{tasks.length - 7} more
        </Text>
      )}
    </group>
  );
}

export function DayColumn({ positionX, ...props }: DayColumnProps) {
  return (
    <group position={[positionX, 0, 0]}>
      <ErrorBoundary
        fallback={
          <group>
            <Text fontSize={0.15} color="#ef4444" position={[0, 0, 0]}>
              Error — {props.name}
            </Text>
          </group>
        }
      >
        <DayColumnInner {...props} />
      </ErrorBoundary>
    </group>
  );
}
