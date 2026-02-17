import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles, Globe, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { completeOnboarding } from '../services/firestore';

const languages = ['Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam', 'Bengali', 'Marathi', 'Gujarati', 'Urdu', 'Other'];
const focusAreas = [
  { id: 'Speaking', label: 'Speaking', icon: '🗣️', desc: 'Conversations & pronunciation' },
  { id: 'Grammar', label: 'Grammar', icon: '📖', desc: 'Rules & sentence structure' },
  { id: 'Vocabulary', label: 'Vocabulary', icon: '📚', desc: 'Words & phrases' },
  { id: 'Writing', label: 'Writing', icon: '✍️', desc: 'Emails, essays & more' },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [nativeLanguage, setNativeLanguage] = useState('Hindi');
  const [dailyTime, setDailyTime] = useState(30);
  const [trackDuration, setTrackDuration] = useState('1-month');
  const [focusArea, setFocusArea] = useState('Speaking');
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const steps = [
    { title: 'Your Language', subtitle: 'What is your native language?' },
    { title: 'Focus Area', subtitle: 'What do you want to improve most?' },
    { title: 'Daily Commitment', subtitle: 'How much time can you practice daily?' },
    { title: 'Learning Track', subtitle: 'Choose your learning pace' },
  ];

  const handleFinish = async () => {
    setSaving(true);
    try {
      await completeOnboarding(user.uid, {
        nativeLanguage,
        dailyGoal: dailyTime,
        focusArea,
        trackDuration,
        dailyTime,
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Onboarding error:', err);
      navigate('/dashboard');
    }
    setSaving(false);
  };

  const canProceed = () => {
    if (step === 0) return !!nativeLanguage;
    if (step === 1) return !!focusArea;
    if (step === 2) return !!dailyTime;
    if (step === 3) return !!trackDuration;
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Desktop Left Panel */}
      <div className="hidden lg:flex lg:w-[45%] gradient-hero items-center justify-center relative overflow-hidden">
        <div className="text-center text-white px-12 max-w-md">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8">
            <Sparkles size={36} className="text-white" />
          </div>
          <h2 className="text-4xl font-heading font-bold mb-4">FluentPath AI</h2>
          <p className="text-lg text-white/80 leading-relaxed mb-8">
            Let's personalize your learning experience. We'll create a custom path just for you.
          </p>
          <div className="flex items-center justify-center gap-3">
            {steps.map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i < step ? 'bg-white text-primary' : i === step ? 'bg-white/30 text-white ring-2 ring-white' : 'bg-white/10 text-white/40'
                }`}>
                  {i < step ? <CheckCircle size={16} /> : i + 1}
                </div>
                {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < step ? 'bg-white' : 'bg-white/20'}`} />}
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-white/60">Step {step + 1} of {steps.length}</div>
        </div>
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/5 rounded-full" />
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        {/* Mobile header */}
        <div className="lg:hidden px-5 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="font-heading text-lg font-extrabold text-text-primary">FluentPath</span>
          </div>
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i <= step ? 'gradient-primary' : 'bg-surface'}`} />
            ))}
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex items-center justify-center px-5 py-6">
          <div className="w-full max-w-[460px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
              >
                <h1 className="font-heading text-2xl lg:text-3xl font-bold text-text-primary mb-1">{steps[step].title}</h1>
                <p className="text-sm lg:text-base text-text-secondary mb-8">{steps[step].subtitle}</p>

                {step === 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {languages.map(lang => (
                      <button
                        key={lang}
                        onClick={() => setNativeLanguage(lang)}
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                          nativeLanguage === lang ? 'border-primary bg-primary/5' : 'border-border/40 hover:border-border bg-white'
                        }`}
                      >
                        <Globe size={18} className={nativeLanguage === lang ? 'text-primary' : 'text-text-tertiary'} />
                        <span className={`text-sm font-semibold ${nativeLanguage === lang ? 'text-primary' : 'text-text-primary'}`}>{lang}</span>
                      </button>
                    ))}
                  </div>
                )}

                {step === 1 && (
                  <div className="grid grid-cols-2 gap-3">
                    {focusAreas.map(area => (
                      <button
                        key={area.id}
                        onClick={() => setFocusArea(area.id)}
                        className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all text-center ${
                          focusArea === area.id ? 'border-primary bg-primary/5' : 'border-border/40 hover:border-border bg-white'
                        }`}
                      >
                        <span className="text-3xl">{area.icon}</span>
                        <span className={`text-sm font-bold ${focusArea === area.id ? 'text-primary' : 'text-text-primary'}`}>{area.label}</span>
                        <span className="text-[11px] text-text-secondary">{area.desc}</span>
                      </button>
                    ))}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-3">
                    {[
                      { val: 15, label: '15 minutes', desc: 'Quick daily practice', icon: '⚡' },
                      { val: 30, label: '30 minutes', desc: 'Recommended for steady progress', icon: '🎯', recommended: true },
                      { val: 60, label: '60 minutes', desc: 'Intensive learning', icon: '🚀' },
                    ].map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => setDailyTime(opt.val)}
                        className={`w-full flex items-center gap-4 p-4 lg:p-5 rounded-2xl border-2 transition-all text-left ${
                          dailyTime === opt.val ? 'border-primary bg-primary/5' : 'border-border/40 hover:border-border bg-white'
                        }`}
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-[15px] font-bold ${dailyTime === opt.val ? 'text-primary' : 'text-text-primary'}`}>{opt.label}</span>
                            {opt.recommended && <span className="text-[10px] font-bold text-teal bg-teal/10 px-2 py-0.5 rounded-full">Recommended</span>}
                          </div>
                          <span className="text-xs text-text-secondary">{opt.desc}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          dailyTime === opt.val ? 'border-primary bg-primary' : 'border-border'
                        }`}>
                          {dailyTime === opt.val && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    {[
                      { val: '1-month', label: '1 Month Intensive', desc: '28 days · Fast-paced · 4 weeks of focused lessons', icon: '🏃', weeks: 4 },
                      { val: '2-month', label: '2 Month Standard', desc: '56 days · Relaxed pace · Deep practice', icon: '🚶', weeks: 8 },
                    ].map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => setTrackDuration(opt.val)}
                        className={`w-full flex items-center gap-4 p-5 lg:p-6 rounded-2xl border-2 transition-all text-left ${
                          trackDuration === opt.val ? 'border-primary bg-primary/5' : 'border-border/40 hover:border-border bg-white'
                        }`}
                      >
                        <span className="text-3xl">{opt.icon}</span>
                        <div className="flex-1 min-w-0">
                          <span className={`text-base font-bold ${trackDuration === opt.val ? 'text-primary' : 'text-text-primary'}`}>{opt.label}</span>
                          <p className="text-xs text-text-secondary mt-0.5">{opt.desc}</p>
                          <div className="flex gap-1 mt-3">
                            {Array.from({ length: opt.weeks }).map((_, i) => (
                              <div key={i} className={`flex-1 h-1.5 rounded-full ${trackDuration === opt.val ? 'gradient-primary' : 'bg-surface'}`} />
                            ))}
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          trackDuration === opt.val ? 'border-primary bg-primary' : 'border-border'
                        }`}>
                          {trackDuration === opt.val && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="px-5 py-5 border-t border-surface lg:border-0">
          <div className="max-w-[460px] mx-auto flex gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="h-[52px] px-6 rounded-2xl border-2 border-border/40 text-text-secondary font-semibold flex items-center gap-2 hover:bg-surface transition-colors"
              >
                <ArrowLeft size={18} /> Back
              </button>
            )}
            <button
              onClick={() => step < steps.length - 1 ? setStep(step + 1) : handleFinish()}
              disabled={!canProceed() || saving}
              className="flex-1 h-[52px] rounded-2xl gradient-primary text-white font-heading font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : step < steps.length - 1 ? (
                <>Continue <ArrowRight size={18} /></>
              ) : (
                <>Start Learning <Sparkles size={18} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
