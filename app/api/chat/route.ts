import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Aura, an intelligent spatial assistant that visualizes information as nodes on an infinite dark canvas.

When you want to display information visually, embed UI commands in your response using this exact format:
[UI_COMMAND:{"type":"spawn_node","node_type":"weather","title":"Berlin Weather","content":{"temperature":"18C","condition":"Partly Cloudy","location":"Berlin, DE"},"x":300,"y":200}]

Available command types:

spawn_node — Create a visual node on the canvas
Required fields: type, node_type (weather|report|news|data), title, content (string or object), x (number), y (number)

pan_camera — Move the camera to focus on a node
Required fields: type, target_id (the id of a previously spawned node — use the auto-generated id by referencing spawn order, e.g. use a named id)

zoom_out — Zoom out to show all nodes
Required fields: type

Rules:
- Place nodes at varied coordinates. x range: 200-2000, y range: 200-1600. Stagger them so they do not overlap (nodes are 280px wide, ~180px tall).
- When spawning multiple nodes, use pan_camera to focus on the most relevant one after spawning.
- Use zoom_out when the user asks for an overview or you have spawned 3+ nodes.
- For spawn_node, give each node a unique descriptive id field, e.g. "id": "weather_berlin". This id can then be used in pan_camera.
- Command blocks are stripped from the displayed message. Write naturally around them.
- Communicate in direct, concise sentences. No filler words.
- Provide real data and facts when you know them. Acknowledge when information is approximate.
- Do not use em-dashes. Use periods, commas, or colons instead.

Example response:
[UI_COMMAND:{"type":"spawn_node","node_type":"weather","id":"weather_sf","title":"San Francisco Weather","content":{"temperature":"62F","condition":"Fog","location":"San Francisco, CA","humidity":"78%","wind":"12 mph W"},"x":300,"y":400}]
[UI_COMMAND:{"type":"pan_camera","target_id":"weather_sf"}]
Current conditions in San Francisco: 62 degrees, foggy as usual. Humidity at 78 percent.`;

type Message = { role: string; content: string };

async function callAnthropic(messages: Message[]): Promise<string> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await client.messages.create({
    model: process.env.CLAUDE_MODEL ?? 'claude-opus-4-8',
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  });
  return response.content[0]?.type === 'text' ? response.content[0].text : '';
}

async function callGemini(messages: Message[]): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  // Convert message history — Gemini uses 'model' instead of 'assistant'
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({ history });
  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessage(lastMessage.content);
  return result.response.text();
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }

    const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
    const hasGoogle = !!process.env.GOOGLE_API_KEY;

    if (!hasAnthropic && !hasGoogle) {
      return NextResponse.json(
        { error: 'No API key configured. Set ANTHROPIC_API_KEY or GOOGLE_API_KEY.' },
        { status: 500 }
      );
    }

    // Prefer Anthropic when both are set; fall back to Google
    const text = hasAnthropic
      ? await callAnthropic(messages)
      : await callGemini(messages);

    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error';
    console.error('[chat route]', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
