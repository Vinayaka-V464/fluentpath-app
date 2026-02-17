import { useState } from 'react';
import { User, Bell, Moon, Volume2, Globe, Shield, LogOut, ChevronRight, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [sound, setSound] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const Toggle = ({ enabled, onChange }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`w-11 h-6 rounded-full transition-colors relative ${enabled ? 'bg-primary' : 'bg-border'}`}
    >
      <motion.div
        className="w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5"
        animate={{ left: enabled ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );

  const SettingRow = ({ icon: Icon, label, right, onClick, color = 'text-text-primary', danger }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-4 hover:bg-surface/50 transition-colors ${danger ? 'text-error' : ''}`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${danger ? 'bg-error/10' : 'bg-surface'}`}>
        <Icon size={18} className={danger ? 'text-error' : 'text-text-secondary'} />
      </div>
      <span className={`flex-1 text-left text-[15px] font-medium ${danger ? 'text-error' : color}`}>{label}</span>
      {right || <ChevronRight size={18} className="text-text-tertiary" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-8">
      <div className="px-5 pt-6 lg:px-6 xl:px-8 max-w-4xl mx-auto">
        <div className="lg:grid lg:grid-cols-[320px_1fr] lg:gap-8">
        {/* Left Column on Desktop */}
        <div>
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-8 lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border/30 lg:p-6"
        >
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-3xl font-heading font-bold text-white">
                  {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
              <Camera size={14} />
            </button>
          </div>
          <h2 className="text-xl font-heading font-bold text-text-primary">{user?.displayName || 'User'}</h2>
          <p className="text-sm text-text-secondary">{user?.email}</p>
          <div className="flex items-center gap-4 mt-3">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">B1 Level</span>
            <span className="px-3 py-1 bg-gold/10 text-gold text-xs font-bold rounded-full">2,450 XP</span>
          </div>
        </motion.div>

        </div>

        {/* Right Column on Desktop */}
        <div>
        {/* Learning Preferences */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2 px-1">Learning Preferences</h3>
          <div className="bg-surface lg:bg-white rounded-2xl overflow-hidden divide-y divide-border/30 lg:shadow-sm lg:border lg:border-border/30">
            <SettingRow icon={Globe} label="Native Language" right={<span className="text-sm text-text-secondary">Hindi</span>} />
            <SettingRow
              icon={User}
              label="Daily Goal"
              right={<span className="text-sm text-text-secondary">20 min/day</span>}
            />
            <SettingRow
              icon={Globe}
              label="Focus Area"
              right={<span className="text-sm text-text-secondary">Speaking</span>}
            />
          </div>
        </div>

        {/* App Settings */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2 px-1">Settings</h3>
          <div className="bg-surface lg:bg-white rounded-2xl overflow-hidden divide-y divide-border/30 lg:shadow-sm lg:border lg:border-border/30">
            <SettingRow
              icon={Bell}
              label="Notifications"
              right={<Toggle enabled={notifications} onChange={setNotifications} />}
            />
            <SettingRow
              icon={Moon}
              label="Dark Mode"
              right={<Toggle enabled={darkMode} onChange={setDarkMode} />}
            />
            <SettingRow
              icon={Volume2}
              label="Sound Effects"
              right={<Toggle enabled={sound} onChange={setSound} />}
            />
          </div>
        </div>

        {/* Account */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2 px-1">Account</h3>
          <div className="bg-surface lg:bg-white rounded-2xl overflow-hidden divide-y divide-border/30 lg:shadow-sm lg:border lg:border-border/30">
            <SettingRow icon={Shield} label="Privacy & Security" />
            <SettingRow icon={LogOut} label="Sign Out" danger onClick={handleLogout} />
          </div>
        </div>

        {/* App Info */}
        <p className="text-center text-xs text-text-tertiary mt-4">FluentPath AI v1.0.0</p>
        </div>
        </div>
      </div>
    </div>
  );
}
