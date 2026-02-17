import { useState } from 'react';
import { ArrowLeft, BookOpen, Play, CheckCircle, Star, Clock, ChevronRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const lessonData = {
  'present-tenses': {
    title: 'Present Tenses',
    level: 'B1',
    duration: '15 min',
    color: '#8B5CF6',
    sections: [
      {
        title: 'Present Simple',
        content: 'The present simple is used for habits, facts, and general truths.',
        formula: 'Subject + Base Verb (+ s/es for 3rd person)',
        examples: [
          { sentence: 'She speaks English fluently.', highlight: 'speaks' },
          { sentence: 'They go to school every day.', highlight: 'go' },
          { sentence: 'Water boils at 100°C.', highlight: 'boils' },
        ],
      },
      {
        title: 'Present Continuous',
        content: 'The present continuous is used for actions happening right now or around now.',
        formula: 'Subject + am/is/are + Verb-ing',
        examples: [
          { sentence: 'I am learning English right now.', highlight: 'am learning' },
          { sentence: 'She is reading a book.', highlight: 'is reading' },
          { sentence: 'They are working on a project.', highlight: 'are working' },
        ],
      },
      {
        title: 'Present Perfect',
        content: 'The present perfect connects the past to the present.',
        formula: 'Subject + have/has + Past Participle',
        examples: [
          { sentence: 'I have visited Paris twice.', highlight: 'have visited' },
          { sentence: 'She has finished her homework.', highlight: 'has finished' },
          { sentence: 'We have known each other for years.', highlight: 'have known' },
        ],
      },
    ],
    quiz: [
      { question: 'She ___ (go) to work every day.', answer: 'goes', options: ['go', 'goes', 'going', 'gone'] },
      { question: 'I ___ (study) English right now.', answer: 'am studying', options: ['study', 'am studying', 'studies', 'have studied'] },
      { question: 'They ___ (live) here since 2010.', answer: 'have lived', options: ['lived', 'live', 'have lived', 'are living'] },
    ],
  },
};

const defaultLesson = {
  title: 'Lesson',
  level: 'B1',
  duration: '15 min',
  color: '#14B8A6',
  sections: [
    {
      title: 'Introduction',
      content: 'This lesson covers important English language concepts. Master these to improve your fluency!',
      formula: 'Practice + Consistency = Fluency',
      examples: [
        { sentence: 'The more you practice, the better you get.', highlight: 'practice' },
        { sentence: 'Reading helps expand your vocabulary.', highlight: 'Reading' },
      ],
    },
  ],
  quiz: [
    { question: 'Practice makes ___', answer: 'perfect', options: ['perfect', 'good', 'better', 'great'] },
  ],
};

export default function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const lesson = lessonData[id] || { ...defaultLesson, title: id?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Lesson' };

  const handleQuizAnswer = (qi, answer) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qi]: answer }));
  };

  const submitQuiz = () => {
    setQuizSubmitted(true);
  };

  const score = Object.entries(quizAnswers).filter(([qi, a]) => lesson.quiz[qi]?.answer === a).length;

  return (
    <div className="min-h-screen bg-white lg:bg-transparent pb-24 lg:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-surface lg:relative lg:border-0">
        <div className="flex items-center gap-3 px-5 py-4 lg:px-6 xl:px-8 lg:py-6 max-w-5xl mx-auto">
          <button onClick={() => navigate(-1)} className="text-text-secondary hover:text-text-primary">
            <ArrowLeft size={22} />
          </button>
          <div className="flex-1">
            <h1 className="font-heading font-bold text-lg text-text-primary">{lesson.title}</h1>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs font-bold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: lesson.color }}>{lesson.level}</span>
              <div className="flex items-center gap-1 text-text-tertiary">
                <Clock size={12} />
                <span className="text-xs">{lesson.duration}</span>
              </div>
            </div>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-sm font-semibold" style={{ backgroundColor: lesson.color }}>
            <BookOpen size={16} /> Notes
          </button>
        </div>
      </div>

      <div className="px-5 pt-6 lg:px-6 xl:px-8 max-w-5xl mx-auto">
        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
        <div>
        {!showQuiz ? (
          <>
            {/* Section Tabs */}
            {lesson.sections.length > 1 && (
              <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
                {lesson.sections.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSection(i)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                      activeSection === i ? 'text-white' : 'bg-surface text-text-secondary'
                    }`}
                    style={activeSection === i ? { backgroundColor: lesson.color } : {}}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            )}

            {/* Content */}
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-heading font-bold text-text-primary mb-2">{lesson.sections[activeSection].title}</h2>
                <p className="text-[15px] text-text-secondary leading-relaxed">{lesson.sections[activeSection].content}</p>
              </div>

              {/* Formula Card */}
              <div className="p-4 rounded-2xl border-2 border-dashed" style={{ borderColor: `${lesson.color}40`, backgroundColor: `${lesson.color}08` }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: lesson.color }}>Formula</p>
                <p className="text-lg font-heading font-bold text-text-primary">{lesson.sections[activeSection].formula}</p>
              </div>

              {/* Examples */}
              <div>
                <h3 className="text-sm font-bold text-text-primary mb-3">Examples</h3>
                <div className="space-y-3">
                  {lesson.sections[activeSection].examples.map((ex, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-surface rounded-xl">
                      <CheckCircle size={18} className="mt-0.5 flex-shrink-0" style={{ color: lesson.color }} />
                      <p className="text-[15px] text-text-primary">
                        {ex.sentence.split(ex.highlight).map((part, pi, arr) => (
                          <span key={pi}>
                            {part}
                            {pi < arr.length - 1 && <strong className="font-bold" style={{ color: lesson.color }}>{ex.highlight}</strong>}
                          </span>
                        ))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Section / Quiz Button */}
              <div className="pt-4">
                {activeSection < lesson.sections.length - 1 ? (
                  <button
                    onClick={() => setActiveSection(prev => prev + 1)}
                    className="w-full py-3.5 rounded-2xl text-white font-semibold flex items-center justify-center gap-2"
                    style={{ backgroundColor: lesson.color }}
                  >
                    Next: {lesson.sections[activeSection + 1].title} <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowQuiz(true)}
                    className="w-full py-3.5 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 gradient-primary"
                  >
                    <Play size={18} /> Start Practice Quiz
                  </button>
                )}
              </div>
            </motion.div>
          </>
        ) : (
          /* Quiz */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold text-text-primary">Practice Quiz</h2>
              {quizSubmitted && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${lesson.color}15` }}>
                  <Star size={16} className="fill-current" style={{ color: lesson.color }} />
                  <span className="font-bold text-sm" style={{ color: lesson.color }}>{score}/{lesson.quiz.length}</span>
                </div>
              )}
            </div>

            {lesson.quiz.map((q, qi) => (
              <div key={qi} className="p-4 bg-surface rounded-2xl space-y-3">
                <p className="font-semibold text-text-primary text-[15px]">Q{qi + 1}. {q.question}</p>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map(opt => {
                    const selected = quizAnswers[qi] === opt;
                    const correct = quizSubmitted && opt === q.answer;
                    const wrong = quizSubmitted && selected && opt !== q.answer;
                    return (
                      <button
                        key={opt}
                        onClick={() => handleQuizAnswer(qi, opt)}
                        className={`py-2.5 px-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                          correct ? 'border-teal bg-teal/10 text-teal' :
                          wrong ? 'border-error bg-error/10 text-error' :
                          selected ? 'border-primary bg-primary/10 text-primary' :
                          'border-transparent bg-white text-text-secondary hover:border-border'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {!quizSubmitted ? (
              <button
                onClick={submitQuiz}
                disabled={Object.keys(quizAnswers).length < lesson.quiz.length}
                className="w-full py-3.5 rounded-2xl text-white font-semibold gradient-primary disabled:opacity-40"
              >
                Submit Answers
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => { setShowQuiz(false); setActiveSection(0); setQuizAnswers({}); setQuizSubmitted(false); }}
                  className="w-full py-3.5 rounded-2xl border-2 border-primary text-primary font-semibold"
                >
                  Review Lesson
                </button>
                <button onClick={() => navigate('/lessons')} className="w-full py-3.5 rounded-2xl gradient-primary text-white font-semibold">
                  Next Lesson
                </button>
              </div>
            )}
          </motion.div>
        )}
        </div>

        {/* Desktop Sidebar - Table of Contents */}
        <div className="hidden lg:block">
          <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-border/30 p-5">
            <h3 className="font-heading font-bold text-sm text-text-primary mb-4">Lesson Content</h3>
            <div className="space-y-1">
              {lesson.sections.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setShowQuiz(false); setActiveSection(i); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    !showQuiz && activeSection === i ? 'bg-primary/10 text-primary font-semibold' : 'text-text-secondary hover:bg-surface'
                  }`}
                >
                  {i + 1}. {s.title}
                </button>
              ))}
              <button
                onClick={() => setShowQuiz(true)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  showQuiz ? 'bg-primary/10 text-primary font-semibold' : 'text-text-secondary hover:bg-surface'
                }`}
              >
                Practice Quiz
              </button>
            </div>
            <div className="mt-5 pt-4 border-t border-border/30">
              <div className="flex items-center justify-between text-xs text-text-tertiary mb-2">
                <span>Progress</span>
                <span className="font-bold" style={{ color: lesson.color }}>{Math.round(((activeSection + 1) / lesson.sections.length) * 100)}%</span>
              </div>
              <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${((activeSection + 1) / lesson.sections.length) * 100}%`, backgroundColor: lesson.color }} />
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
