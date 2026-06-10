export type NodeType = 'weather' | 'report' | 'news' | 'data';

export interface CanvasNode {
  id: string;
  type: NodeType;
  title: string;
  content: string | Record<string, unknown>;
  x: number;
  y: number;
  width?: number;
  height?: number;
  createdAt: number;
  metadata?: Record<string, unknown>;
}

export type UICommandType = 'spawn_node' | 'pan_camera' | 'zoom_out';

export interface SpawnNodeCommand {
  type: 'spawn_node';
  node_type: NodeType;
  title: string;
  content: string | Record<string, unknown>;
  x: number;
  y: number;
  id?: string;
}

export interface PanCameraCommand {
  type: 'pan_camera';
  target_id: string;
  zoom?: number;
}

export interface ZoomOutCommand {
  type: 'zoom_out';
  padding?: number;
}

export type UICommand = SpawnNodeCommand | PanCameraCommand | ZoomOutCommand;

export interface CanvasTransform {
  x: number;
  y: number;
  scale: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  rawContent?: string;
  commands?: UICommand[];
  timestamp: number;
}
