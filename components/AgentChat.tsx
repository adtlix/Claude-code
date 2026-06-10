'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { parseCommands } from '@/lib/commandParser';
import type { ChatMessage, UICommand } from '@/types';

interface AgentChatProps {
  onCommand: (cmd: UICommand) => void;
}

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0">
        <span className="text-[9px] font-bold text-white">A</span>
      </div>
      <div className="flex gap-1 ml-1">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/30"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, delay: i * 0.18, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      className={`flex gap-2 px-3 py-1.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-[9px] font-bold text-white">A</span>
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
          isUser
            ? 'bg-violet-600/30 border border-violet-500/20 text-white/90 rounded-tr-sm'
            : 'bg-white/[0.05] border border-white/[0.08] text-white/75 rounded-tl-sm'
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  );
}

export default function AgentChat({ onCommand }: AgentChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      role: 'assistant',
      content: 'Canvas ready. Ask me anything. I will visualize the information as spatial nodes.',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const history = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.rawContent ?? m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed: ${res.status}`);
      }

      const { text } = await res.json();
      const { commands, displayText } = parseCommands(text);

      for (const cmd of commands) {
        onCommand(cmd);
      }

      const assistantMsg: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: displayText || '...',
        rawContent: text,
        commands,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      setMessages(prev => [
        ...prev,
        {
          id: uuidv4(),
          role: 'assistant',
          content: `Error: ${msg}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, onCommand]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <aside className="fixed right-0 top-0 h-full w-[360px] flex flex-col z-50 shadow-chat">
      {/* Glass panel */}
      <div className="absolute inset-0 bg-white/[0.025] backdrop-blur-3xl border-l border-white/[0.06]" />

      {/* Header */}
      <div className="relative flex items-center gap-3 px-4 py-4 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
          <span className="text-xs font-bold text-white">A</span>
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white/90 tracking-tight">Aura</h1>
          <p className="text-[10px] text-white/35 font-mono">Canvas Intelligence</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-glow" />
          <span className="text-[10px] text-white/30 font-mono">live</span>
        </div>
      </div>

      {/* Messages */}
      <div className="relative flex-1 overflow-y-auto py-3 space-y-0.5">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </AnimatePresence>
        {isLoading && <ThinkingIndicator />}
        {error && (
          <p className="text-xs text-red-400/70 px-4 py-1 font-mono">{error}</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="relative px-3 pb-4 pt-3 border-t border-white/[0.06]">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            rows={1}
            className="flex-1 resize-none rounded-xl bg-white/[0.05] border border-white/[0.08] px-3 py-2.5
              text-sm text-white/80 placeholder:text-white/25 focus:outline-none focus:border-violet-500/40
              focus:ring-1 focus:ring-violet-500/20 transition-all font-sans leading-relaxed
              max-h-32 overflow-y-auto scrollbar-thin"
            style={{ fieldSizing: 'content' } as React.CSSProperties}
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600
              flex items-center justify-center shrink-0 transition-all
              disabled:opacity-30 disabled:cursor-not-allowed
              hover:from-violet-500 hover:to-indigo-500 active:scale-95"
            aria-label="Send"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M12 7L2 2l2 5-2 5 10-5z" fill="white" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-white/15 font-mono mt-2 text-center">
          Enter to send, Shift+Enter for new line
        </p>
      </div>
    </aside>
  );
}
