import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, MessageSquare, BookOpen, Trophy } from 'lucide-react';

const slides = [
  {
    title: 'Learn & Speak Naturally',
    description: 'Practice real conversations with our AI tutor. Build confidence speaking English in everyday situations.',
    icon: MessageSquare,
    gradient: 'from-primary to-primary-light',
    color: 'text-primary',
    bgColor: 'bg-primary/5',
  },
  {
    title: 'Master Grammar & Vocabulary',
    description: 'Interactive lessons with spaced repetition. Learn new words and grammar rules that stick with you forever.',
    icon: BookOpen,
    gradient: 'from-teal to-teal-light',
    color: 'text-teal',
    bgColor: 'bg-teal/5',
  },
  {
    title: 'Track Your Progress',
    description: 'Earn XP, maintain streaks, and unlock achievements. Watch yourself grow from beginner to fluent speaker.',
    icon: Trophy,
    gradient: 'from-gold to-orange',
    color: 'text-gold',
    bgColor: 'bg-gold/5',
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const current = slides[step];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Desktop side illustration */}
      <div className="hidden lg:flex lg:w-[45%] gradient-hero items-center justify-center relative overflow-hidden">
        <div className="text-center text-white px-12">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8">
            <Sparkles size={36} className="text-white" />
          </div>
          <h2 className="text-4xl font-heading font-bold mb-4">FluentPath AI</h2>
          <p className="text-lg text-white/80 leading-relaxed">Your personal AI-powered English tutor. Learn naturally through conversations, lessons, and practice.</p>
          <div className="flex justify-center gap-6 mt-10">
            <div className="text-center"><p className="text-2xl font-bold">50K+</p><p className="text-sm text-white/60">Learners</p></div>
            <div className="text-center"><p className="text-2xl font-bold">200+</p><p className="text-sm text-white/60">Lessons</p></div>
            <div className="text-center"><p className="text-2xl font-bold">4.9★</p><p className="text-sm text-white/60">Rating</p></div>
          </div>
        </div>
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/5 rounded-full" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="w-full max-w-[400px] lg:max-w-[440px] text-center"
        >
          {/* Icon */}
          <div className={`w-32 h-32 lg:w-36 lg:h-36 mx-auto rounded-3xl ${current.bgColor} flex items-center justify-center mb-10`}>
            <current.icon size={56} className={current.color} />
          </div>

          <h1 className="font-heading text-[28px] font-bold text-text-primary mb-4">{current.title}</h1>
          <p className="text-base text-text-secondary leading-relaxed mb-10">{current.description}</p>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="flex gap-2 mb-10">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === step ? 'w-8 bg-primary' : 'w-2 bg-elevated'
            }`}
          />
        ))}
      </div>

      {/* Button */}
      <button
        onClick={handleNext}
        className={`w-full max-w-[400px] lg:max-w-[440px] h-[54px] rounded-2xl flex items-center justify-center gap-2 font-heading font-bold text-base text-white transition-opacity hover:opacity-90 ${
          step === slides.length - 1 ? 'gradient-hero' : 'gradient-primary'
        }`}
      >
        {step === slides.length - 1 ? (
          <>Start Learning <Sparkles size={20} /></>
        ) : (
          <>Next <ArrowRight size={20} /></>
        )}
      </button>

      {step < slides.length - 1 && (
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 text-sm text-text-tertiary hover:text-text-secondary"
        >
          Skip
        </button>
      )}
      </div>
    </div>
  );
}
