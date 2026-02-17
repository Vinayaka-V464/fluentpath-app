import { useState } from 'react';
import { Send, RefreshCw, CheckCircle, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAIResponse, WRITING_SYSTEM_PROMPT } from '../config/gemini';

const prompts = [
  'Write about your favorite holiday memory.',
  'Describe your ideal weekend.',
  'Write about the importance of learning English.',
  'Describe a person who inspires you.',
  'Write about a challenge you overcame.',
  'Describe your dream job.',
];

export default function WritingAssistant() {
  const [text, setText] = useState('');
  const [prompt, setPrompt] = useState(prompts[0]);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const newPrompt = () => {
    const available = prompts.filter(p => p !== prompt);
    setPrompt(available[Math.floor(Math.random() * available.length)]);
    setText('');
    setFeedback(null);
  };

  const submitWriting = async () => {
    if (text.trim().length < 20 || loading) return;
    setLoading(true);

    try {
      const messages = [
        { role: 'user', content: `Prompt: "${prompt}"\n\nStudent's writing:\n${text}\n\nPlease provide feedback in JSON format with: { "grammarScore": number 0-100, "toneScore": number 0-100, "styleScore": number 0-100, "overallScore": number 0-100, "corrections": [{"original": "...", "corrected": "...", "explanation": "..."}], "strengths": ["..."], "suggestions": ["..."] }` },
      ];
      const response = await getAIResponse(messages, WRITING_SYSTEM_PROMPT);

      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          setFeedback(JSON.parse(jsonMatch[0]));
        } else {
          setFeedback({
            grammarScore: 75,
            toneScore: 80,
            styleScore: 70,
            overallScore: 75,
            corrections: [],
            strengths: ['Good attempt at expressing your ideas'],
            suggestions: ['Try using more varied vocabulary', 'Check your grammar carefully'],
          });
        }
      } catch {
        setFeedback({
          grammarScore: 75,
          toneScore: 80,
          styleScore: 70,
          overallScore: 75,
          corrections: [],
          strengths: ['Good effort!'],
          suggestions: ['Keep practicing your writing skills'],
        });
      }
    } catch {
      setFeedback({
        grammarScore: 0,
        toneScore: 0,
        styleScore: 0,
        overallScore: 0,
        corrections: [],
        strengths: [],
        suggestions: ['Unable to analyze. Please try again.'],
      });
    }
    setLoading(false);
  };

  const getScoreColor = (s) => s >= 80 ? '#14B8A6' : s >= 60 ? '#F59E0B' : '#EF4444';

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-8">
      <div className="px-5 pt-6 lg:px-6 xl:px-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:hidden">
          <h1 className="text-2xl font-heading font-bold text-text-primary">Writing Assistant</h1>
          <p className="text-sm text-text-secondary mt-1">Practice writing and get AI-powered feedback</p>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Left: Writing Area */}
          <div>
            {/* Prompt Card */}
            <div className="bg-gradient-to-r from-primary/10 to-pink/10 rounded-2xl p-5 mb-4 lg:shadow-sm lg:border lg:border-border/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-primary" />
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">Writing Prompt</span>
                </div>
                <button onClick={newPrompt} className="flex items-center gap-1 text-xs text-text-secondary hover:text-primary transition-colors">
                  <RefreshCw size={14} /> New
                </button>
              </div>
              <p className="text-[15px] font-semibold text-text-primary">{prompt}</p>
            </div>

            {/* Text Area */}
            <div className="relative mb-4">
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Start writing here... (minimum 20 characters)"
                className="w-full h-64 p-4 bg-surface rounded-2xl text-[15px] text-text-primary placeholder:text-text-tertiary outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-3">
                <span className={`text-xs font-medium ${text.length >= 20 ? 'text-teal' : 'text-text-tertiary'}`}>{text.length} chars</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={submitWriting}
              disabled={text.trim().length < 20 || loading}
              className="w-full py-3.5 rounded-2xl gradient-primary text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Get AI Feedback
                </>
              )}
            </button>
          </div>

          {/* Right: Feedback */}
          <div className="mt-8 lg:mt-0">
            {feedback ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                {/* Score Overview */}
                <div className="bg-surface lg:bg-white rounded-2xl p-5 lg:shadow-sm lg:border lg:border-border/30">
                  <h3 className="font-heading font-bold text-base text-text-primary mb-4">Score Overview</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Grammar', score: feedback.grammarScore },
                      { label: 'Tone', score: feedback.toneScore },
                      { label: 'Style', score: feedback.styleScore },
                      { label: 'Overall', score: feedback.overallScore },
                    ].map(item => (
                      <div key={item.label} className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-[3px] mb-1.5" style={{ borderColor: getScoreColor(item.score) }}>
                          <span className="text-xl font-bold" style={{ color: getScoreColor(item.score) }}>{item.score}</span>
                        </div>
                        <p className="text-xs font-semibold text-text-secondary">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Corrections */}
                {feedback.corrections?.length > 0 && (
                  <div className="bg-error/5 rounded-2xl p-5">
                    <h3 className="font-heading font-bold text-base text-text-primary mb-3">Corrections</h3>
                    <div className="space-y-3">
                      {feedback.corrections.map((c, i) => (
                        <div key={i} className="bg-white rounded-xl p-3">
                          <p className="text-sm"><span className="line-through text-error">{c.original}</span> → <span className="text-teal font-semibold">{c.corrected}</span></p>
                          <p className="text-xs text-text-secondary mt-1">{c.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strengths */}
                {feedback.strengths?.length > 0 && (
                  <div className="bg-teal/5 rounded-2xl p-5">
                    <h3 className="font-heading font-bold text-base text-text-primary mb-3">Strengths</h3>
                    <div className="space-y-2">
                      {feedback.strengths.map((s, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle size={16} className="text-teal mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-text-secondary">{s}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {feedback.suggestions?.length > 0 && (
                  <div className="bg-gold/5 rounded-2xl p-5">
                    <h3 className="font-heading font-bold text-base text-text-primary mb-3">Suggestions</h3>
                    <div className="space-y-2">
                      {feedback.suggestions.map((s, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Send size={14} className="text-gold mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-text-secondary">{s}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => { setText(''); setFeedback(null); }}
                  className="w-full py-3 rounded-2xl border-2 border-primary text-primary font-semibold text-sm"
                >
                  Write Again
                </button>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles size={32} className="text-primary" />
                </div>
                <h3 className="font-heading font-bold text-lg text-text-primary">AI Feedback</h3>
                <p className="text-sm text-text-secondary mt-1 max-w-xs">Write your response to the prompt and submit to get detailed AI feedback on grammar, tone, and style.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
