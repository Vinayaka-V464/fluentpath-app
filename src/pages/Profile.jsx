import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Camera, Globe, Bell, Moon, Volume2, LogOut, ChevronRight, Shield, HelpCircle, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserData, updateUserProfile, getLevelFromXP, getLessonProgress } from '../services/firestore';
import { CURRICULUM } from '../data/curriculum';

export default function Profile() {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [lessonProgress, setLessonProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Settings
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [sound, setSound] = useState(true);
  const [dailyGoal, setDailyGoal] = useState(30);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const [ud, lp] = await Promise.all([
          getUserData(user.uid),
          getLessonProgress(user.uid),
        ]);
        setUserData(ud);
        setLessonProgress(lp);
        if (ud) {
          setNotifications(ud.notifications ?? true);
          setDarkMode(false);
          setSound(ud.sound ?? true);
          setDailyGoal(ud.dailyGoal ?? 30);
        }
      } catch (err) {
        console.error('Profile load error:', err);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        notifications,
        sound,
        dailyGoal,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Save error:', err);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    try { await logout(); } catch {}
  };

  const displayName = userData?.displayName || user?.displayName || 'Learner';
  const email = user?.email || '';
  const xp = userData?.xp || 0;
  const streak = userData?.streak || 0;
  const levelInfo = getLevelFromXP(xp);
  const lessonsCompleted = Object.values(lessonProgress).filter(p => p?.completed).length;
  const joinDate = userData?.createdAt?.toDate?.() || user?.metadata?.creationTime ? new Date(user.metadata.creationTime) : new Date();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="lg:p-6 xl:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="px-5 pt-6 pb-4 lg:px-0 lg:pt-0 lg:pb-6">
          <h1 className="font-heading text-2xl lg:text-3xl font-bold">Profile</h1>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Left Column - Profile Card */}
          <div className="px-5 lg:px-0">
            <div className="lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border/30 lg:p-6 text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-full gradient-hero flex items-center justify-center text-3xl font-heading font-bold text-white shadow-lg shadow-primary/20">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              </div>
              <h2 className="font-heading font-bold text-xl">{displayName}</h2>
              <p className="text-sm text-text-secondary">{email}</p>
              <p className="text-xs text-text-tertiary mt-1">Joined {joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

              {/* Level Badge */}
              <div className="mt-4 p-4 bg-gradient-to-br from-primary/5 to-teal/5 rounded-2xl">
                <p className="text-2xl font-heading font-bold text-primary">{levelInfo.level}</p>
                <p className="text-xs text-text-secondary">{levelInfo.name}</p>
                <div className="mt-2 h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full gradient-primary rounded-full" style={{ width: `${levelInfo.progressToNext}%` }} />
                </div>
                <p className="text-[10px] text-text-tertiary mt-1">{xp.toLocaleString()} XP total</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="text-center p-3 bg-surface lg:bg-surface/60 rounded-xl">
                  <p className="text-lg font-heading font-bold text-orange">{streak}</p>
                  <p className="text-[10px] text-text-tertiary">Streak</p>
                </div>
                <div className="text-center p-3 bg-surface lg:bg-surface/60 rounded-xl">
                  <p className="text-lg font-heading font-bold text-primary">{lessonsCompleted}</p>
                  <p className="text-[10px] text-text-tertiary">Lessons</p>
                </div>
                <div className="text-center p-3 bg-surface lg:bg-surface/60 rounded-xl">
                  <p className="text-lg font-heading font-bold text-teal">{xp}</p>
                  <p className="text-[10px] text-text-tertiary">XP</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Settings */}
          <div className="lg:col-span-2 mt-6 lg:mt-0 px-5 lg:px-0 pb-8 lg:pb-0 space-y-4">
            {/* Learning Preferences */}
            <div className="lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border/30 lg:p-6">
              <h3 className="font-heading font-bold text-base lg:text-lg mb-4">Learning Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-secondary block mb-2">Daily Learning Goal</label>
                  <div className="flex gap-2">
                    {[15, 30, 60].map(min => (
                      <button key={min} onClick={() => setDailyGoal(min)}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                          dailyGoal === min ? 'gradient-primary text-white shadow-md shadow-primary/20' : 'bg-surface text-text-secondary hover:bg-elevated'
                        }`}>
                        {min} min
                      </button>
                    ))}
                  </div>
                </div>
                {userData?.focusArea && (
                  <div className="flex items-center justify-between p-4 bg-surface lg:bg-surface/60 rounded-xl">
                    <div className="flex items-center gap-3">
                      <BookOpen size={18} className="text-primary" />
                      <div>
                        <p className="text-sm font-semibold">Focus Area</p>
                        <p className="text-xs text-text-tertiary">{userData.focusArea}</p>
                      </div>
                    </div>
                  </div>
                )}
                {userData?.nativeLanguage && (
                  <div className="flex items-center justify-between p-4 bg-surface lg:bg-surface/60 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Globe size={18} className="text-teal" />
                      <div>
                        <p className="text-sm font-semibold">Native Language</p>
                        <p className="text-xs text-text-tertiary">{userData.nativeLanguage}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* App Settings */}
            <div className="lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border/30 lg:p-6">
              <h3 className="font-heading font-bold text-base lg:text-lg mb-4">Settings</h3>
              <div className="space-y-1">
                {[
                  { icon: Bell, label: 'Notifications', desc: 'Daily reminders to practice', value: notifications, set: setNotifications },
                  { icon: Volume2, label: 'Sound Effects', desc: 'Play sounds for actions', value: sound, set: setSound },
                  { icon: Moon, label: 'Dark Mode', desc: 'Coming soon', value: darkMode, set: setDarkMode, disabled: true },
                ].map((setting) => (
                  <div key={setting.label} className={`flex items-center justify-between p-4 rounded-xl hover:bg-surface transition-colors ${setting.disabled ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center">
                        <setting.icon size={16} className="text-text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{setting.label}</p>
                        <p className="text-xs text-text-tertiary">{setting.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => !setting.disabled && setting.set(!setting.value)}
                      className={`w-12 h-7 rounded-full transition-colors relative ${setting.value ? 'bg-primary' : 'bg-border'} ${setting.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-transform ${setting.value ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <motion.button
              onClick={handleSave}
              disabled={saving}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${
                saved
                  ? 'bg-teal text-white'
                  : 'gradient-primary text-white hover:shadow-lg hover:shadow-primary/20'
              }`}
            >
              {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
            </motion.button>

            {/* Account Actions */}
            <div className="lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border/30 lg:p-6">
              <h3 className="font-heading font-bold text-base lg:text-lg mb-4">Account</h3>
              <div className="space-y-1">
                <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-surface transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield size={16} className="text-text-secondary" />
                    <span className="text-sm font-semibold">Privacy Policy</span>
                  </div>
                  <ChevronRight size={16} className="text-text-tertiary" />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-surface transition-colors">
                  <div className="flex items-center gap-3">
                    <HelpCircle size={16} className="text-text-secondary" />
                    <span className="text-sm font-semibold">Help & Support</span>
                  </div>
                  <ChevronRight size={16} className="text-text-tertiary" />
                </button>
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-error/5 transition-colors text-error">
                  <LogOut size={16} />
                  <span className="text-sm font-bold">Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
