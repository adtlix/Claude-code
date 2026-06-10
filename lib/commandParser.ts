import type { UICommand, UICommandType, SpawnNodeCommand, PanCameraCommand, ZoomOutCommand, NodeType } from '@/types';

const COMMAND_REGEX = /\[UI_COMMAND:(\{[\s\S]*?\})\]/g;

const VALID_NODE_TYPES: NodeType[] = ['weather', 'report', 'news', 'data'];
const VALID_COMMAND_TYPES: UICommandType[] = ['spawn_node', 'pan_camera', 'zoom_out'];

function sanitizeJson(raw: string): string {
  return raw
    .replace(/'/g, '"')
    .replace(/,(\s*[}\]])/g, '$1')
    .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function isSpawnNode(c: Record<string, unknown>): boolean {
  return (
    c.type === 'spawn_node' &&
    typeof c.node_type === 'string' &&
    VALID_NODE_TYPES.includes(c.node_type as NodeType) &&
    typeof c.title === 'string' &&
    typeof c.x === 'number' &&
    typeof c.y === 'number'
  );
}

function isPanCamera(c: Record<string, unknown>): boolean {
  return c.type === 'pan_camera' && typeof c.target_id === 'string';
}

function isZoomOut(c: Record<string, unknown>): boolean {
  return c.type === 'zoom_out';
}

function tryParse(raw: string): UICommand | null {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    try {
      parsed = JSON.parse(sanitizeJson(raw));
    } catch {
      return null;
    }
  }

  if (!isRecord(parsed)) return null;
  if (typeof parsed.type !== 'string') return null;
  if (!VALID_COMMAND_TYPES.includes(parsed.type as UICommandType)) return null;

  if (isSpawnNode(parsed)) return parsed as unknown as SpawnNodeCommand;
  if (isPanCamera(parsed)) return parsed as unknown as PanCameraCommand;
  if (isZoomOut(parsed)) return parsed as unknown as ZoomOutCommand;

  return null;
}

export function parseCommands(text: string): {
  commands: UICommand[];
  displayText: string;
} {
  const commands: UICommand[] = [];
  let displayText = text;

  try {
    const matches = [...text.matchAll(COMMAND_REGEX)];

    for (const match of matches) {
      const cmd = tryParse(match[1]);
      if (cmd) commands.push(cmd);
    }

    displayText = text.replace(COMMAND_REGEX, '').replace(/\n{3,}/g, '\n\n').trim();
  } catch {
    // Return text as-is if something goes catastrophically wrong
  }

  return { commands, displayText };
}
