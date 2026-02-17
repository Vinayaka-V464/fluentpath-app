import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Languages, Sparkles, BookOpen, Mic, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.code === 'auth/invalid-credential' ? 'Invalid email or password' : 'Failed to sign in. Please try again.');
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Desktop Left Panel - Branding & Features */}
      <div className="hidden lg:flex lg:w-[52%] gradient-hero relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Top Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="font-heading text-2xl font-extrabold text-white">FluentPath</span>
          </div>

          {/* Center Content */}
          <div className="max-w-md">
            <h2 className="text-4xl xl:text-5xl font-heading font-extrabold text-white leading-tight mb-6">
              Master English<br />with AI Power
            </h2>
            <p className="text-lg text-white/80 leading-relaxed mb-10">
              Your personal AI tutor adapts to your level and learning style. Practice speaking, writing, and grammar anytime.
            </p>

            {/* Feature cards */}
            <div className="space-y-3">
              {[
                { icon: MessageSquare, text: 'AI-powered conversations', desc: 'Practice real dialogues' },
                { icon: Mic, text: 'Pronunciation coaching', desc: 'Perfect your accent' },
                { icon: BookOpen, text: 'Structured lessons', desc: 'Learn step by step' },
              ].map(({ icon: Icon, text, desc }) => (
                <div key={text} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{text}</p>
                    <p className="text-xs text-white/60">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom stats */}
          <div className="flex gap-8">
            {[{ val: '50K+', label: 'Active Learners' }, { val: '4.9★', label: 'App Rating' }, { val: '95%', label: 'Success Rate' }].map(s => (
              <div key={s.label}>
                <p className="text-2xl font-heading font-extrabold text-white">{s.val}</p>
                <p className="text-xs text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative shapes */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 right-12 w-32 h-32 bg-white/5 rounded-3xl rotate-12" />
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px]"
        >
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <div className="w-[72px] h-[72px] rounded-full gradient-hero flex items-center justify-center">
            <Languages className="text-white" size={36} />
          </div>
          <h1 className="font-heading text-[28px] font-extrabold text-text-primary">FluentPath</h1>
          <p className="text-sm text-text-secondary">AI-Powered English Mastery</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-2xl font-bold text-text-primary">Welcome Back!</h2>
            <p className="text-sm text-text-secondary mt-1">Sign in to continue your learning journey</p>
          </div>

          {error && (
            <div className="bg-error/10 text-error text-sm px-4 py-3 rounded-2xl">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 bg-surface border border-elevated rounded-2xl h-[54px] px-4">
              <Mail size={20} className="text-text-tertiary shrink-0" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent text-[15px] text-text-primary placeholder:text-text-tertiary outline-none"
                required
              />
            </div>

            <div className="flex items-center gap-3 bg-surface border border-elevated rounded-2xl h-[54px] px-4">
              <Lock size={20} className="text-text-tertiary shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent text-[15px] text-text-primary placeholder:text-text-tertiary outline-none"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-text-tertiary">
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-[13px] font-semibold text-primary hover:text-primary-dark">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[54px] gradient-primary text-white rounded-2xl flex items-center justify-center gap-2 font-heading font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? 'Signing In...' : 'Sign In'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-elevated" />
            <span className="text-[13px] font-medium text-text-tertiary">or</span>
            <div className="flex-1 h-px bg-elevated" />
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full h-[54px] bg-white border-[1.5px] border-border rounded-2xl flex items-center justify-center gap-3 hover:bg-surface transition-colors disabled:opacity-60"
          >
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-[15px] font-semibold text-text-primary">Continue with Google</span>
          </button>
        </div>

        {/* Bottom Link */}
        <div className="flex items-center justify-center gap-1 mt-10">
          <span className="text-sm text-text-secondary">Don't have an account?</span>
          <Link to="/signup" className="text-sm font-bold text-primary hover:text-primary-dark">Sign Up</Link>
        </div>
      </motion.div>
    </div>
    </div>
  );
}
