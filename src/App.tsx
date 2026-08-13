/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { Send, Loader2, Brain, Sparkles, Activity, Copy, Check, Trash2, Cpu, Zap, Sliders } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
  latencyMs?: number;
  modelUsed?: string;
  timestamp?: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingLevel, setThinkingLevel] = useState<'high' | 'low' | 'off'>('high');
  const [showTelemetry, setShowTelemetry] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [lastLatency, setLastLatency] = useState<number | null>(null);
  const [activeModel, setActiveModel] = useState<string>('gemini-3.6-flash');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const promptText = customPrompt || input.trim();
    if (!promptText || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', text: promptText }];
    setMessages(newMessages);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          thinkingLevel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch response');
      }

      const data = await response.json();
      setLastLatency(data.latencyMs || null);
      if (data.modelUsed) setActiveModel(data.modelUsed);

      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: data.text,
          latencyMs: data.latencyMs,
          modelUsed: data.modelUsed,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (error: any) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: `**Error:** ${error.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const promptPresets = [
    {
      title: "Epistemic Debate",
      prompt: "Perform an epistemic debate analyzing the trade-offs between monolithic architecture and microservices for high-throughput AI workloads.",
      icon: "⚖️"
    },
    {
      title: "Quantum Logic Paradox",
      prompt: "Explain how quantum superposition resolves the information paradox in black hole physics step-by-step.",
      icon: "⚛️"
    },
    {
      title: "Code Mutation & Coherence",
      prompt: "Analyze the architectural impact of adding autonomous self-healing retries to a distributed queue system.",
      icon: "🧬"
    },
    {
      title: "System Scaffold Diagnostic",
      prompt: "Perform a step-by-step diagnostic on building a fault-tolerant multi-agent orchestrator with rate-limit resiliency.",
      icon: "🛠️"
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-neutral-50 text-neutral-900 font-sans">
      {/* Top Navigation & Status Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-white border-b border-neutral-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-xl shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold leading-tight text-neutral-900">Deep Thinker</h1>
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase font-medium bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                System Online
              </span>
            </div>
            <p className="text-xs text-neutral-500 flex items-center gap-1.5 mt-0.5">
              <span>{activeModel}</span>
              <span>•</span>
              <span className="font-medium text-indigo-600">
                {thinkingLevel === 'high' ? 'High Thinking Active' : thinkingLevel === 'low' ? 'Low Thinking' : 'Standard Speed'}
              </span>
            </p>
          </div>
        </div>

        {/* Controls & Telemetry Toggle */}
        <div className="flex items-center gap-2">
          {/* Thinking Level Control */}
          <div className="flex items-center bg-neutral-100 rounded-lg p-1 border border-neutral-200 text-xs">
            <button
              onClick={() => setThinkingLevel('high')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                thinkingLevel === 'high'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Maximum reasoning depth"
            >
              High
            </button>
            <button
              onClick={() => setThinkingLevel('low')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                thinkingLevel === 'low'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Balanced reasoning"
            >
              Low
            </button>
            <button
              onClick={() => setThinkingLevel('off')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                thinkingLevel === 'off'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Fastest response without reasoning chain"
            >
              Off
            </button>
          </div>

          <button
            onClick={() => setShowTelemetry(!showTelemetry)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              showTelemetry
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Telemetry</span>
          </button>

          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              title="Clear Conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Telemetry Bar Banner */}
      {showTelemetry && (
        <div className="bg-neutral-900 text-white px-6 py-2.5 text-xs font-mono flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 animate-in fade-in duration-200">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <Cpu className="w-3.5 h-3.5" />
              MODEL: <strong className="text-white">{activeModel}</strong>
            </span>
            <span className="text-neutral-600">|</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Zap className="w-3.5 h-3.5" />
              LAST LATENCY: <strong className="text-white">{lastLatency ? `${lastLatency}ms` : 'N/A'}</strong>
            </span>
            <span className="text-neutral-600">|</span>
            <span className="text-amber-400">
              THINKING: <strong className="text-white">{thinkingLevel.toUpperCase()}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-neutral-400">
            <span>SCAFFOLD: ONLINE</span>
            <span>•</span>
            <span>EPISODIC LOGS: ACTIVE</span>
          </div>
        </div>
      )}

      {/* Main Conversation Stream */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[80%] text-center max-w-2xl mx-auto space-y-6 my-auto">
            <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center shadow-xs">
              <Brain className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-neutral-800 tracking-tight">Deep Reasoning & Architecture Assistant</h2>
              <p className="text-neutral-500 text-sm max-w-lg mx-auto">
                Powered by <strong>Gemini 3.6 Flash</strong> with High Thinking configuration. Formulate complex queries, paradox resolutions, and structural diagnostic tasks.
              </p>
            </div>

            {/* Prompt Presets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left pt-2">
              {promptPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={(e) => handleSubmit(e, preset.prompt)}
                  className="p-4 bg-white border border-neutral-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all text-left flex flex-col justify-between gap-2 group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{preset.icon}</span>
                    <span className="font-semibold text-xs text-neutral-800 group-hover:text-indigo-600 transition-colors">
                      {preset.title}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                    {preset.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-4 ${
                  msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-xs ${
                    msg.role === 'user' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'bg-indigo-600 text-white'
                  }`}
                >
                  {msg.role === 'user' ? 'U' : <Sparkles className="w-4 h-4" />}
                </div>

                <div className={`flex flex-col gap-1 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-5 py-4 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm'
                        : 'bg-white border border-neutral-200 shadow-sm rounded-tl-none text-neutral-800'
                    }`}
                  >
                    {msg.role === 'model' ? (
                      <div className="prose prose-neutral prose-sm md:prose-base max-w-none leading-relaxed">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    )}
                  </div>

                  {/* Message Footer Telemetry & Actions */}
                  {msg.role === 'model' && (
                    <div className="flex items-center gap-3 text-[11px] text-neutral-400 px-1 pt-0.5">
                      {msg.latencyMs && (
                        <span className="font-mono flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-500" />
                          {msg.latencyMs}ms
                        </span>
                      )}
                      {msg.modelUsed && (
                        <span className="font-mono">
                          {msg.modelUsed}
                        </span>
                      )}
                      {msg.timestamp && (
                        <span>{msg.timestamp}</span>
                      )}
                      <button
                        onClick={() => copyToClipboard(msg.text, idx)}
                        className="hover:text-indigo-600 transition-colors flex items-center gap-1 ml-auto"
                        title="Copy text"
                      >
                        {copiedIdx === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4 flex-row">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 bg-indigo-600 text-white shadow-xs">
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
                <div className="px-5 py-4 rounded-2xl max-w-[85%] bg-white border border-neutral-200 shadow-sm rounded-tl-none">
                  <div className="flex items-center gap-2.5 text-indigo-600 font-medium">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Synthesizing paradox paths & high reasoning...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Footer */}
      <footer className="p-4 bg-white border-t border-neutral-200 shrink-0">
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="max-w-4xl mx-auto relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a complex reasoning or architectural query..."
            disabled={isLoading}
            className="w-full pl-5 pr-14 py-3.5 bg-neutral-100 border border-neutral-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </footer>
    </div>
  );
}
