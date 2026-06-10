'use client';

import { useCallback } from 'react';
import Canvas from '@/components/Canvas';
import AgentChat from '@/components/AgentChat';
import { useNodes } from '@/hooks/useNodes';
import { useCanvas } from '@/hooks/useCanvas';
import type { UICommand, SpawnNodeCommand, PanCameraCommand } from '@/types';

export default function Home() {
  const { nodes, spawnNode, getNodeById } = useNodes();
  const {
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
  } = useCanvas();

  const getContainerSize = useCallback(() => ({
    w: containerRef.current?.clientWidth ?? typeof window !== 'undefined' ? window.innerWidth : 1440,
    h: containerRef.current?.clientHeight ?? typeof window !== 'undefined' ? window.innerHeight : 900,
  }), [containerRef]);

  const handleCommand = useCallback(
    (cmd: UICommand) => {
      switch (cmd.type) {
        case 'spawn_node': {
          const node = spawnNode(cmd as SpawnNodeCommand);
          setTimeout(() => {
            panToNode(node, getContainerSize());
          }, 120);
          break;
        }
        case 'pan_camera': {
          const panCmd = cmd as PanCameraCommand;
          const node = getNodeById(panCmd.target_id);
          if (node) panToNode(node, getContainerSize());
          break;
        }
        case 'zoom_out': {
          setTimeout(() => {
            zoomOutToFit(nodes, getContainerSize());
          }, 100);
          break;
        }
      }
    },
    [nodes, spawnNode, getNodeById, panToNode, zoomOutToFit, getContainerSize]
  );

  const handleFit = useCallback(() => {
    zoomOutToFit(nodes, getContainerSize());
  }, [nodes, zoomOutToFit, getContainerSize]);

  return (
    <main
      className="relative w-screen min-h-[100dvh] overflow-hidden bg-[#030305] select-none"
      style={{ cursor: 'grab' }}
    >
      <div
        ref={containerRef}
        className="absolute inset-0"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <Canvas
          nodes={nodes}
          controls={controls}
          motionX={motionX}
          motionY={motionY}
          motionScale={motionScale}
          onFit={handleFit}
        />
      </div>

      <AgentChat onCommand={handleCommand} />
    </main>
  );
}
