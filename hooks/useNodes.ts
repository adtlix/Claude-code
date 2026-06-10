'use client';

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { CanvasNode, SpawnNodeCommand } from '@/types';

export function useNodes() {
  const [nodes, setNodes] = useState<CanvasNode[]>([]);

  const spawnNode = useCallback((cmd: SpawnNodeCommand): CanvasNode => {
    const node: CanvasNode = {
      id: cmd.id ?? uuidv4(),
      type: cmd.node_type,
      title: cmd.title,
      content: cmd.content,
      x: cmd.x,
      y: cmd.y,
      createdAt: Date.now(),
    };
    setNodes(prev => [...prev, node]);
    return node;
  }, []);

  const removeNode = useCallback((id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
  }, []);

  const getNodeById = useCallback(
    (id: string) => nodes.find(n => n.id === id),
    [nodes]
  );

  const clearNodes = useCallback(() => setNodes([]), []);

  return { nodes, spawnNode, removeNode, getNodeById, clearNodes };
}
