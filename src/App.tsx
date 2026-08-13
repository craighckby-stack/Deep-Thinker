/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { Send, Loader2, Brain, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', text: input.trim() }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch response');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'model', text: data.text }]);
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

  return (
    <div className="flex flex-col h-screen bg-neutral-50 text-neutral-900 font-sans">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-200 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-xl">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight text-neutral-900">Deep Thinker</h1>
            <p className="text-sm text-neutral-500">Gemini 3.1 Pro + High Thinking</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto space-y-4">
            <Brain className="w-16 h-16 text-indigo-200" />
            <h2 className="text-xl font-medium text-neutral-700">How can I help you think today?</h2>
            <p className="text-neutral-500">
              Ask me complex questions that require deep reasoning, step-by-step logic, or advanced problem solving.
            </p>
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
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                    msg.role === 'user' ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-600 text-white'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <span className="text-sm font-medium">U</span>
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`px-5 py-4 rounded-2xl max-w-[85%] ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white border border-neutral-200 shadow-sm rounded-tl-none'
                  }`}
                >
                  {msg.role === 'model' ? (
                    <div className="prose prose-neutral prose-sm md:prose-base max-w-none">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4 flex-row">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 bg-indigo-600 text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="px-5 py-4 rounded-2xl max-w-[85%] bg-white border border-neutral-200 shadow-sm rounded-tl-none">
                  <div className="flex items-center gap-2 text-neutral-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">Thinking deeply...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <footer className="p-4 bg-white border-t border-neutral-200 shrink-0">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a complex question..."
            disabled={isLoading}
            className="w-full pl-5 pr-14 py-4 bg-neutral-100 border border-neutral-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
}
