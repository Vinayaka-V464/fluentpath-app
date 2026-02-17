import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Settings, Mic, Send, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAIResponse, TUTOR_SYSTEM_PROMPT } from '../config/gemini';

const scenarios = [
  'Ordering at a café',
  'Job interview practice',
  'Making small talk',
  'At the airport',
  'Restaurant conversation',
  'Shopping for clothes',
];

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content: "Welcome! Let's practice ordering at a café. ☕\n\nImagine you've just walked into a cozy coffee shop. I'll be the barista. What would you like to order?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useState(scenarios[0]);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const systemPrompt = `${TUTOR_SYSTEM_PROMPT}\n\nCurrent scenario: ${scenario}. Stay in character for this scenario while correcting the user's English.`;
      const response = await getAIResponse(
        updatedMessages.map(m => ({ role: m.role, content: m.content })),
        systemPrompt
      );
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'model', content: "I'm sorry, I'm having trouble right now. Please try again! 😊" }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] lg:h-[calc(100vh-57px)] bg-white lg:bg-transparent">
      <div className="flex-1 flex flex-col lg:m-6 lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border/30 lg:overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-surface lg:px-6">
          <button onClick={() => navigate(-1)} className="lg:hidden text-text-secondary">
            <ArrowLeft size={22} />
          </button>
          <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-heading font-bold text-base">FluentPath AI Tutor</h2>
            <p className="text-xs text-teal font-medium">Online · B1 Level</p>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            {scenarios.slice(0, 3).map(s => (
              <button
                key={s}
                onClick={() => setScenario(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${scenario === s ? 'bg-primary/10 text-primary' : 'bg-surface text-text-secondary hover:bg-elevated'}`}
              >
                {s}
              </button>
            ))}
          </div>
          <button className="text-text-secondary ml-2">
            <Settings size={20} />
          </button>
        </div>

        {/* Scenario badge mobile */}
        <div className="lg:hidden px-4 py-2">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full">
            <Sparkles size={14} className="text-primary" />
            <span className="text-xs font-semibold text-primary">{scenario}</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 lg:px-6">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] lg:max-w-[55%] ${
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-2xl rounded-br-md'
                  : 'bg-surface text-text-primary rounded-2xl rounded-bl-md'
              } px-4 py-3`}>
                <p className="text-[15px] leading-relaxed whitespace-pre-line">{msg.content}</p>
                <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-white/60' : 'text-text-tertiary'}`}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-surface rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-surface px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your reply..."
              className="flex-1 h-12 bg-surface rounded-2xl px-4 text-[15px] text-text-primary placeholder:text-text-tertiary outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button className="w-12 h-12 rounded-full bg-teal flex items-center justify-center text-white hover:bg-teal/90 transition-colors">
              <Mic size={20} />
            </button>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
