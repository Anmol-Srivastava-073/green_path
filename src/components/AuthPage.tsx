import { useState } from 'react';
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
import { createClient } from '../utils/supabase/client';
import { toast } from 'sonner';

interface AuthPageProps {
  onBack: () => void;
  onAuthSuccess: (user: any, isAdmin: boolean) => void;
}

export function AuthPage({ onBack, onAuthSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const supabase = createClient();

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

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

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
     UI
     =============================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFFFD] via-[#e8f7ff] to-[#f0ffd9] flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, #3C91E6 1px, transparent 1px)',
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
            className="mb-6 flex items-center gap-2 text-[#342E37]/60 hover:text-[#342E37]"
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
                <div
                  className={`bg-gradient-to-br ${
                    isAdminMode
                      ? 'from-purple-600 to-pink-600'
                      : 'from-[#3C91E6] to-[#A2D729]'
                  } p-3 rounded-xl`}
                >
                  {isAdminMode ? (
                    <Shield className="w-8 h-8 text-white" />
                  ) : (
                    <MapPin className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="text-left">
                  <h1 className="text-3xl font-bold text-[#342E37]">
                    GreenPath
                  </h1>
                  <p className="text-xs text-[#342E37]/60">
                    {isAdminMode ? 'Admin Portal' : 'Tinder for Trash'}
                  </p>
                </div>
              </motion.div>

              <h2 className="text-2xl font-bold text-[#342E37] mb-2">
                {isAdminMode
                  ? isLogin
                    ? 'Admin Login'
                    : 'Admin Signup'
                  : isLogin
                  ? 'Welcome Back!'
                  : 'Join GreenPath'}
              </h2>

              <motion.button
                type="button"
                onClick={() => setIsAdminMode(!isAdminMode)}
                className={`mt-4 px-4 py-2 rounded-full text-sm font-medium ${
                  isAdminMode
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-gray-100 text-[#342E37]/60'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {isAdminMode ? 'Switch to User Mode' : 'Admin Login'}
                </span>
              </motion.button>
            </div>

            {/* Form */}
            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? 'login' : 'signup'}
                onSubmit={isLogin ? handleLogin : handleSignup}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                className="space-y-4"
              >
                {!isLogin && (
                  <div>
                    <Label>Full Name</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                      <Input
                        className="pl-11"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label>Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                    <Input
                      className="pl-11"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                    <Input
                      type="password"
                      className="pl-11"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full py-6">
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
              <p className="text-sm text-[#342E37]/60">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#3C91E6] font-semibold"
                >
                  {isLogin ? 'Sign Up' : 'Log In'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
