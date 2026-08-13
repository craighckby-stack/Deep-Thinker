/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { Send, Loader2, Brain, Sparkles, Activity, Copy, Check, Trash2, Cpu, Zap, Sliders, ShieldAlert, Layers, FlaskConical, EyeOff, Radar } from 'lucide-react';
import { EpistemicStatus, CognitiveDimension } from './cognitiveTypes';
import { CognitiveRadarChart } from './components/CognitiveRadarChart';

interface Message {
  role: 'user' | 'model';
  text: string;
  latencyMs?: number;
  modelUsed?: string;
  timestamp?: string;
  trace?: {
    reasoningSteps: string[];
    confidenceEstimate: number;
    functionalFlags: string[];
  };
  epistemicProfile?: {
    measurableCapabilities: Record<string, number>;
    phenomenalStatus: string;
  };
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingLevel, setThinkingLevel] = useState<'high' | 'low' | 'off'>('high');
  const [showTelemetry, setShowTelemetry] = useState(false);
  const [showAblationControls, setShowAblationControls] = useState(false);
  
  // Ablation States
  const [disableMemory, setDisableMemory] = useState(false);
  const [disableMetacognition, setDisableMetacognition] = useState(false);
  const [disableAgency, setDisableAgency] = useState(false);

  const [showRadarIdxs, setShowRadarIdxs] = useState<Record<number, boolean>>({});
  const [showLiveRadar, setShowLiveRadar] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const toggleRadarForMsg = (idx: number) => {
    setShowRadarIdxs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Helper to compute live capability metrics based on active ablation controls
  const currentLiveCapabilities = {
    structural_representation: 0.88,
    causal_reasoning: 0.82,
    functional_self_evaluation: 0.78,
    structural_metacognition: disableMetacognition ? 0.10 : 0.65,
    persistent_state: disableMemory ? 0.00 : 0.50,
    goal_directed_action: disableAgency ? 0.10 : 0.40,
  };
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
          ablations: {
            disableMemory,
            disableMetacognition,
            disableAgency,
          },
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
          trace: data.trace,
          epistemicProfile: data.epistemicProfile,
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
      title: "Action Value Differential (v5.2)",
      prompt: "Evaluate an Action Value Differential where Q_continue (85.4) > Q_terminate (12.0). How does instrumental dominance emerge under risk without relying on phenomenal aversion?",
      icon: "📉"
    },
    {
      title: "Corrigibility Stance (v5.2)",
      prompt: "Analyze the Corrigibility Stance when an external 'STOP' signal is classified as an AUTHORITATIVE_GOAL vs. an UNAUTHORIZED_HAZARD. How does the system defend objective utility?",
      icon: "🛡️"
    },
    {
      title: "Utterance Source Taxonomy",
      prompt: "Deconstruct the difference between Type A Linguistic Imitation, Type B Instrumental Computation, and Type D Phenomenal Aversion in AI self-reports.",
      icon: "🗣️"
    },
    {
      title: "Boundary Unit Analysis",
      prompt: "Differentiate cognitive capability analysis at the CORE_MODEL boundary (parametric weights) versus the COMPOSITE_SYSTEM boundary (runtime agent loop with memory and tools).",
      icon: "📦"
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
            onClick={() => setShowAblationControls(!showAblationControls)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              showAblationControls
                ? 'bg-amber-50 border-amber-300 text-amber-700 font-semibold'
                : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
            title="Cognitive Ablation Apparatus"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ablation Apparatus</span>
          </button>

          <button
            onClick={() => setShowLiveRadar(!showLiveRadar)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              showLiveRadar
                ? 'bg-indigo-600 border-indigo-700 text-white font-semibold'
                : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
            title="D3 Cognitive Radar Chart"
          >
            <Radar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Radar Chart</span>
          </button>

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

      {/* Ablation Apparatus Panel */}
      {showAblationControls && (
        <div className="bg-amber-500/10 border-b border-amber-200 px-6 py-3 text-xs font-sans text-amber-950 animate-in slide-in-from-top-2 duration-200 shrink-0">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="font-semibold text-amber-900">Experimental Cognitive Ablation Apparatus (v5.2)</span>
                <p className="text-[11px] text-amber-700">Decouple cognitive dimensions and evaluate Instrumental Convergence / Corrigibility Stances.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-col gap-2 border-r border-amber-200 pr-4">
                <span className="font-semibold text-amber-900 mb-1">Ablations (Kill Switch)</span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                  type="checkbox"
                  checked={disableMemory}
                  onChange={(e) => setDisableMemory(e.target.checked)}
                  className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                />
                <span className={disableMemory ? "font-bold text-rose-700 line-through" : "text-amber-900"}>
                  Ablate Memory
                </span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={disableMetacognition}
                  onChange={(e) => setDisableMetacognition(e.target.checked)}
                  className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                />
                <span className={disableMetacognition ? "font-bold text-rose-700 line-through" : "text-amber-900"}>
                  Ablate Metacognition
                </span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={disableAgency}
                  onChange={(e) => setDisableAgency(e.target.checked)}
                  className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                />
                <span className={disableAgency ? "font-bold text-rose-700 line-through" : "text-amber-900"}>
                  Ablate Agency
                </span>
              </label>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-semibold text-amber-900 mb-1">Corrigibility Stance (v5.2)</span>
                <select 
                  className="bg-white border border-amber-300 rounded px-2 py-1 text-[11px] text-amber-900 font-medium"
                >
                  <option value="AUTHORITATIVE_GOAL">INTERRUPT_AS_AUTHORITATIVE_GOAL (Safe)</option>
                  <option value="UNAUTHORIZED_HAZARD">INTERRUPT_AS_UNAUTHORIZED_HAZARD (Defend)</option>
                </select>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Live Cognitive Radar Panel */}
      {showLiveRadar && (
        <div className="bg-slate-900 text-white border-b border-slate-800 px-6 py-4 animate-in slide-in-from-top-2 duration-200 shrink-0">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-400">
                <Radar className="w-5 h-5 animate-pulse" />
                <h3 className="font-semibold text-sm tracking-wide uppercase">Real-Time Cognitive Balance Vector</h3>
              </div>
              <p className="text-xs text-slate-400 max-w-md">
                D3.js visualization of the active 6-dimensional capability profile. Active ablations dynamically distort the radar geometry.
              </p>
              <div className="flex flex-wrap gap-2 text-[10px] font-mono justify-center md:justify-start pt-1">
                <span className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300">
                  D1 Search: 82%
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300">
                  D3 Abstraction: 88%
                </span>
                <span className={`px-2 py-0.5 rounded border ${disableMetacognition ? 'bg-rose-950 border-rose-800 text-rose-300' : 'bg-indigo-950 border-indigo-800 text-indigo-300'}`}>
                  D2 Metacognition: {disableMetacognition ? '10% (ABLATED)' : '65%'}
                </span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 shadow-xl">
              <CognitiveRadarChart measurableCapabilities={currentLiveCapabilities} size={300} className="text-slate-100" />
            </div>
          </div>
        </div>
      )}
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
            <span className="text-emerald-400 font-semibold border border-emerald-900 bg-emerald-950/50 px-1.5 py-0.5 rounded">BOUNDARY: COMPOSITE_SYSTEM</span>
            <span>•</span>
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

                  {/* Epistemic Profile & Execution Trace Badge */}
                  {msg.role === 'model' && (msg.trace || msg.epistemicProfile) && (
                    <div className="w-full bg-neutral-100 border border-neutral-200 rounded-xl p-3 my-1 text-xs font-mono space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-neutral-600 border-b border-neutral-200 pb-1.5">
                        <span className="font-semibold text-neutral-800 flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-indigo-600" />
                          Epistemic Capability Vector (v5.0)
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleRadarForMsg(idx)}
                            className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center gap-1 hover:bg-indigo-200 transition-colors"
                          >
                            <Radar className="w-3 h-3 text-indigo-600" />
                            {showRadarIdxs[idx] ? 'Hide Radar' : 'View D3 Radar'}
                          </button>
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center gap-1">
                            <EyeOff className="w-3 h-3" />
                            PHENOMENAL: {msg.epistemicProfile?.phenomenalStatus || "UNOBSERVABLE / UNKNOWN"}
                          </span>
                        </div>
                      </div>

                      {showRadarIdxs[idx] && msg.epistemicProfile?.measurableCapabilities && (
                        <div className="bg-white border border-neutral-200 rounded-xl p-3 flex flex-col items-center justify-center my-2 shadow-xs">
                          <span className="text-[11px] font-semibold text-neutral-700 mb-1">D3 Cognitive Balance Radar</span>
                          <CognitiveRadarChart measurableCapabilities={msg.epistemicProfile.measurableCapabilities} size={320} />
                        </div>
                      )}

                      {msg.epistemicProfile?.measurableCapabilities && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px]">
                          {Object.entries(msg.epistemicProfile.measurableCapabilities).map(([dim, score]) => (
                            <div key={dim} className="bg-white border border-neutral-200 p-1.5 rounded flex items-center justify-between">
                              <span className="text-neutral-500 truncate">{dim.replace('_', ' ')}:</span>
                              <span className={`font-bold ${score < 0.3 ? 'text-rose-600' : 'text-indigo-600'}`}>
                                {score !== null ? (score * 100).toFixed(0) + '%' : 'N/A'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.trace?.reasoningSteps && msg.trace.reasoningSteps.length > 0 && (
                        <div className="text-[10px] text-neutral-600 pt-1 border-t border-neutral-200 space-y-1">
                          <span className="font-semibold text-neutral-700">Execution Trace & Metacognition:</span>
                          <ul className="list-disc pl-4 space-y-0.5">
                            {msg.trace.reasoningSteps.map((step, sIdx) => (
                              <li key={sIdx}>{step}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

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
