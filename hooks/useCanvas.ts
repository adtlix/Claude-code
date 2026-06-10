'use client';

import { useRef, useCallback, useEffect } from 'react';
import { useMotionValue, useAnimationControls } from 'framer-motion';
import type { CanvasNode } from '@/types';

const MIN_SCALE = 0.08;
const MAX_SCALE = 4;
const CAMERA_EASE = [0.32, 0.72, 0, 1] as const;
const CAMERA_DURATION = 0.6;

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

export function useCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();

  const motionX = useMotionValue(0);
  const motionY = useMotionValue(0);
  const motionScale = useMotionValue(1);

  const isDragging = useRef(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, tx: 0, ty: 0 });

  // Native wheel handler with passive:false
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function onWheel(e: WheelEvent) {
      e.preventDefault();

      const rect = el!.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      const oldScale = motionScale.get();
      const delta = e.deltaY < 0 ? 1.08 : 0.92;
      const newScale = clamp(oldScale * delta, MIN_SCALE, MAX_SCALE);
      const ratio = newScale / oldScale;

      const oldX = motionX.get();
      const oldY = motionY.get();

      motionX.set(cursorX - (cursorX - oldX) * ratio);
      motionY.set(cursorY - (cursorY - oldY) * ratio);
      motionScale.set(newScale);
    }

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [motionX, motionY, motionScale]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      tx: motionX.get(),
      ty: motionY.get(),
    };
  }, [motionX, motionY]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.mouseX;
    const dy = e.clientY - dragStart.current.mouseY;
    motionX.set(dragStart.current.tx + dx);
    motionY.set(dragStart.current.ty + dy);
  }, [motionX, motionY]);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const panToNode = useCallback(
    (node: CanvasNode, containerSize: { w: number; h: number }) => {
      const scale = motionScale.get();
      const targetX = containerSize.w / 2 - node.x * scale;
      const targetY = containerSize.h / 2 - node.y * scale;

      controls.start({
        x: targetX,
        y: targetY,
        scale,
        transition: { duration: CAMERA_DURATION, ease: CAMERA_EASE },
      }).then(() => {
        motionX.set(targetX);
        motionY.set(targetY);
      });
    },
    [controls, motionX, motionY, motionScale]
  );

  const zoomOutToFit = useCallback(
    (nodes: CanvasNode[], containerSize: { w: number; h: number }, padding = 80) => {
      if (nodes.length === 0) return;

      const NODE_W = 280;
      const NODE_H = 180;

      const minX = Math.min(...nodes.map(n => n.x)) - NODE_W / 2;
      const maxX = Math.max(...nodes.map(n => n.x)) + NODE_W / 2;
      const minY = Math.min(...nodes.map(n => n.y)) - NODE_H / 2;
      const maxY = Math.max(...nodes.map(n => n.y)) + NODE_H / 2;

      const bboxW = maxX - minX + padding * 2;
      const bboxH = maxY - minY + padding * 2;

      const scale = clamp(
        Math.min(containerSize.w / bboxW, containerSize.h / bboxH),
        0.1,
        1.5
      );

      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      const targetX = containerSize.w / 2 - centerX * scale;
      const targetY = containerSize.h / 2 - centerY * scale;

      controls.start({
        x: targetX,
        y: targetY,
        scale,
        transition: { duration: 0.8, ease: CAMERA_EASE },
      }).then(() => {
        motionX.set(targetX);
        motionY.set(targetY);
        motionScale.set(scale);
      });
    },
    [controls, motionX, motionY, motionScale]
  );

  return {
    containerRef,
    controls,
    motionX,
    motionY,
    motionScale,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    panToNode,
    zoomOutToFit,
  };
}
