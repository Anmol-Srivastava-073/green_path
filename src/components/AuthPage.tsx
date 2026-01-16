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
import { createClient } from '../utils/supabase/client'; // Ensure this path is correct
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

  const supabase = createClient(); // Use the client creator

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
      SIGN UP
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
            // We set metadata, but the Trigger in SQL handles the real permission
            role: isAdminMode ? 'admin' : 'user', 
          },
        },
      });

      if (error) throw error;

      toast.success('Account created! Please verify your email if required.');
      setIsLogin(true);
    } catch (err: any) {
      toast.error(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
      LOGIN (FIXED)
     =============================== */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Authenticate with Password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error || !data.user) throw error;

      // 2. CRITICAL FIX: Fetch the REAL role from the database
      // This ensures we respect manual admin updates
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        // Fallback: If profile fetch fails, assume 'user' to be safe
        toast.error('Could not verify permissions. Please try again.');
        return;
      }

      const dbRole = profile?.role || 'user';
      const isActualAdmin = dbRole === 'admin';

      // 3. Verify Admin Mode
      if (isAdminMode && !isActualAdmin) {
        await supabase.auth.signOut(); // Kick them out if they try to sneak in
        throw new Error('Access Denied: You are not an administrator.');
      }

      toast.success(isActualAdmin ? 'Welcome Admin!' : 'Welcome back!');
      onAuthSuccess(data.user, isActualAdmin);

    } catch (err: any) {
      console.error(err);
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
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <motion.button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-800"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </motion.button>

          <div className="bg-white rounded-3xl shadow-2xl p-8">
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

              <button
                onClick={() => setIsAdminMode(!isAdminMode)}
                className={`mt-4 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isAdminMode
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isAdminMode ? 'Switch to User Mode' : 'Admin Login'}
              </button>
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
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        className="pl-10"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label>Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="pl-10"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div>
                  <Label>Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                      className="pl-10"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <Button disabled={loading} className={`w-full py-6 font-semibold text-lg ${
                  isAdminMode ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gradient-to-r from-[#3C91E6] to-[#A2D729]'
                }`}>
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
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

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-600 font-semibold hover:underline"
              >
                {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
