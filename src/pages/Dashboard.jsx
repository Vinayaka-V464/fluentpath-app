import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Flame, MessageSquare, Mic, PenLine, HelpCircle, ChevronRight, BookOpen, TrendingUp, Target, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserData, getLessonProgress, getDailyActivity, getLevelFromXP } from '../services/firestore';
import { CURRICULUM } from '../data/curriculum';
import { getDailyInsight, INSIGHT_ICONS, INSIGHT_COLORS } from '../data/insights';

const quickActions = [
  { label: 'AI Chat', desc: 'Practice conversations', icon: MessageSquare, color: '#8B5CF6', to: '/chat' },
  { label: 'Speak', desc: 'Pronunciation practice', icon: Mic, color: '#14B8A6', to: '/pronunciation' },
  { label: 'Write', desc: 'Writing exercises', icon: PenLine, color: '#F472B6', to: '/writing' },
  { label: 'Quiz', desc: 'Test your knowledge', icon: HelpCircle, color: '#F59E0B', to: '/lessons' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [lessonProgress, setLessonProgress] = useState({});
  const [dailyActivity, setDailyActivity] = useState({ count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const [ud, lp, da] = await Promise.all([
          getUserData(user.uid),
          getLessonProgress(user.uid),
          getDailyActivity(user.uid),
        ]);
        setUserData(ud);
        setLessonProgress(lp);
        setDailyActivity(da);
      } catch (err) {
        console.error('Dashboard load error:', err);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const displayName = userData?.displayName || user?.displayName || 'Learner';
  const xp = userData?.xp || 0;
  const streak = userData?.streak || 0;
  const levelInfo = getLevelFromXP(xp);
  const lessonsCompleted = userData?.lessonsCompleted || 0;
  const dailyGoal = userData?.dailyGoal || 5;
  const insight = getDailyInsight(user?.uid);

  // Get next lessons to continue
  const nextLessons = CURRICULUM.filter(l => {
    const prog = lessonProgress[l.id];
    return !prog?.completed;
  }).slice(0, 3);

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const goalItems = ['Lesson', 'Practice', 'Quiz', 'Chat', 'Writing'];
  const completedGoals = [dailyActivity.lesson, dailyActivity.practice, dailyActivity.quiz, dailyActivity.chat, dailyActivity.writing];

  const stats = [
    { label: 'Level', value: levelInfo.level, subtitle: levelInfo.name, icon: TrendingUp, color: '#8B5CF6', gradient: true },
    { label: 'XP Points', value: xp.toLocaleString(), subtitle: `${levelInfo.progressToNext}% to ${levelInfo.nextLevel}`, icon: Target, color: '#14B8A6' },
    { label: 'Lessons', value: lessonsCompleted, subtitle: `of ${CURRICULUM.length} total`, icon: BookOpen, color: '#F59E0B' },
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-6 pb-4 lg:px-0 lg:pt-0 lg:pb-6">
          <div>
            <p className="text-sm text-text-secondary">{greeting} 👋</p>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold mt-1">{displayName}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-orange/10 px-3 py-1.5 rounded-full">
              <Flame size={16} className="text-orange" />
              <span className="text-sm font-bold text-orange">{streak}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-5 lg:px-0">
          <div className="grid grid-cols-3 gap-3 lg:gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-2xl p-4 lg:p-5 ${s.gradient ? 'gradient-primary text-white' : 'bg-surface lg:bg-white lg:shadow-sm lg:border lg:border-border/30'}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${s.gradient ? 'bg-white/20' : ''}`}
                  style={!s.gradient ? { backgroundColor: `${s.color}15` } : {}}>
                  <s.icon size={17} style={!s.gradient ? { color: s.color } : {}} className={s.gradient ? 'text-white' : ''} />
                </div>
                <p className="text-2xl lg:text-3xl font-heading font-bold">{s.value}</p>
                <p className={`text-xs mt-0.5 ${s.gradient ? 'text-white/70' : 'text-text-secondary'}`}>{s.label}</p>
                <p className={`text-[10px] mt-1 hidden lg:block ${s.gradient ? 'text-white/50' : 'text-text-tertiary'}`}>{s.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-6 lg:mt-6">
          {/* Left Column - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Goal */}
            <div className="px-5 mt-6 lg:px-0 lg:mt-0">
              <div className="lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border/30 lg:p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-bold text-base lg:text-lg">Daily Goal</h3>
                  <span className="text-sm text-teal font-semibold">{dailyActivity.count} of {goalItems.length} completed</span>
                </div>
                <div className="w-full h-3 bg-surface lg:bg-surface rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(dailyActivity.count / goalItems.length) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full gradient-hero rounded-full"
                  />
                </div>
                <div className="flex justify-between mt-4">
                  {goalItems.map((item, i) => (
                    <div key={item} className="flex flex-col items-center gap-1.5">
                      <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center ${completedGoals[i] ? 'gradient-hero' : 'bg-surface'}`}>
                        <span className={`text-xs ${completedGoals[i] ? 'text-white' : 'text-text-tertiary'}`}>✓</span>
                      </div>
                      <span className="text-[10px] lg:text-[11px] font-medium text-text-secondary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily Insight */}
            {insight && (
              <div className="px-5 lg:px-0">
                <div className="lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border/30 lg:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-primary" />
                    <h3 className="font-heading font-bold text-base lg:text-lg">Daily Insight</h3>
                  </div>
                  <div className="p-4 rounded-2xl" style={{ backgroundColor: `${INSIGHT_COLORS[insight.type]}10` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{INSIGHT_ICONS[insight.type]}</span>
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: INSIGHT_COLORS[insight.type] }}>{insight.type}</span>
                    </div>
                    <h4 className="font-heading font-bold text-[15px] text-text-primary mb-1">{insight.title}</h4>
                    <p className="text-sm text-text-secondary leading-relaxed">{insight.body}</p>
                    {insight.example && <p className="text-sm text-text-secondary mt-2 italic">{insight.example}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Continue Learning */}
            <div className="px-5 lg:px-0">
              <div className="lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border/30 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-base lg:text-lg">Continue Learning</h3>
                  <Link to="/lessons" className="text-sm font-semibold text-teal hover:text-teal/80 transition-colors">See All</Link>
                </div>
                <div className="space-y-3">
                  {nextLessons.map((lesson) => {
                    const prog = lessonProgress[lesson.id];
                    const progress = prog ? (prog.completed ? 100 : 50) : 0;
                    return (
                      <Link key={lesson.id} to={`/lessons/${lesson.id}`} className="flex items-center gap-4 p-4 bg-surface lg:bg-surface/60 rounded-2xl hover:bg-elevated transition-colors group">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: `${lesson.color}15` }}>
                          {lesson.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-heading font-semibold text-[15px] text-text-primary">{lesson.title}</h4>
                          <p className="text-xs text-text-secondary mt-0.5">{lesson.category} · {lesson.duration}</p>
                          {progress > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden max-w-32">
                                <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: lesson.color }} />
                              </div>
                              <span className="text-[10px] font-bold" style={{ color: lesson.color }}>{progress}%</span>
                            </div>
                          )}
                        </div>
                        <ChevronRight size={18} className="text-text-tertiary group-hover:text-text-secondary transition-colors flex-shrink-0" />
                      </Link>
                    );
                  })}
                  {nextLessons.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-sm text-text-secondary">🎉 All lessons completed!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="px-5 mt-6 lg:px-0 lg:mt-0">
              <div className="lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border/30 lg:p-6">
                <h3 className="font-heading font-bold text-base lg:text-lg mb-4">Quick Actions</h3>
                <div className="grid grid-cols-4 lg:grid-cols-2 gap-3">
                  {quickActions.map((action) => (
                    <Link key={action.label} to={action.to} className="flex flex-col items-center lg:items-start gap-2 p-4 rounded-2xl hover:shadow-md transition-all group" style={{ backgroundColor: `${action.color}10` }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${action.color}20` }}>
                        <action.icon size={20} style={{ color: action.color }} />
                      </div>
                      <span className="text-xs font-bold" style={{ color: action.color }}>{action.label}</span>
                      <span className="text-[10px] text-text-tertiary hidden lg:block -mt-1">{action.desc}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="px-5 lg:px-0">
              <div className="lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border/30 lg:p-6">
                <h3 className="font-heading font-bold text-base lg:text-lg mb-4">Level Progress</h3>
                <div className="text-center py-4 bg-gradient-to-br from-primary/5 to-teal/5 rounded-2xl">
                  <p className="text-4xl font-heading font-bold text-primary">{levelInfo.level}</p>
                  <p className="text-sm text-text-secondary mt-1">{levelInfo.name}</p>
                  <div className="mt-4 mx-6">
                    <div className="h-2 bg-white rounded-full overflow-hidden">
                      <div className="h-full gradient-primary rounded-full" style={{ width: `${levelInfo.progressToNext}%` }} />
                    </div>
                    <p className="text-[11px] text-text-tertiary mt-1.5">{levelInfo.progressToNext}% to {levelInfo.nextLevel}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Streak */}
            <div className="px-5 pb-6 lg:px-0 lg:pb-0">
              <div className="lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border/30 lg:p-6">
                <h3 className="font-heading font-bold text-base lg:text-lg mb-4">Current Streak</h3>
                <div className="flex items-center gap-4 p-4 bg-orange/5 rounded-2xl">
                  <div className="w-14 h-14 rounded-2xl bg-orange/10 flex items-center justify-center">
                    <Flame size={28} className="text-orange" />
                  </div>
                  <div>
                    <p className="text-3xl font-heading font-bold text-orange">{streak}</p>
                    <p className="text-xs text-text-secondary">day{streak !== 1 ? 's' : ''} in a row</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
