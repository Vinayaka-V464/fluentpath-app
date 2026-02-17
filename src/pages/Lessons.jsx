import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Search, Clock, BookOpen, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { CURRICULUM, getLessonsByWeek, getAvailableWeeks } from '../data/curriculum';
import { getLessonProgress } from '../services/firestore';

const categories = ['All', 'Grammar', 'Speaking', 'Vocabulary', 'Writing'];

export default function Lessons() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [activeWeek, setActiveWeek] = useState(1);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  const weeks = getAvailableWeeks();

  useEffect(() => {
    if (!user) return;
    getLessonProgress(user.uid).then(p => {
      setProgress(p);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const filtered = useMemo(() => {
    let lessons = getLessonsByWeek(activeWeek);
    if (category !== 'All') lessons = lessons.filter(l => l.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      lessons = lessons.filter(l => l.title.toLowerCase().includes(q) || l.subtitle.toLowerCase().includes(q));
    }
    return lessons;
  }, [activeWeek, category, search]);

  const weekProgress = useMemo(() => {
    const weekLessons = getLessonsByWeek(activeWeek);
    const completed = weekLessons.filter(l => progress[l.id]?.completed).length;
    return weekLessons.length > 0 ? Math.round((completed / weekLessons.length) * 100) : 0;
  }, [activeWeek, progress]);

  const totalCompleted = Object.values(progress).filter(p => p?.completed).length;

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
        <div className="px-5 pt-6 pb-4 lg:px-0 lg:pt-0 lg:pb-6">
          <h1 className="font-heading text-2xl lg:text-3xl font-bold">Lessons</h1>
          <p className="text-sm text-text-secondary mt-1">{totalCompleted} of {CURRICULUM.length} lessons completed</p>
        </div>

        {/* Search */}
        <div className="px-5 lg:px-0 mb-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search lessons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-2xl bg-surface lg:bg-white lg:border lg:border-border/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Week Tabs */}
        <div className="px-5 lg:px-0 mb-4">
          <div className="flex gap-2 overflow-x-auto scroll-hidden pb-1">
            {weeks.map(w => (
              <button
                key={w}
                onClick={() => setActiveWeek(w)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeWeek === w
                    ? 'gradient-primary text-white shadow-md shadow-primary/20'
                    : 'bg-surface lg:bg-white lg:border lg:border-border/30 text-text-secondary hover:text-text-primary'
                }`}
              >
                Week {w}
              </button>
            ))}
          </div>
        </div>

        {/* Week Progress Bar */}
        <div className="px-5 lg:px-0 mb-4">
          <div className="lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border/30 lg:p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Week {activeWeek} Progress</span>
              <span className="text-sm font-bold text-primary">{weekProgress}%</span>
            </div>
            <div className="h-2.5 bg-surface lg:bg-surface rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${weekProgress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full gradient-primary rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="px-5 lg:px-0 mb-5">
          <div className="flex gap-2 overflow-x-auto scroll-hidden pb-1">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                  category === c
                    ? 'bg-primary/10 text-primary'
                    : 'bg-surface text-text-tertiary hover:text-text-secondary'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Lesson Grid */}
        <div className="px-5 pb-8 lg:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((lesson, i) => {
              const lp = progress[lesson.id];
              const isCompleted = lp?.completed;
              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to={`/lessons/${lesson.id}`}
                    className={`block p-5 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-0.5 group relative overflow-hidden ${
                      isCompleted
                        ? 'bg-teal/5 lg:bg-white border border-teal/20 lg:border-teal/20'
                        : 'bg-surface lg:bg-white lg:border lg:border-border/30'
                    }`}
                  >
                    {isCompleted && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle2 size={20} className="text-teal" />
                      </div>
                    )}
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-3"
                      style={{ backgroundColor: `${lesson.color}15` }}>
                      {lesson.icon}
                    </div>
                    <h3 className="font-heading font-bold text-[15px] text-text-primary pr-6">{lesson.title}</h3>
                    <p className="text-xs text-text-secondary mt-1 line-clamp-2">{lesson.subtitle}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md" style={{ color: lesson.color, backgroundColor: `${lesson.color}15` }}>{lesson.category}</span>
                      <span className="flex items-center gap-1 text-[11px] text-text-tertiary">
                        <Clock size={11} /> {lesson.duration}
                      </span>
                    </div>
                    {lp?.quizScore !== undefined && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-teal" style={{ width: `${lp.quizScore}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-teal">{lp.quizScore}%</span>
                      </div>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <BookOpen size={40} className="mx-auto text-text-tertiary mb-3" />
              <p className="text-sm text-text-secondary">No lessons found</p>
              <p className="text-xs text-text-tertiary mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
