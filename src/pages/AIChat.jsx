import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Send, Mic, MicOff, Volume2, VolumeX, RotateCcw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAIResponse, TUTOR_SYSTEM_PROMPT } from '../config/gemini';
import { speak, stopSpeaking, startListening, stopListening, isSpeakingSupported, isListeningSupported } from '../services/speech';
import { logSession, awardXP, XP_AMOUNTS } from '../services/firestore';

const scenarios = [
  { label: '☕ Café Order', prompt: 'Let\'s practice ordering coffee at a café. You\'re the customer and I\'m the barista. Start the roleplay.' },
  { label: '✈️ Airport', prompt: 'Let\'s practice a conversation at the airport. You\'re checking in for a flight. I\'m the airline agent. Start the roleplay.' },
  { label: '🏥 Doctor', prompt: 'Let\'s practice visiting a doctor. You describe your symptoms and I\'ll be the doctor. Start the roleplay.' },
  { label: '🛒 Shopping', prompt: 'Let\'s practice shopping for clothes at a store. You\'re the customer and I\'m the salesperson. Start the roleplay.' },
  { label: '📞 Phone Call', prompt: 'Let\'s practice a phone conversation. You need to schedule an appointment. I\'ll be the receptionist. Start the roleplay.' },
  { label: '🍽️ Restaurant', prompt: 'Let\'s practice dining at a restaurant. You\'re the customer ordering food. I\'m the waiter. Start the roleplay.' },
];

export default function AIChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [sessionLogged, setSessionLogged] = useState(false);
  const messagesEnd = useRef(null);
  const inputRef = useRef(null);

  const canSpeak = isSpeakingSupported();
  const canListen = isListeningSupported();

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || sending) return;
    const userMsg = { role: 'user', text: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setSending(true);

    try {
      const formatted = newMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));
      const reply = await getAIResponse(formatted, TUTOR_SYSTEM_PROMPT);
      const aiMsg = { role: 'ai', text: reply };
      setMessages([...newMessages, aiMsg]);

      if (ttsEnabled && canSpeak) speak(reply, { rate: 0.9 });

      if (!sessionLogged && user) {
        await logSession(user.uid, 'chat', 5);
        await awardXP(user.uid, XP_AMOUNTS.CHAT_SESSION);
        setSessionLogged(true);
      }
    } catch (err) {
      console.error('AI error:', err);
      setMessages([...newMessages, { role: 'ai', text: 'Sorry, I had trouble responding. Please try again.' }]);
    }
    setSending(false);
  };

  const handleMic = async () => {
    if (!canListen) return;
    if (listening) {
      stopListening();
      setListening(false);
      return;
    }
    setListening(true);
    try {
      const transcript = await startListening({ language: 'en-US' });
      setInput(transcript);
      setListening(false);
    } catch {
      setListening(false);
    }
  };

  const handleScenario = (scenario) => {
    sendMessage(scenario.prompt);
  };

  const handleReset = () => {
    setMessages([]);
    setSessionLogged(false);
    stopSpeaking();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] lg:h-[calc(100vh-32px)] lg:p-6 xl:p-8">
      <div className="max-w-4xl mx-auto w-full flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 lg:px-0 lg:pt-0 lg:pb-4 flex-shrink-0">
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold">AI Tutor</h1>
            <p className="text-xs text-text-secondary mt-0.5">Practice English conversations</p>
          </div>
          <div className="flex items-center gap-2">
            {canSpeak && (
              <button onClick={() => { setTtsEnabled(!ttsEnabled); if (ttsEnabled) stopSpeaking(); }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${ttsEnabled ? 'bg-primary/10 text-primary' : 'bg-surface text-text-tertiary'}`}>
                {ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            )}
            <button onClick={handleReset}
              className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center text-text-tertiary hover:text-text-secondary transition-colors">
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-5 lg:px-0 min-h-0">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full max-h-[60vh]">
              <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mb-4">
                <Sparkles size={28} className="text-white" />
              </div>
              <h2 className="font-heading font-bold text-xl mb-1">Start a Conversation</h2>
              <p className="text-sm text-text-secondary text-center mb-6 max-w-xs">Chat freely or pick a scenario to practice real-world English</p>
              <div className="w-full max-w-md">
                <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary mb-3 text-center">Practice Scenarios</p>
                <div className="grid grid-cols-2 gap-2">
                  {scenarios.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => handleScenario(s)}
                      className="p-3 bg-surface lg:bg-white lg:border lg:border-border/30 rounded-2xl text-sm font-semibold text-text-primary hover:bg-elevated hover:shadow-sm transition-all text-left"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 space-y-4 lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border/30 lg:p-6">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] lg:max-w-[70%] px-4 py-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'gradient-primary text-white rounded-br-md'
                        : 'bg-surface lg:bg-surface/70 text-text-primary rounded-bl-md'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                      {msg.role === 'ai' && canSpeak && (
                        <button onClick={() => speak(msg.text, { rate: 0.9 })} className="mt-2 text-primary/70 hover:text-primary">
                          <Volume2 size={13} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-surface px-5 py-3.5 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEnd} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="px-5 py-4 lg:px-0 flex-shrink-0">
          <div className="flex items-end gap-2">
            {canListen && (
              <button onClick={handleMic}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                  listening
                    ? 'gradient-hero text-white shadow-lg shadow-teal/20 animate-pulse'
                    : 'bg-surface lg:bg-white lg:border lg:border-border/30 text-text-secondary hover:text-primary'
                }`}>
                {listening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            )}
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={listening ? 'Listening...' : 'Type your message...'}
                rows={1}
                className="w-full min-h-[48px] max-h-24 px-5 py-3.5 rounded-2xl bg-surface lg:bg-white lg:border lg:border-border/30 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || sending}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                input.trim() && !sending
                  ? 'gradient-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-surface text-text-tertiary cursor-not-allowed'
              }`}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
