import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, MessageSquare, BookOpen, BarChart3, User, Mic, PenLine, Search, Bell, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/lessons', icon: BookOpen, label: 'Lessons' },
  { to: '/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/progress', icon: BarChart3, label: 'Progress' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const sidebarItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/chat', icon: MessageSquare, label: 'AI Chat' },
  { to: '/lessons', icon: BookOpen, label: 'Lessons' },
  { to: '/pronunciation', icon: Mic, label: 'Speaking' },
  { to: '/writing', icon: PenLine, label: 'Writing' },
  { to: '/progress', icon: BarChart3, label: 'Progress' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/chat': 'AI Chat',
  '/lessons': 'Lessons',
  '/pronunciation': 'Speaking Practice',
  '/writing': 'Writing Assistant',
  '/progress': 'My Progress',
  '/profile': 'Profile & Settings',
};

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPath = '/' + location.pathname.split('/')[1];

  return (
    <div className="min-h-screen bg-surface/30 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[272px] bg-white border-r border-border/40 fixed h-full z-50">
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border/30">
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-md shadow-primary/20">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <span className="font-heading text-lg font-extrabold text-text-primary">FluentPath</span>
            <p className="text-[10px] text-text-tertiary font-medium -mt-0.5">AI English Tutor</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 mt-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest px-3 mb-2">Menu</p>
          {sidebarItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                }`
              }
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User card at bottom */}
        <div className="px-3 pb-4 mt-auto">
          <div className="bg-surface rounded-2xl p-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-white">{user?.displayName?.charAt(0)?.toUpperCase() || 'U'}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-text-primary truncate">{user?.displayName || 'User'}</p>
                <p className="text-[10px] text-text-tertiary truncate">{user?.email}</p>
              </div>
              <button onClick={logout} className="w-8 h-8 rounded-lg hover:bg-elevated flex items-center justify-center text-text-tertiary hover:text-error transition-colors" title="Sign out">
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-[272px] flex flex-col min-h-screen">
        {/* Desktop Top Header */}
        <header className="hidden lg:flex items-center justify-between px-8 py-3.5 bg-white border-b border-border/40 sticky top-0 z-40">
          <h1 className="font-heading font-bold text-lg text-text-primary">{pageTitles[currentPath] || 'FluentPath'}</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input placeholder="Search..." className="h-9 w-52 pl-9 pr-3 bg-surface rounded-xl text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all" />
            </div>
            <button className="relative w-9 h-9 rounded-xl bg-surface hover:bg-elevated flex items-center justify-center transition-colors">
              <Bell size={17} className="text-text-secondary" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-white">{user?.displayName?.charAt(0)?.toUpperCase() || 'U'}</span>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 pb-20 lg:pb-0 bg-white lg:bg-surface/30">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border/50 z-50">
        <div className="flex justify-around items-center py-1.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] font-semibold transition-colors ${
                  isActive ? 'text-primary' : 'text-text-tertiary'
                }`
              }
            >
              <Icon size={21} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
