import { useState } from 'react';
import { Search, BookOpen, ChevronRight, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = ['All', 'Grammar', 'Vocabulary', 'Speaking', 'Writing'];

const lessons = [
  {
    id: 'present-tenses',
    title: 'Present Tenses',
    subtitle: 'Master present simple & continuous',
    category: 'Grammar',
    level: 'B1',
    duration: '15 min',
    progress: 75,
    rating: 4.8,
    color: '#8B5CF6',
    icon: '📖',
  },
  {
    id: 'daily-conversations',
    title: 'Daily Conversations',
    subtitle: 'Everyday phrases and responses',
    category: 'Speaking',
    level: 'A2',
    duration: '10 min',
    progress: 40,
    rating: 4.9,
    color: '#14B8A6',
    icon: '💬',
  },
  {
    id: 'business-vocabulary',
    title: 'Business Vocabulary',
    subtitle: 'Professional English words',
    category: 'Vocabulary',
    level: 'B2',
    duration: '20 min',
    progress: 0,
    rating: 4.7,
    color: '#F59E0B',
    icon: '💼',
  },
  {
    id: 'email-writing',
    title: 'Email Writing',
    subtitle: 'Formal & informal emails',
    category: 'Writing',
    level: 'B1',
    duration: '12 min',
    progress: 60,
    rating: 4.6,
    color: '#F472B6',
    icon: '✉️',
  },
  {
    id: 'past-tenses',
    title: 'Past Tenses',
    subtitle: 'Simple past, past continuous, perfect',
    category: 'Grammar',
    level: 'B1',
    duration: '18 min',
    progress: 0,
    rating: 4.5,
    color: '#8B5CF6',
    icon: '⏳',
  },
  {
    id: 'travel-english',
    title: 'Travel English',
    subtitle: 'Navigate airports, hotels & more',
    category: 'Speaking',
    level: 'A2',
    duration: '15 min',
    progress: 20,
    rating: 4.8,
    color: '#14B8A6',
    icon: '✈️',
  },
  {
    id: 'idioms-phrases',
    title: 'Idioms & Phrases',
    subtitle: 'Common English expressions',
    category: 'Vocabulary',
    level: 'B2',
    duration: '14 min',
    progress: 0,
    rating: 4.4,
    color: '#F59E0B',
    icon: '🎯',
  },
  {
    id: 'essay-structure',
    title: 'Essay Structure',
    subtitle: 'Organize your thoughts in writing',
    category: 'Writing',
    level: 'B2',
    duration: '25 min',
    progress: 0,
    rating: 4.7,
    color: '#F472B6',
    icon: '📝',
  },
];

export default function Lessons() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = lessons.filter(l => {
    const matchCategory = activeCategory === 'All' || l.category === activeCategory;
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) || l.subtitle.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-white lg:bg-transparent pb-24 lg:pb-8">
      <div className="px-5 pt-6 lg:px-6 xl:px-8 lg:pt-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 lg:mb-5">
          <div>
            <h1 className="text-2xl font-heading font-bold text-text-primary lg:hidden">Lessons</h1>
            <p className="text-sm text-text-secondary mt-0.5">{lessons.length} lessons available</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-primary font-semibold">
            <BookOpen size={18} />
            <span>{lessons.filter(l => l.progress > 0).length} in progress</span>
          </div>
        </div>

        {/* Search & Categories row */}
        <div className="lg:flex lg:items-center lg:gap-4 mb-6">
          <div className="relative lg:w-72 mb-4 lg:mb-0">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search lessons..."
              className="w-full h-11 pl-11 pr-4 bg-surface lg:bg-white lg:border lg:border-border/40 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-text-primary placeholder:text-text-tertiary"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'gradient-primary text-white'
                    : 'bg-surface lg:bg-white lg:border lg:border-border/40 text-text-secondary hover:text-text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Lesson Cards - list on mobile, grid on desktop */}
        <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4">
          {filtered.map((lesson, i) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                to={`/lessons/${lesson.id}`}
                className="flex items-center gap-4 p-4 bg-white border border-surface lg:border-border/30 rounded-2xl hover:shadow-lg lg:shadow-sm transition-all lg:flex-col lg:items-start lg:gap-3 group"
              >
                <div className="flex items-center gap-4 lg:w-full">
                  <div
                    className="w-14 h-14 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center text-2xl lg:text-xl flex-shrink-0"
                    style={{ backgroundColor: `${lesson.color}15` }}
                  >
                    {lesson.icon}
                  </div>
                  <div className="flex-1 min-w-0 lg:hidden">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-[15px] text-text-primary truncate">{lesson.title}</h3>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white flex-shrink-0" style={{ backgroundColor: lesson.color }}>{lesson.level}</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5 truncate">{lesson.subtitle}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-text-tertiary" />
                        <span className="text-[11px] text-text-tertiary">{lesson.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-gold fill-gold" />
                        <span className="text-[11px] text-text-tertiary">{lesson.rating}</span>
                      </div>
                      {lesson.progress > 0 && (
                        <div className="flex items-center gap-2 flex-1">
                          <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${lesson.progress}%`, backgroundColor: lesson.color }} />
                          </div>
                          <span className="text-[11px] font-semibold" style={{ color: lesson.color }}>{lesson.progress}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Desktop: title & level inline with icon */}
                  <div className="hidden lg:flex lg:items-center lg:gap-2 lg:flex-1 lg:min-w-0">
                    <h3 className="font-heading font-bold text-[15px] text-text-primary truncate">{lesson.title}</h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white flex-shrink-0" style={{ backgroundColor: lesson.color }}>{lesson.level}</span>
                  </div>
                  <ChevronRight size={18} className="text-text-tertiary flex-shrink-0 lg:hidden" />
                </div>

                {/* Desktop card body */}
                <div className="hidden lg:block w-full">
                  <p className="text-xs text-text-secondary truncate">{lesson.subtitle}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="text-text-tertiary" />
                      <span className="text-[11px] text-text-tertiary">{lesson.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-gold fill-gold" />
                      <span className="text-[11px] text-text-tertiary">{lesson.rating}</span>
                    </div>
                  </div>
                  {lesson.progress > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${lesson.progress}%`, backgroundColor: lesson.color }} />
                      </div>
                      <span className="text-[11px] font-bold" style={{ color: lesson.color }}>{lesson.progress}%</span>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg font-heading font-bold text-text-primary">No lessons found</p>
            <p className="text-sm text-text-secondary mt-1">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  );
}
