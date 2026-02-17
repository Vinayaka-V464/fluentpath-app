import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, Flame, BookOpen, Award, Calendar, Clock, Target, Zap, Star, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserData, getRecentSessions, getEarnedAchievements, getLevelFromXP, LEVEL_THRESHOLDS, ACHIEVEMENTS, getLessonProgress } from '../services/firestore';
import { CURRICULUM } from '../data/curriculum';

export default function Progress() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [lessonProgress, setLessonProgress] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const [ud, sess, ach, lp] = await Promise.all([
          getUserData(user.uid),
          getRecentSessions(user.uid, 14),
          getEarnedAchievements(user.uid),
          getLessonProgress(user.uid),
        ]);
        setUserData(ud);
        setSessions(sess);
        setAchievements(ach);
        setLessonProgress(lp);
      } catch (err) {
        console.error('Progress load error:', err);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const xp = userData?.xp || 0;
  const streak = userData?.streak || 0;
  const levelInfo = getLevelFromXP(xp);
  const lessonsCompleted = Object.values(lessonProgress).filter(p => p?.completed).length;
  const totalLessons = CURRICULUM.length;
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);

  // Weekly activity data
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const weekData = dayLabels.map((label, i) => {
    const d = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = (dayOfWeek === 0 ? 6 : dayOfWeek - 1) - i;
    d.setDate(d.getDate() - diff);
    const dateStr = d.toISOString().split('T')[0];
    const daySessions = sessions.filter(s => {
      const sd = s.timestamp?.toDate?.() || new Date(s.timestamp);
      return sd.toISOString().split('T')[0] === dateStr;
    });
    const mins = daySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    return { label, mins, active: mins > 0 };
  });
  const maxMins = Math.max(...weekData.map(d => d.mins), 1);

  // Category progress
  const categoryProgress = ['Grammar', 'Speaking', 'Vocabulary', 'Writing'].map(cat => {
    const catLessons = CURRICULUM.filter(l => l.category === cat);
    const completed = catLessons.filter(l => lessonProgress[l.id]?.completed).length;
    return {
      name: cat,
      completed,
      total: catLessons.length,
      pct: catLessons.length > 0 ? Math.round((completed / catLessons.length) * 100) : 0,
    };
  });

  const catColors = { Grammar: '#8B5CF6', Speaking: '#14B8A6', Vocabulary: '#F59E0B', Writing: '#F472B6' };

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'skills', label: 'Skills' },
    { key: 'achievements', label: 'Awards' },
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
        <div className="px-5 pt-6 pb-4 lg:px-0 lg:pt-0 lg:pb-6">
          <h1 className="font-heading text-2xl lg:text-3xl font-bold">Progress</h1>
          <p className="text-sm text-text-secondary mt-1">Track your learning journey</p>
        </div>

        {/* Level Card */}
        <div className="px-5 lg:px-0 mb-5">
          <div className="gradient-primary rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-xs text-white/70 font-medium">Current Level</p>
                <p className="text-3xl font-heading font-bold mt-1">{levelInfo.level}</p>
                <p className="text-sm text-white/80">{levelInfo.name}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-heading font-bold">{xp.toLocaleString()}</p>
                <p className="text-xs text-white/70">Total XP</p>
              </div>
            </div>
            <div className="mt-4 relative z-10">
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span>{levelInfo.level}</span>
                <span>{levelInfo.nextLevel}</span>
              </div>
              <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: `${levelInfo.progressToNext}%` }} />
              </div>
              <p className="text-[11px] text-white/60 mt-1">{levelInfo.progressToNext}% to next level</p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="px-5 lg:px-0 mb-5">
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: Flame, label: 'Streak', value: streak, unit: 'days', color: '#FB923C' },
              { icon: BookOpen, label: 'Lessons', value: lessonsCompleted, unit: `/${totalLessons}`, color: '#8B5CF6' },
              { icon: Clock, label: 'Time', value: totalMinutes, unit: 'min', color: '#14B8A6' },
              { icon: Award, label: 'Awards', value: achievements.length, unit: `/${ACHIEVEMENTS.length}`, color: '#F59E0B' },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="text-center p-4 bg-surface lg:bg-white lg:border lg:border-border/30 lg:shadow-sm rounded-2xl">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: `${s.color}15` }}>
                  <s.icon size={17} style={{ color: s.color }} />
                </div>
                <p className="text-xl font-heading font-bold">{s.value}<span className="text-xs text-text-tertiary font-normal">{s.unit}</span></p>
                <p className="text-[10px] text-text-tertiary font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5 lg:px-0 mb-5">
          <div className="flex gap-1 bg-surface lg:bg-surface/60 rounded-2xl p-1.5">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === t.key ? 'bg-white shadow-sm text-text-primary' : 'text-text-tertiary'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-5 lg:px-0 pb-8">
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-6 lg:space-y-0">
              {/* Weekly Activity */}
              <div className="lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border/30 lg:p-6">
                <h3 className="font-heading font-bold text-base lg:text-lg mb-5">This Week</h3>
                <div className="flex items-end justify-between h-32 gap-2">
                  {weekData.map((d, i) => (
                    <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${d.mins > 0 ? Math.max((d.mins / maxMins) * 100, 15) : 8}%` }}
                        transition={{ delay: i * 0.05, duration: 0.6 }}
                        className={`w-full max-w-8 rounded-lg ${d.active ? 'gradient-hero' : 'bg-surface'}`}
                      />
                      <span className="text-[10px] font-medium text-text-tertiary">{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border/30 lg:p-6">
                <h3 className="font-heading font-bold text-base lg:text-lg mb-4">Recent Activity</h3>
                {sessions.length === 0 ? (
                  <p className="text-sm text-text-tertiary text-center py-8">No activity yet. Start learning!</p>
                ) : (
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {sessions.slice(0, 8).map((s, i) => {
                      const d = s.timestamp?.toDate?.() || new Date(s.timestamp);
                      const typeIcons = { lesson: '📖', chat: '💬', pronunciation: '🎤', writing: '✍️', quiz: '❓' };
                      return (
                        <div key={i} className="flex items-center gap-3 p-3 bg-surface lg:bg-surface/60 rounded-xl">
                          <span className="text-lg">{typeIcons[s.type] || '📘'}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold capitalize">{s.type}</p>
                            <p className="text-xs text-text-tertiary">{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                          </div>
                          <span className="text-xs font-semibold text-text-secondary">{s.duration}m</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              {categoryProgress.map((cat, i) => (
                <motion.div key={cat.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="p-5 bg-surface lg:bg-white lg:border lg:border-border/30 lg:shadow-sm rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${catColors[cat.name]}15` }}>
                        {cat.name === 'Grammar' && <BookOpen size={18} style={{ color: catColors[cat.name] }} />}
                        {cat.name === 'Speaking' && <Zap size={18} style={{ color: catColors[cat.name] }} />}
                        {cat.name === 'Vocabulary' && <Star size={18} style={{ color: catColors[cat.name] }} />}
                        {cat.name === 'Writing' && <Target size={18} style={{ color: catColors[cat.name] }} />}
                      </div>
                      <div>
                        <h4 className="font-heading font-bold">{cat.name}</h4>
                        <p className="text-xs text-text-tertiary">{cat.completed} of {cat.total} lessons</p>
                      </div>
                    </div>
                    <span className="text-lg font-heading font-bold" style={{ color: catColors[cat.name] }}>{cat.pct}%</span>
                  </div>
                  <div className="h-3 bg-white lg:bg-surface rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${cat.pct}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="h-full rounded-full" style={{ backgroundColor: catColors[cat.name] }} />
                  </div>
                </motion.div>
              ))}

              {/* Level Thresholds */}
              <div className="p-5 bg-surface lg:bg-white lg:border lg:border-border/30 lg:shadow-sm rounded-2xl mt-6">
                <h3 className="font-heading font-bold mb-4">Level Milestones</h3>
                <div className="space-y-3">
                  {Object.entries(LEVEL_THRESHOLDS).map(([level, minXP]) => {
                    const reached = xp >= minXP;
                    return (
                      <div key={level} className={`flex items-center gap-3 p-3 rounded-xl ${reached ? 'bg-primary/5' : 'bg-surface/60'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${reached ? 'gradient-primary' : 'bg-surface'}`}>
                          {reached ? <TrendingUp size={14} className="text-white" /> : <Lock size={14} className="text-text-tertiary" />}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-bold ${reached ? 'text-primary' : 'text-text-tertiary'}`}>{level}</p>
                        </div>
                        <span className={`text-xs font-semibold ${reached ? 'text-primary' : 'text-text-tertiary'}`}>{minXP.toLocaleString()} XP</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ACHIEVEMENTS */}
          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ACHIEVEMENTS.map((ach, i) => {
                const earned = achievements.includes(ach.id);
                return (
                  <motion.div key={ach.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                    className={`p-5 rounded-2xl ${earned
                      ? 'bg-gold/5 lg:bg-white lg:border-2 lg:border-gold/30 lg:shadow-sm'
                      : 'bg-surface lg:bg-white lg:border lg:border-border/30 opacity-60'
                    }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${earned ? 'bg-gold/10' : 'bg-surface'}`}>
                        {ach.icon}
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-[15px]">{ach.name}</h4>
                        <p className="text-xs text-text-secondary mt-0.5">{ach.description}</p>
                        {earned && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gold mt-2">
                            <Award size={12} /> Earned
                          </span>
                        )}
                        {!earned && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-text-tertiary mt-2">
                            <Lock size={12} /> Locked
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
