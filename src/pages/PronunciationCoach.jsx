import { useState } from 'react';
import { Mic, MicOff, Volume2, RotateCcw, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRONUNCIATION_WORDS } from '../config/gemini';

export default function PronunciationCoach() {
  const [currentWord, setCurrentWord] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [score, setScore] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const word = PRONUNCIATION_WORDS[currentWord];

  const handleListen = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate a score
      const s = Math.floor(Math.random() * 30) + 70;
      setScore(s);
      setAttempts(prev => prev + 1);
    } else {
      setIsRecording(true);
      setScore(null);
    }
  };

  const nextWord = () => {
    if (currentWord < PRONUNCIATION_WORDS.length - 1) {
      setCurrentWord(prev => prev + 1);
      setScore(null);
      setAttempts(0);
    }
  };

  const prevWord = () => {
    if (currentWord > 0) {
      setCurrentWord(prev => prev - 1);
      setScore(null);
      setAttempts(0);
    }
  };

  const getScoreColor = (s) => s >= 90 ? '#14B8A6' : s >= 75 ? '#F59E0B' : '#EF4444';
  const getScoreLabel = (s) => s >= 90 ? 'Excellent!' : s >= 75 ? 'Good effort!' : 'Keep trying!';

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-8">
      <div className="px-5 pt-6 lg:px-6 xl:px-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 lg:hidden">
          <h1 className="text-2xl font-heading font-bold text-text-primary">Pronunciation Coach</h1>
          <p className="text-sm text-text-secondary mt-1">Listen, practice, and perfect your accent</p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-8 lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border/30 lg:p-4">
          <span className="text-xs font-semibold text-text-secondary">{currentWord + 1}/{PRONUNCIATION_WORDS.length}</span>
          <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full gradient-primary"
              animate={{ width: `${((currentWord + 1) / PRONUNCIATION_WORDS.length) * 100}%` }}
            />
          </div>
          <div className="flex items-center gap-1">
            <Award size={14} className="text-gold" />
            <span className="text-xs font-semibold text-gold">{attempts} tries</span>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-8">
          {/* Left Column - Word Card */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentWord}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="bg-gradient-to-br from-primary/5 to-teal/5 rounded-3xl p-8 lg:p-10 text-center mb-8 lg:bg-white lg:shadow-sm lg:border lg:border-border/30 lg:from-primary/3 lg:to-teal/3"
              >
                <p className="text-4xl lg:text-6xl font-heading font-bold text-text-primary mb-2">{word.word}</p>
                <p className="text-lg lg:text-xl text-primary font-mono">{word.phonetic}</p>
                <p className="text-sm lg:text-base text-text-secondary mt-2">{word.tips}</p>

                {/* Listen button */}
                <button
                  onClick={handleListen}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-teal/10 rounded-full text-teal font-semibold text-sm hover:bg-teal/20 transition-colors"
                >
                  <Volume2 size={18} />
                  Listen
                </button>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevWord}
                disabled={currentWord === 0}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface text-text-secondary font-semibold text-sm disabled:opacity-30"
              >
                <ChevronLeft size={18} /> Previous
              </button>
              {score !== null && (
                <button
                  onClick={() => { setScore(null); }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface text-text-secondary font-semibold text-sm"
                >
                  <RotateCcw size={16} /> Retry
                </button>
              )}
              <button
                onClick={nextWord}
                disabled={currentWord === PRONUNCIATION_WORDS.length - 1}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl gradient-primary text-white font-semibold text-sm disabled:opacity-30"
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Right Column - Recording Area */}
          <div className="lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border/30 lg:p-6">
            {/* Waveform Visualization (simulated) */}
            <div className="h-20 flex items-center justify-center gap-[3px] mb-8 mt-8 lg:mt-0">
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-1.5 rounded-full ${isRecording ? 'bg-primary' : 'bg-border'}`}
                  animate={isRecording ? {
                    height: [8, Math.random() * 60 + 10, 8],
                  } : { height: 8 }}
                  transition={isRecording ? {
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.03,
                  } : {}}
                  style={{ height: 8 }}
                />
              ))}
            </div>

            {/* Record Button */}
            <div className="flex justify-center mb-4">
              <button
                onClick={handleRecord}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                  isRecording ? 'bg-error animate-pulse shadow-lg shadow-error/30' : 'gradient-primary shadow-lg shadow-primary/30'
                }`}
              >
                {isRecording ? <MicOff size={28} className="text-white" /> : <Mic size={28} className="text-white" />}
              </button>
            </div>
            <p className="text-center text-sm text-text-secondary mb-6">
              {isRecording ? 'Recording... Tap to stop' : 'Tap to start recording'}
            </p>

            {/* Score Display */}
            {score !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mb-4 lg:border-t lg:border-border/30 lg:pt-6"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4" style={{ borderColor: getScoreColor(score) }}>
                  <span className="text-3xl font-heading font-bold" style={{ color: getScoreColor(score) }}>{score}%</span>
                </div>
                <p className="mt-2 font-semibold text-lg" style={{ color: getScoreColor(score) }}>{getScoreLabel(score)}</p>
                <p className="text-sm text-text-secondary mt-1">
                  {score >= 90 ? 'Your pronunciation is spot on!' : score >= 75 ? 'Almost there, try emphasizing the stressed syllable.' : 'Listen again carefully and try once more.'}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
