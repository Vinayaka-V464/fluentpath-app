import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, BookOpen, Volume2, ChevronRight, CheckCircle2, XCircle, Award, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLessonById } from '../data/curriculum';
import { getLessonProgress, saveLessonProgress, completeLessonQuiz, saveLearnedWords } from '../services/firestore';
import { speak } from '../services/speech';

export default function LessonDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const lesson = getLessonById(id);

  const [activeTab, setActiveTab] = useState('content');
  const [activeSection, setActiveSection] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizDone, setQuizDone] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [xpAwarded, setXpAwarded] = useState(0);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fillAnswer, setFillAnswer] = useState('');

  useEffect(() => {
    if (!user || !lesson) return;
    getLessonProgress(user.uid).then(all => {
      setProgress(all[id] || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user, id, lesson]);

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <BookOpen size={48} className="text-text-tertiary" />
        <p className="text-text-secondary">Lesson not found</p>
        <Link to="/lessons" className="text-primary font-semibold text-sm">Back to Lessons</Link>
      </div>
    );
  }

  const quiz = lesson.quiz || [];
  const q = quiz[currentQ];

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentQ]: answer });
    setFillAnswer('');
  };

  const handleNext = () => {
    if (currentQ < quiz.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    let correct = 0;
    quiz.forEach((q, i) => {
      const userAns = (answers[i] || '').trim().toLowerCase();
      const correctAns = q.answer.trim().toLowerCase();
      if (userAns === correctAns) correct++;
    });
    const pct = Math.round((correct / quiz.length) * 100);
    setQuizScore(pct);
    setQuizDone(true);

    try {
      const passed = pct >= 60;
      if (passed) {
        const result = await completeLessonQuiz(user.uid, id, correct, quiz.length);
        if (lesson.vocabulary) await saveLearnedWords(user.uid, lesson.vocabulary);
        setXpAwarded(result.xpEarned || 0);
      }
    } catch (err) {
      console.error('Quiz save error:', err);
    }
  };

  const handleSpeakWord = (text) => {
    speak(text, { rate: 0.8 });
  };

  const tabs = [
    { key: 'content', label: 'Content' },
    { key: 'vocabulary', label: 'Vocabulary' },
    { key: 'quiz', label: 'Quiz' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="lg:p-6 xl:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 lg:px-0 lg:pt-0">
          <button onClick={() => navigate('/lessons')} className="w-10 h-10 rounded-xl bg-surface lg:bg-white lg:border lg:border-border/30 flex items-center justify-center hover:bg-elevated transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-heading text-lg lg:text-2xl font-bold">{lesson.title}</h1>
            <p className="text-xs text-text-secondary">{lesson.category} · {lesson.duration} · Week {lesson.week}</p>
          </div>
          {progress?.completed && (
            <CheckCircle2 size={22} className="text-teal ml-auto" />
          )}
        </div>

        {/* Tabs */}
        <div className="px-5 lg:px-0 mb-5">
          <div className="flex gap-1 bg-surface lg:bg-surface/60 rounded-2xl p-1.5">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === t.key ? 'bg-white shadow-sm text-text-primary' : 'text-text-tertiary hover:text-text-secondary'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* CONTENT TAB */}
              {activeTab === 'content' && (
                <motion.div key="content" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="px-5 lg:px-0">
                  <div className="lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border/30 lg:p-6 space-y-6">
                    {lesson.sections.map((section, i) => (
                      <div key={i} className={`${i > 0 ? 'border-t border-border/20 pt-6' : ''}`}>
                        <h3 className="font-heading font-bold text-lg text-text-primary mb-2">{section.title}</h3>
                        <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{section.content}</p>
                        {section.formula && (
                          <div className="mt-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Formula</p>
                            <p className="text-sm font-mono font-semibold text-text-primary">{section.formula}</p>
                          </div>
                        )}
                        {section.examples && section.examples.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs font-bold text-teal uppercase tracking-wider">Examples</p>
                            {section.examples.map((ex, j) => (
                              <div key={j} className="flex items-start gap-2 p-3 bg-teal/5 rounded-xl">
                                <span className="text-teal mt-0.5">•</span>
                                <p className="text-sm text-text-primary">{typeof ex === 'string' ? ex : ex.sentence}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* VOCABULARY TAB */}
              {activeTab === 'vocabulary' && (
                <motion.div key="vocab" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="px-5 lg:px-0">
                  <div className="space-y-3">
                    {(lesson.vocabulary || []).map((word, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="p-4 bg-surface lg:bg-white lg:border lg:border-border/30 rounded-2xl"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-heading font-bold text-[15px]">{word.word}</h4>
                            {word.type && <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{word.type}</span>}
                          </div>
                          <button onClick={() => handleSpeakWord(word.word)} className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                            <Volume2 size={14} className="text-primary" />
                          </button>
                        </div>
                        <p className="text-sm text-text-secondary">{word.meaning}</p>
                        <p className="text-xs text-text-tertiary mt-1 italic">"{word.example}"</p>
                      </motion.div>
                    ))}
                    {(!lesson.vocabulary || lesson.vocabulary.length === 0) && (
                      <div className="text-center py-8 text-text-tertiary text-sm">No vocabulary for this lesson</div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* QUIZ TAB */}
              {activeTab === 'quiz' && (
                <motion.div key="quiz" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="px-5 lg:px-0">
                  {!quizStarted && !quizDone && (
                    <div className="lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border/30 lg:p-8 text-center py-12">
                      <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                        <Sparkles size={28} className="text-white" />
                      </div>
                      <h3 className="font-heading font-bold text-xl mb-2">Ready to Test?</h3>
                      <p className="text-sm text-text-secondary mb-1">{quiz.length} questions about {lesson.title}</p>
                      <p className="text-xs text-text-tertiary mb-6">Score 60%+ to earn XP and complete the lesson</p>
                      {progress?.completed && (
                        <p className="text-xs text-teal font-semibold mb-4">✓ Previously completed with {progress.quizScore}%</p>
                      )}
                      <button onClick={() => setQuizStarted(true)} className="gradient-primary text-white font-bold px-8 py-3 rounded-2xl hover:shadow-lg hover:shadow-primary/20 transition-all">
                        Start Quiz
                      </button>
                    </div>
                  )}

                  {quizStarted && !quizDone && q && (
                    <div className="lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border/30 lg:p-6">
                      {/* Progress */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-text-secondary">Question {currentQ + 1} of {quiz.length}</span>
                        <span className="text-xs font-bold text-primary">{Math.round(((currentQ) / quiz.length) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-surface rounded-full overflow-hidden mb-6">
                        <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${((currentQ) / quiz.length) * 100}%` }} />
                      </div>

                      {/* Question */}
                      <h3 className="font-heading font-bold text-lg mb-5">{q.question}</h3>

                      {(q.type === 'mcq' || q.type === 'fill-blank') && q.options && (
                        <div className="space-y-3 mb-6">
                          {q.options.map((opt, i) => (
                            <button
                              key={i}
                              onClick={() => handleAnswer(opt)}
                              className={`w-full text-left p-4 rounded-2xl border-2 transition-all text-sm font-medium ${
                                answers[currentQ] === opt
                                  ? 'border-primary bg-primary/5 text-primary'
                                  : 'border-border/30 hover:border-primary/30'
                              }`}
                            >
                              <span className="w-6 h-6 rounded-full border-2 inline-flex items-center justify-center mr-3 text-xs">
                                {String.fromCharCode(65 + i)}
                              </span>
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}

                      {q.type === 'fill' && !q.options && (
                        <div className="mb-6">
                          <input
                            type="text"
                            value={answers[currentQ] || fillAnswer}
                            onChange={(e) => { setFillAnswer(e.target.value); handleAnswer(e.target.value); }}
                            placeholder="Type your answer..."
                            className="w-full h-14 px-5 rounded-2xl border-2 border-border/30 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      )}

                      <button
                        onClick={handleNext}
                        disabled={answers[currentQ] === undefined}
                        className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${
                          answers[currentQ] !== undefined
                            ? 'gradient-primary text-white hover:shadow-lg hover:shadow-primary/20'
                            : 'bg-surface text-text-tertiary cursor-not-allowed'
                        }`}
                      >
                        {currentQ < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
                      </button>
                    </div>
                  )}

                  {quizDone && (
                    <div className="lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border/30 lg:p-8 text-center py-12">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${quizScore >= 60 ? 'bg-teal/10' : 'bg-error/10'}`}>
                        {quizScore >= 60 ? <CheckCircle2 size={40} className="text-teal" /> : <XCircle size={40} className="text-error" />}
                      </div>
                      <h3 className="font-heading font-bold text-2xl mb-2">{quizScore >= 60 ? 'Great Job!' : 'Keep Practicing!'}</h3>
                      <p className="text-4xl font-heading font-bold text-primary my-3">{quizScore}%</p>
                      <p className="text-sm text-text-secondary mb-1">
                        {Math.round(quizScore * quiz.length / 100)} of {quiz.length} correct
                      </p>
                      {xpAwarded > 0 && (
                        <div className="flex items-center justify-center gap-2 mt-3 mb-4">
                          <Award size={18} className="text-gold" />
                          <span className="font-bold text-gold">+{xpAwarded} XP earned!</span>
                        </div>
                      )}
                      <div className="flex gap-3 mt-6 justify-center">
                        <button onClick={() => { setQuizDone(false); setQuizStarted(false); setAnswers({}); setCurrentQ(0); }}
                          className="px-6 py-3 rounded-2xl bg-surface font-bold text-sm hover:bg-elevated transition-colors">
                          Try Again
                        </button>
                        <Link to="/lessons" className="px-6 py-3 rounded-2xl gradient-primary text-white font-bold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all">
                          Next Lesson
                        </Link>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block space-y-4">
            {/* Lesson Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-border/30 p-5">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-3" style={{ backgroundColor: `${lesson.color}15` }}>
                {lesson.icon}
              </div>
              <h3 className="font-heading font-bold mb-1">{lesson.title}</h3>
              <p className="text-xs text-text-secondary">{lesson.subtitle}</p>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-xs"><span className="text-text-tertiary">Category</span><span className="font-semibold">{lesson.category}</span></div>
                <div className="flex justify-between text-xs"><span className="text-text-tertiary">Duration</span><span className="font-semibold">{lesson.duration}</span></div>
                <div className="flex justify-between text-xs"><span className="text-text-tertiary">Level</span><span className="font-semibold">{lesson.level}</span></div>
                <div className="flex justify-between text-xs"><span className="text-text-tertiary">Words</span><span className="font-semibold">{lesson.vocabulary?.length || 0}</span></div>
                <div className="flex justify-between text-xs"><span className="text-text-tertiary">Questions</span><span className="font-semibold">{quiz.length}</span></div>
              </div>
            </div>

            {/* Sections TOC */}
            <div className="bg-white rounded-2xl shadow-sm border border-border/30 p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-tertiary mb-3">Sections</h4>
              <div className="space-y-1">
                {lesson.sections.map((s, i) => (
                  <button key={i} onClick={() => { setActiveTab('content'); setActiveSection(i); }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-surface transition-colors text-text-secondary hover:text-text-primary">
                    <ChevronRight size={14} className="text-text-tertiary" />
                    <span className="truncate">{s.title}</span>
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
