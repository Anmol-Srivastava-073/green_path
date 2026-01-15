import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowLeft, Sparkles, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { createClient } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface AuthPageProps {
  onBack: () => void;
  onAuthSuccess: (user: any) => void;
}

export function AuthPage({ onBack, onAuthSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('[AUTH] Starting signup for email:', formData.email);
      
      // Use Supabase Auth SDK directly for signup
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name || '',
          },
          emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
        },
      });

      console.log('[AUTH] Signup response:', { user: data.user?.id, error });

      if (error) {
        console.error('[AUTH] Signup error:', error);
        throw error;
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        console.log('[AUTH] Email confirmation required');
        toast.success('Account created! Please check your email to confirm your account.');
        setIsLogin(true);
        setFormData({ email: formData.email, password: '', name: '' });
      } else if (data.session?.access_token && data.user) {
        // Auto-login after signup (email confirmation disabled)
        console.log('[AUTH] Auto-login successful');
        toast.success('Account created successfully! Welcome to GreenPath!');
        onAuthSuccess(data.user);
      } else {
        // Fallback
        console.log('[AUTH] Signup completed, please log in');
        toast.success('Account created! Please log in.');
        setIsLogin(true);
        setFormData({ email: formData.email, password: '', name: '' });
      }
    } catch (error: any) {
      console.error('[AUTH] Signup error:', error);
      toast.error(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('[AUTH] Attempting login with email:', formData.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      console.log('[AUTH] Login response:', { user: data.user?.id, session: !!data.session, error });

      if (error) {
        console.error('[AUTH] Login error:', error);
        throw error;
      }

      if (data.session?.access_token && data.user) {
        console.log('[AUTH] Login successful');
        toast.success('Welcome back to GreenPath!');
        onAuthSuccess(data.user);
      } else {
        console.error('[AUTH] No session created');
        throw new Error('Login failed - no session created');
      }
    } catch (error: any) {
      console.error('[AUTH] Login error:', error);
      const errorMessage = error.message?.includes('Invalid login credentials') 
        ? 'Invalid email or password. Please check your credentials and try again.'
        : error.message || 'Failed to log in. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckSession = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      onAuthSuccess(data.session.user);
    }
  };

  // Check for existing session on mount
  useState(() => {
    handleCheckSession();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFFFD] via-[#e8f7ff] to-[#f0ffd9] flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #3C91E6 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back Button */}
          <motion.button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-[#342E37]/60 hover:text-[#342E37] transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </motion.button>

          {/* Auth Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-[#342E37]/10">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                className="inline-flex items-center gap-3 mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="bg-gradient-to-br from-[#3C91E6] to-[#A2D729] p-3 rounded-xl">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-3xl font-bold text-[#342E37]">GreenPath</h1>
                  <p className="text-xs text-[#342E37]/60">Tinder for Trash</p>
                </div>
              </motion.div>

              <h2 className="text-2xl font-bold text-[#342E37] mb-2">
                {isLogin ? 'Welcome Back!' : 'Join GreenPath'}
              </h2>
              <p className="text-[#342E37]/60">
                {isLogin
                  ? 'Log in to continue mapping waste in your neighborhood'
                  : 'Create an account to start making a difference'}
              </p>
            </div>

            {/* Form */}
            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={isLogin ? handleLogin : handleSignup}
                className="space-y-4"
              >
                {!isLogin && (
                  <div>
                    <Label htmlFor="name" className="text-[#342E37]">
                      Full Name
                    </Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#342E37]/40" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-11 bg-[#FAFFFD] border-[#342E37]/10 focus:border-[#3C91E6]"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="email" className="text-[#342E37]">
                    Email Address
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#342E37]/40" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-11 bg-[#FAFFFD] border-[#342E37]/10 focus:border-[#3C91E6]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-[#342E37]">
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#342E37]/40" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-11 bg-[#FAFFFD] border-[#342E37]/10 focus:border-[#3C91E6]"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#3C91E6] to-[#A2D729] text-white hover:shadow-lg transition-all py-6 text-lg"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                  ) : isLogin ? (
                    'Log In'
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </motion.form>
            </AnimatePresence>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <p className="text-[#342E37]/60">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#3C91E6] font-semibold hover:underline"
                >
                  {isLogin ? 'Sign Up' : 'Log In'}
                </button>
              </p>
            </div>
          </div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 grid grid-cols-3 gap-4"
          >
            {[
              { icon: MapPin, label: 'Pin Waste' },
              { icon: Sparkles, label: 'AI Scanner' },
              { icon: User, label: 'Community' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -5 }}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-[#342E37]/5"
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 text-[#3C91E6]" />
                  <p className="text-xs text-[#342E37]/60">{item.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}