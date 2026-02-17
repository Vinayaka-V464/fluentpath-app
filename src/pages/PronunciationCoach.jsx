import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mic, MicOff, Volume2, RotateCcw, ChevronLeft, ChevronRight, Award, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { speak, startListening, stopListening, comparePronunciation, isSpeakingSupported, isListeningSupported } from '../services/speech';
import { awardXP, XP_AMOUNTS, logSession } from '../services/firestore';

const WORDS = [
  { word: 'Beautiful', phonetic: '/ˈbjuː.tɪ.fəl/', difficulty: 'Easy' },
  { word: 'Comfortable', phonetic: '/ˈkʌm.fə.tə.bəl/', difficulty: 'Easy' },
  { word: 'Vocabulary', phonetic: '/vəˈkæb.jə.ler.i/', difficulty: 'Medium' },
  { word: 'Necessary', phonetic: '/ˈnes.ə.ser.i/', difficulty: 'Medium' },
  { word: 'Pronunciation', phonetic: '/prəˌnʌn.siˈeɪ.ʃən/', difficulty: 'Medium' },
  { word: 'Entrepreneur', phonetic: '/ˌɒn.trə.prəˈnɜːr/', difficulty: 'Hard' },
  { word: 'Sophisticated', phonetic: '/səˈfɪs.tɪ.keɪ.tɪd/', difficulty: 'Hard' },
  { word: 'Extraordinary', phonetic: '/ɪkˈstrɔː.dɪ.nər.i/', difficulty: 'Hard' },
  { word: 'Particularly', phonetic: '/pəˈtɪk.jə.lə.li/', difficulty: 'Medium' },
  { word: 'Enthusiastic', phonetic: '/ɪnˌθjuː.ziˈæs.tɪk/', difficulty: 'Hard' },
  { word: 'Determination', phonetic: '/dɪˌtɜː.mɪˈneɪ.ʃən/', difficulty: 'Medium' },
  { word: 'Congratulations', phonetic: '/kənˌɡrætʃ.əˈleɪ.ʃənz/', difficulty: 'Hard' },
  { word: 'Independent', phonetic: '/ˌɪn.dɪˈpen.dənt/', difficulty: 'Medium' },
  { word: 'Appreciate', phonetic: '/əˈpriː.ʃi.eɪt/', difficulty: 'Easy' },
  { word: 'Experience', phonetic: '/ɪkˈspɪə.ri.əns/', difficulty: 'Easy' },
  { word: 'Temperature', phonetic: '/ˈtem.prə.tʃər/', difficulty: 'Medium' },
];

const SENTENCES = [
  { text: 'The weather is beautiful today.', difficulty: 'Easy' },
  { text: 'Could you please repeat that?', difficulty: 'Easy' },
  { text: 'I would like to make a reservation.', difficulty: 'Medium' },
  { text: 'She has a remarkable sense of humor.', difficulty: 'Medium' },
  { text: 'The documentary was incredibly fascinating.', difficulty: 'Hard' },
  { text: 'I appreciate your extraordinary patience.', difficulty: 'Hard' },
];

export default function PronunciationCoach() {
  const { user } = useAuth();
  const [mode, setMode] = useState('words'); // words | sentences
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [practiced, setPracticed] = useState(0);
  const [sessionLogged, setSessionLogged] = useState(false);

  const canSpeak = isSpeakingSupported();
  const canListen = isListeningSupported();
  const items = mode === 'words' ? WORDS : SENTENCES;
  const current = items[currentIndex];

  const handleListen = () => {
    if (!canSpeak) return;
    const text = mode === 'words' ? current.word : current.text;
    speak(text, { rate: 0.7 });
  };

  const handleRecord = async () => {
    if (!canListen) return;
    if (recording) {
      stopListening();
      setRecording(false);
      return;
    }
    setRecording(true);
    setResult(null);
    setTranscript('');
    try {
      const spoken = await startListening({ language: 'en-US' });
      setRecording(false);
      setTranscript(spoken);
      const target = mode === 'words' ? current.word : current.text;
      const score = comparePronunciation(spoken, target);
      setResult(score);
      setAttempts(prev => prev + 1);
      setTotalScore(prev => prev + score.score);
      setPracticed(prev => prev + 1);

      // Award XP after 3 practices
      if (!sessionLogged && practiced >= 2 && user) {
        await awardXP(user.uid, XP_AMOUNTS.PRONUNCIATION);
        await logSession(user.uid, 'pronunciation', 5);
        setSessionLogged(true);
      }
    } catch {
      setRecording(false);
    }
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, items.length - 1));
    setResult(null);
    setTranscript('');
  };

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
    setResult(null);
    setTranscript('');
  };

  const handleShuffle = () => {
    setCurrentIndex(Math.floor(Math.random() * items.length));
    setResult(null);
    setTranscript('');
  };

  const scoreColor = (score) => {
    if (score >= 80) return '#14B8A6';
    if (score >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const scoreLabel = (score) => {
    if (score >= 90) return 'Excellent!';
    if (score >= 70) return 'Great job!';
    if (score >= 50) return 'Good try!';
    return 'Keep practicing';
  };

  const diffColor = { Easy: '#14B8A6', Medium: '#F59E0B', Hard: '#EF4444' };

  return (
    <div className="lg:p-6 xl:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="px-5 pt-6 pb-4 lg:px-0 lg:pt-0 lg:pb-6">
          <h1 className="font-heading text-2xl lg:text-3xl font-bold">Pronunciation Coach</h1>
          <p className="text-sm text-text-secondary mt-1">Practice your pronunciation with real-time feedback</p>
        </div>

        {/* Mode Toggle */}
        <div className="px-5 lg:px-0 mb-5">
          <div className="flex gap-1 bg-surface lg:bg-surface/60 rounded-2xl p-1.5 max-w-xs">
            <button onClick={() => { setMode('words'); setCurrentIndex(0); setResult(null); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === 'words' ? 'bg-white shadow-sm text-text-primary' : 'text-text-tertiary'}`}>
              Words
            </button>
            <button onClick={() => { setMode('sentences'); setCurrentIndex(0); setResult(null); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === 'sentences' ? 'bg-white shadow-sm text-text-primary' : 'text-text-tertiary'}`}>
              Sentences
            </button>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-5 lg:gap-6">
          {/* Main Card - 3/5 */}
          <div className="lg:col-span-3 px-5 lg:px-0">
            <div className="lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border/30 lg:p-8">
              {/* Counter + Shuffle */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold text-text-tertiary">{currentIndex + 1} / {items.length}</span>
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md" style={{ color: diffColor[current.difficulty], backgroundColor: `${diffColor[current.difficulty]}15` }}>
                    {current.difficulty}
                  </span>
                  <button onClick={handleShuffle} className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-text-tertiary hover:text-text-secondary">
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>

              {/* Word/Sentence Display */}
              <div className="text-center py-6">
                <AnimatePresence mode="wait">
                  <motion.div key={currentIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <p className="font-heading text-3xl lg:text-4xl font-bold text-text-primary mb-2">
                      {mode === 'words' ? current.word : `"${current.text}"`}
                    </p>
                    {mode === 'words' && current.phonetic && (
                      <p className="text-sm text-text-secondary font-mono">{current.phonetic}</p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Listen Button */}
              {canSpeak && (
                <div className="flex justify-center mb-6">
                  <button onClick={handleListen}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/20 transition-colors">
                    <Volume2 size={16} /> Listen
                  </button>
                </div>
              )}

              {/* Record Button */}
              <div className="flex justify-center mb-6">
                {canListen ? (
                  <button onClick={handleRecord}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                      recording
                        ? 'bg-error text-white shadow-lg shadow-error/30 animate-pulse'
                        : 'gradient-hero text-white shadow-lg shadow-teal/20 hover:shadow-xl hover:scale-105'
                    }`}>
                    {recording ? <MicOff size={28} /> : <Mic size={28} />}
                  </button>
                ) : (
                  <p className="text-sm text-text-tertiary italic">Speech recognition not supported in this browser</p>
                )}
              </div>
              <p className="text-center text-xs text-text-tertiary mb-6">
                {recording ? 'Listening... tap to stop' : 'Tap to start recording'}
              </p>

              {/* Result */}
              {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl mb-4" style={{ backgroundColor: `${scoreColor(result.score)}10` }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold" style={{ color: scoreColor(result.score) }}>{scoreLabel(result.score)}</span>
                    <span className="text-3xl font-heading font-bold" style={{ color: scoreColor(result.score) }}>{result.score}%</span>
                  </div>
                  <div className="h-3 bg-white rounded-full overflow-hidden mb-3">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${result.score}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full" style={{ backgroundColor: scoreColor(result.score) }} />
                  </div>
                  {transcript && (
                    <div className="mt-3">
                      <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-1">You said:</p>
                      <p className="text-sm text-text-secondary italic">"{transcript}"</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button onClick={handlePrev} disabled={currentIndex === 0}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentIndex === 0 ? 'bg-surface text-text-tertiary cursor-not-allowed' : 'bg-surface text-text-secondary hover:bg-elevated'}`}>
                  <ChevronLeft size={18} />
                </button>
                <button onClick={handleNext} disabled={currentIndex === items.length - 1}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentIndex === items.length - 1 ? 'bg-surface text-text-tertiary cursor-not-allowed' : 'bg-surface text-text-secondary hover:bg-elevated'}`}>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Sidebar - 2/5 */}
          <div className="lg:col-span-2 mt-6 lg:mt-0 px-5 lg:px-0 pb-8 lg:pb-0 space-y-4">
            {/* Session Stats */}
            <div className="bg-surface lg:bg-white lg:border lg:border-border/30 lg:shadow-sm rounded-2xl p-5">
              <h3 className="font-heading font-bold mb-4">Session Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-white lg:bg-surface rounded-xl">
                  <p className="text-2xl font-heading font-bold text-primary">{practiced}</p>
                  <p className="text-[10px] text-text-tertiary font-medium">Practiced</p>
                </div>
                <div className="text-center p-3 bg-white lg:bg-surface rounded-xl">
                  <p className="text-2xl font-heading font-bold text-teal">
                    {attempts > 0 ? Math.round(totalScore / attempts) : 0}%
                  </p>
                  <p className="text-[10px] text-text-tertiary font-medium">Avg Score</p>
                </div>
              </div>
              {sessionLogged && (
                <div className="flex items-center gap-2 mt-3 p-3 bg-gold/10 rounded-xl">
                  <Award size={16} className="text-gold" />
                  <span className="text-xs font-bold text-gold">+{XP_AMOUNTS.PRONUNCIATION} XP earned!</span>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-surface lg:bg-white lg:border lg:border-border/30 lg:shadow-sm rounded-2xl p-5">
              <h3 className="font-heading font-bold mb-3">Tips</h3>
              <ul className="space-y-2.5 text-sm text-text-secondary">
                <li className="flex gap-2"><span className="text-teal">•</span>Listen first, then try to repeat</li>
                <li className="flex gap-2"><span className="text-teal">•</span>Speak clearly and at a natural pace</li>
                <li className="flex gap-2"><span className="text-teal">•</span>Reduce background noise for accuracy</li>
                <li className="flex gap-2"><span className="text-teal">•</span>Practice each word at least 3 times</li>
              </ul>
            </div>

            {/* Word List */}
            <div className="bg-surface lg:bg-white lg:border lg:border-border/30 lg:shadow-sm rounded-2xl p-5">
              <h3 className="font-heading font-bold mb-3">All {mode === 'words' ? 'Words' : 'Sentences'}</h3>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {items.map((item, i) => (
                  <button key={i} onClick={() => { setCurrentIndex(i); setResult(null); setTranscript(''); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      i === currentIndex ? 'bg-primary/10 text-primary font-semibold' : 'text-text-secondary hover:bg-surface'
                    }`}>
                    {mode === 'words' ? item.word : item.text.substring(0, 30) + '...'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
