import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, ShieldCheck, Sparkles, Languages, Target, Trophy, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      await signUp(email, password, name);
      navigate('/onboarding');
    } catch (err) {
      setError(err.code === 'auth/email-already-in-use' ? 'An account with this email already exists' : 'Failed to create account. Please try again.');
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
      {/* Desktop Left Panel */}
      <div className="hidden lg:flex lg:w-[52%] bg-gradient-to-br from-teal via-primary to-primary-dark relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="font-heading text-2xl font-extrabold text-white">FluentPath</span>
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl xl:text-5xl font-heading font-extrabold text-white leading-tight mb-6">
              Start Your<br />Learning Journey
            </h2>
            <p className="text-lg text-white/80 leading-relaxed mb-10">
              Join thousands of learners mastering English with personalized AI-powered lessons and real-time feedback.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Target, val: 'A1 to C2', label: 'All Levels' },
                { icon: Flame, val: '15 min', label: 'Daily Goal' },
                { icon: Trophy, val: '200+', label: 'Lessons' },
                { icon: Sparkles, val: 'AI', label: 'Powered' },
              ].map(({ icon: Icon, val, label }) => (
                <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <Icon size={22} className="text-white/80 mx-auto mb-2" />
                  <p className="text-lg font-heading font-extrabold text-white">{val}</p>
                  <p className="text-xs text-white/60">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-white/50">Free to start. No credit card required.</p>
        </div>

        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full" />
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px]"
        >
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center">
            <Languages className="text-white" size={32} />
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-text-primary">FluentPath</h1>
        </div>

        {/* Form */}
        <div className="space-y-3.5">
          <div>
            <h2 className="font-heading text-2xl font-bold text-text-primary">Create Account</h2>
            <p className="text-sm text-text-secondary mt-1">Start your English learning journey today</p>
          </div>

          {error && (
            <div className="bg-error/10 text-error text-sm px-4 py-3 rounded-2xl">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="flex items-center gap-3 bg-surface border border-elevated rounded-2xl h-[52px] px-4">
              <User size={20} className="text-text-tertiary shrink-0" />
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-transparent text-[15px] text-text-primary placeholder:text-text-tertiary outline-none"
                required
              />
            </div>

            <div className="flex items-center gap-3 bg-surface border border-elevated rounded-2xl h-[52px] px-4">
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

            <div className="flex items-center gap-3 bg-surface border border-elevated rounded-2xl h-[52px] px-4">
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

            <div className="flex items-center gap-3 bg-surface border border-elevated rounded-2xl h-[52px] px-4">
              <ShieldCheck size={20} className="text-text-tertiary shrink-0" />
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 bg-transparent text-[15px] text-text-primary placeholder:text-text-tertiary outline-none"
                required
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-text-tertiary">
                {showConfirm ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[54px] gradient-primary text-white rounded-2xl flex items-center justify-center gap-2 font-heading font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <Sparkles size={20} />}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 py-1">
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
        <div className="flex items-center justify-center gap-1 mt-8">
          <span className="text-sm text-text-secondary">Already have an account?</span>
          <Link to="/login" className="text-sm font-bold text-primary hover:text-primary-dark">Sign In</Link>
        </div>
      </motion.div>
    </div>
    </div>
  );
}
