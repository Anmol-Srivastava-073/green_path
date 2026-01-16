import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Lock,
  User,
  ArrowLeft,
  Sparkles,
  MapPin,
  Shield,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { supabase } from '../utils/supabase/client';
import { toast } from 'sonner';

interface AuthPageProps {
  onBack: () => void;
  onAuthSuccess: (user: any, isAdmin: boolean) => void;
}

export function AuthPage({ onBack, onAuthSuccess }: AuthPageProps) {
  const [mounted, setMounted] = useState(false);

  const [isLogin, setIsLogin] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  /* ===============================
     SSR SAFETY
     =============================== */
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  /* ===============================
     SIGN UP (USER ONLY)
     =============================== */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      });

      if (error) throw error;

      toast.success('Account created! Please verify your email.');
      setIsLogin(true);
    } catch (err: any) {
      toast.error(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     LOGIN
     =============================== */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error || !data.user) throw error;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      const isAdmin = profile?.role === 'admin';

      if (isAdminMode && !isAdmin) {
        throw new Error('You are not authorized as admin');
      }

      toast.success(isAdmin ? 'Welcome Admin!' : 'Welcome back!');
      onAuthSuccess(data.user, isAdmin);
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     UI (UNCHANGED)
     =============================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFFFD] via-[#e8f7ff] to-[#f0ffd9] flex items-center justify-center p-6">
      <div className="w-full max-w-md relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <motion.button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-[#342E37]/60 hover:text-[#342E37]"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </motion.button>

          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${
                    isAdminMode
                      ? 'from-purple-600 to-pink-600'
                      : 'from-[#3C91E6] to-[#A2D729]'
                  }`}
                >
                  {isAdminMode ? (
                    <Shield className="w-8 h-8 text-white" />
                  ) : (
                    <MapPin className="w-8 h-8 text-white" />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">GreenPath</h1>
                  <p className="text-xs opacity-60">
                    {isAdminMode ? 'Admin Portal' : 'Tinder for Trash'}
                  </p>
                </div>
              </div>

              <motion.button
                onClick={() => setIsAdminMode(!isAdminMode)}
                className={`mt-4 px-4 py-2 rounded-full text-sm ${
                  isAdminMode
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {isAdminMode ? 'Switch to User Mode' : 'Admin Login'}
              </motion.button>
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? 'login' : 'signup'}
                onSubmit={isLogin ? handleLogin : handleSignup}
                className="space-y-4"
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              >
                {!isLogin && (
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                )}

                <div>
                  <Label>Email</Label>
                  <Input
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>

                <Button disabled={loading} className="w-full py-6">
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <Sparkles />
                    </motion.div>
                  ) : isLogin ? (
                    'Log In'
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </motion.form>
            </AnimatePresence>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-600 font-semibold"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
