import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Flame, MessageSquare, Mic, PenLine, HelpCircle, ChevronRight, BookOpen, Headphones, FileText, TrendingUp, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Level', value: 'B1', subtitle: 'Intermediate', icon: TrendingUp, color: '#8B5CF6', bgClass: 'gradient-primary' },
  { label: 'XP Points', value: '2,450', subtitle: '+120 this week', icon: Target, color: '#14B8A6', bgClass: 'bg-white lg:bg-white' },
  { label: 'Accuracy', value: '85%', subtitle: 'Last 7 days', icon: Target, color: '#F59E0B', bgClass: 'bg-white lg:bg-white' },
];

const lessons = [
  { title: 'Present Perfect Tense', subtitle: 'Grammar · Lesson 4 of 8', icon: BookOpen, color: '#8B5CF6', progress: 60 },
  { title: 'Listening Practice', subtitle: 'Comprehension · Daily Challenge', icon: Headphones, color: '#14B8A6', progress: 0 },
  { title: 'Essay Writing', subtitle: 'Writing · New Assignment', icon: FileText, color: '#F59E0B', progress: 0 },
];

const quickActions = [
  { label: 'AI Chat', desc: 'Practice conversations', icon: MessageSquare, color: '#8B5CF6', to: '/chat' },
  { label: 'Speak', desc: 'Pronunciation practice', icon: Mic, color: '#14B8A6', to: '/pronunciation' },
  { label: 'Write', desc: 'Writing exercises', icon: PenLine, color: '#F472B6', to: '/writing' },
  { label: 'Quiz', desc: 'Test your knowledge', icon: HelpCircle, color: '#F59E0B', to: '/lessons' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const displayName = user?.displayName || 'Learner';

  return (
    <div className="lg:p-6 xl:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-6 pb-4 lg:px-0 lg:pt-0 lg:pb-6">
          <div>
            <p className="text-sm text-text-secondary">Good Morning 👋</p>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold mt-1">{displayName}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-orange/10 px-3 py-1.5 rounded-full">
              <Flame size={16} className="text-orange" />
              <span className="text-sm font-bold text-orange">12</span>
            </div>
            <button className="w-10 h-10 rounded-full bg-surface lg:bg-white lg:shadow-sm flex items-center justify-center relative lg:hidden">
              <Bell size={20} className="text-text-secondary" />
              <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full border-2 border-white" />
            </button>
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
                className={`rounded-2xl p-4 lg:p-5 ${i === 0 ? 'gradient-primary text-white' : 'bg-surface lg:bg-white lg:shadow-sm lg:border lg:border-border/30'}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${i === 0 ? 'bg-white/20' : ''}`} style={i > 0 ? { backgroundColor: `${s.color}15` } : {}}>
                  <s.icon size={17} style={i > 0 ? { color: s.color } : {}} className={i === 0 ? 'text-white' : ''} />
                </div>
                <p className="text-2xl lg:text-3xl font-heading font-bold">{s.value}</p>
                <p className={`text-xs mt-0.5 ${i === 0 ? 'text-white/70' : 'text-text-secondary'}`}>{s.label}</p>
                <p className={`text-[10px] mt-1 hidden lg:block ${i === 0 ? 'text-white/50' : 'text-text-tertiary'}`}>{s.subtitle}</p>
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
                  <span className="text-sm text-teal font-semibold">3 of 5 completed</span>
                </div>
                <div className="w-full h-3 bg-surface lg:bg-surface rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full gradient-hero rounded-full"
                  />
                </div>
                <div className="flex justify-between mt-4">
                  {['Lesson', 'Practice', 'Quiz', 'Chat', 'Review'].map((item, i) => (
                    <div key={item} className="flex flex-col items-center gap-1.5">
                      <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center ${i < 3 ? 'gradient-hero' : 'bg-surface'}`}>
                        <span className={`text-xs ${i < 3 ? 'text-white' : 'text-text-tertiary'}`}>✓</span>
                      </div>
                      <span className="text-[10px] lg:text-[11px] font-medium text-text-secondary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Continue Learning */}
            <div className="px-5 lg:px-0">
              <div className="lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border/30 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-base lg:text-lg">Continue Learning</h3>
                  <Link to="/lessons" className="text-sm font-semibold text-teal hover:text-teal/80 transition-colors">See All</Link>
                </div>
                <div className="space-y-3">
                  {lessons.map((lesson) => (
                    <Link key={lesson.title} to="/lessons/1" className="flex items-center gap-4 p-4 bg-surface lg:bg-surface/60 rounded-2xl hover:bg-elevated transition-colors group">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${lesson.color}15` }}>
                        <lesson.icon size={22} style={{ color: lesson.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-semibold text-[15px] text-text-primary">{lesson.title}</h4>
                        <p className="text-xs text-text-secondary mt-0.5">{lesson.subtitle}</p>
                        {lesson.progress > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden max-w-32">
                              <div className="h-full rounded-full" style={{ width: `${lesson.progress}%`, backgroundColor: lesson.color }} />
                            </div>
                            <span className="text-[10px] font-bold" style={{ color: lesson.color }}>{lesson.progress}%</span>
                          </div>
                        )}
                      </div>
                      <ChevronRight size={18} className="text-text-tertiary group-hover:text-text-secondary transition-colors flex-shrink-0" />
                    </Link>
                  ))}
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

            {/* Recent Badges */}
            <div className="px-5 pb-6 lg:px-0 lg:pb-0">
              <div className="lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border/30 lg:p-6">
                <h3 className="font-heading font-bold text-base lg:text-lg mb-4">Recent Badges</h3>
                <div className="flex lg:grid lg:grid-cols-2 gap-3">
                  {[
                    { emoji: '🏆', label: 'Champion' },
                    { emoji: '🔥', label: 'On Fire' },
                    { emoji: '💬', label: 'Chatter' },
                    { emoji: '📚', label: 'Scholar' },
                  ].map((badge, i) => (
                    <div key={i} className="flex-1 lg:flex lg:items-center lg:gap-3 text-center lg:text-left p-3 bg-surface lg:bg-surface/60 rounded-2xl">
                      <span className="text-2xl lg:text-xl block lg:inline">{badge.emoji}</span>
                      <span className="text-[10px] lg:text-xs font-semibold text-text-secondary mt-1 lg:mt-0 block">{badge.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
