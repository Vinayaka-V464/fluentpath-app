import { useState } from 'react';
import { TrendingUp, Target, Award, Calendar, Flame, BookOpen, Mic, PenTool, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const weekActivity = [45, 30, 60, 20, 50, 80, 35]; // minutes per day

const skills = [
  { name: 'Grammar', score: 78, color: '#8B5CF6', icon: BookOpen },
  { name: 'Vocabulary', score: 65, color: '#F59E0B', icon: BookOpen },
  { name: 'Speaking', score: 52, color: '#14B8A6', icon: Mic },
  { name: 'Writing', score: 70, color: '#F472B6', icon: PenTool },
  { name: 'Listening', score: 85, color: '#FB923C', icon: MessageCircle },
];

const achievements = [
  { name: '7-Day Streak', emoji: '🔥', earned: true, description: 'Practice 7 days in a row' },
  { name: 'First Lesson', emoji: '📖', earned: true, description: 'Complete your first lesson' },
  { name: 'Grammar Master', emoji: '🏆', earned: true, description: 'Score 90%+ on grammar quiz' },
  { name: 'Word Wizard', emoji: '✨', earned: false, description: 'Learn 100 new words' },
  { name: 'Perfect Score', emoji: '💯', earned: false, description: 'Get 100% on any quiz' },
  { name: 'Social Learner', emoji: '🤝', earned: false, description: 'Practice conversation 10 times' },
];

const monthlyData = [
  { month: 'Jan', xp: 120 },
  { month: 'Feb', xp: 250 },
  { month: 'Mar', xp: 180 },
  { month: 'Apr', xp: 320 },
  { month: 'May', xp: 450 },
  { month: 'Jun', xp: 380 },
];

export default function Progress() {
  const [tab, setTab] = useState('overview');
  const maxWeek = Math.max(...weekActivity);
  const maxMonth = Math.max(...monthlyData.map(d => d.xp));

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-8">
      <div className="px-5 pt-6 lg:px-6 xl:px-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:flex lg:items-end lg:justify-between">
          <div className="lg:hidden">
            <h1 className="text-2xl font-heading font-bold text-text-primary">My Progress</h1>
            <p className="text-sm text-text-secondary mt-1">Track your learning journey</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 lg:bg-white lg:rounded-xl lg:shadow-sm lg:border lg:border-border/30 lg:p-1.5 lg:w-fit">
          {['overview', 'skills', 'achievements'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full lg:rounded-lg text-sm font-semibold capitalize transition-colors ${
                tab === t ? 'gradient-primary text-white' : 'bg-surface lg:bg-transparent text-text-secondary lg:hover:bg-surface'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Total XP', value: '2,450', icon: TrendingUp, color: '#8B5CF6', bg: 'primary' },
                { label: 'Current Streak', value: '12 days', icon: Flame, color: '#FB923C', bg: 'orange' },
                { label: 'Lessons Done', value: '24', icon: Target, color: '#14B8A6', bg: 'teal' },
                { label: 'Badges Earned', value: '8', icon: Award, color: '#F59E0B', bg: 'gold' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 bg-surface lg:bg-white rounded-2xl lg:shadow-sm lg:border lg:border-border/30"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${stat.color}15` }}>
                    <stat.icon size={20} style={{ color: stat.color }} />
                  </div>
                  <p className="text-xl font-heading font-bold text-text-primary">{stat.value}</p>
                  <p className="text-xs text-text-secondary">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Weekly Activity */}
            <div className="bg-surface lg:bg-white rounded-2xl p-5 lg:shadow-sm lg:border lg:border-border/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-base text-text-primary">Weekly Activity</h3>
                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <Calendar size={14} />
                  This week
                </div>
              </div>
              <div className="flex items-end justify-between gap-2 h-32">
                {weekDays.map((day, i) => (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      className="w-full rounded-lg gradient-primary"
                      initial={{ height: 0 }}
                      animate={{ height: `${(weekActivity[i] / maxWeek) * 100}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      style={{ minHeight: 4 }}
                    />
                    <span className="text-[10px] font-semibold text-text-tertiary">{day}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs text-text-secondary">Total: <strong className="text-text-primary">{weekActivity.reduce((a, b) => a + b, 0)} min</strong></span>
                <span className="text-xs text-teal font-semibold">+15% vs last week</span>
              </div>
            </div>

            {/* Monthly XP */}
            <div className="bg-surface lg:bg-white rounded-2xl p-5 lg:shadow-sm lg:border lg:border-border/30">
              <h3 className="font-heading font-bold text-base text-text-primary mb-4">Monthly XP</h3>
              <div className="flex items-end justify-between gap-3 h-28">
                {monthlyData.map((d, i) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-bold" style={{ color: i === monthlyData.length - 1 ? '#8B5CF6' : '#A1A1AA' }}>{d.xp}</span>
                    <motion.div
                      className="w-full rounded-lg"
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.xp / maxMonth) * 100}%` }}
                      transition={{ delay: i * 0.1 }}
                      style={{
                        minHeight: 4,
                        backgroundColor: i === monthlyData.length - 1 ? '#8B5CF6' : '#D4D4D8',
                      }}
                    />
                    <span className="text-[10px] font-semibold text-text-tertiary">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'skills' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Overall Level */}
            <div className="bg-gradient-to-r from-primary/10 to-teal/10 rounded-2xl p-6 text-center mb-2 lg:shadow-sm lg:border lg:border-border/30">
              <p className="text-sm text-text-secondary font-medium mb-1">Current Level</p>
              <p className="text-5xl font-heading font-bold text-primary">B1</p>
              <p className="text-sm text-text-secondary mt-1">Intermediate</p>
              <div className="mt-4 h-2 bg-white/50 rounded-full overflow-hidden max-w-xs mx-auto">
                <motion.div
                  className="h-full rounded-full gradient-primary"
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 1 }}
                />
              </div>
              <p className="text-xs text-text-tertiary mt-2">65% to B2</p>
            </div>

            {/* Skill Bars */}
            {skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 bg-surface lg:bg-white rounded-2xl lg:shadow-sm lg:border lg:border-border/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${skill.color}15` }}>
                      <skill.icon size={16} style={{ color: skill.color }} />
                    </div>
                    <span className="font-semibold text-sm text-text-primary">{skill.name}</span>
                  </div>
                  <span className="font-bold text-sm" style={{ color: skill.color }}>{skill.score}%</span>
                </div>
                <div className="h-2.5 bg-white rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.score}%` }}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
                    style={{ backgroundColor: skill.color }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {tab === 'achievements' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {achievements.map((badge, i) => (
                <motion.div
                  key={badge.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-4 rounded-2xl text-center ${badge.earned ? 'bg-surface lg:bg-white lg:shadow-sm lg:border lg:border-border/30' : 'bg-surface/50 lg:bg-white/50 lg:border lg:border-border/20 opacity-50'}`}
                >
                  <span className="text-4xl block mb-2">{badge.emoji}</span>
                  <p className="font-heading font-bold text-sm text-text-primary">{badge.name}</p>
                  <p className="text-[11px] text-text-secondary mt-1">{badge.description}</p>
                  {badge.earned && (
                    <span className="inline-block mt-2 text-[10px] font-bold text-teal bg-teal/10 px-2 py-0.5 rounded-full">Earned</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
