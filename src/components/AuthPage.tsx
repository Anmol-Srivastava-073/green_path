import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowLeft, Sparkles, MapPin, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { createClient } from '../utils/supabase/client';
import { toast } from 'sonner@2.0.3';

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
     SIGN UP
     =============================== */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: isAdminMode ? 'admin' : 'user',
          },
        },
      });

      if (error) throw error;

      if (data.user && !data.session) {
        toast.success('Account created! Please verify your email.');
        setIsLogin(true);
      }

      if (data.session?.user) {
        toast.success(isAdminMode ? 'Welcome Admin!' : 'Welcome to GreenPath!');
        onAuthSuccess(data.session.user, isAdminMode);
      }
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

      if (error) throw error;

      const user = data.user;
      const role =
        user?.user_metadata?.role ||
        (await getRoleFromProfile(user.id));

      toast.success(role === 'admin' ? 'Welcome Admin!' : 'Welcome back!');
      onAuthSuccess(user, role === 'admin');
    } catch (err: any) {
      toast.error(
        err.message?.includes('Invalid login credentials')
          ? 'Invalid email or password'
          : err.message || 'Login failed'
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     PROFILE ROLE FALLBACK
     =============================== */
  const getRoleFromProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    return data?.role || 'user';
  };

  /* ===============================
     UI
     =============================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFFFD] via-[#e8f7ff] to-[#f0ffd9] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-gray-600">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className={`mx-auto w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
              isAdminMode
                ? 'bg-gradient-to-br from-purple-600 to-pink-600'
                : 'bg-gradient-to-br from-[#3C91E6] to-[#A2D729]'
            }`}>
              {isAdminMode ? <Shield className="text-white" /> : <MapPin className="text-white" />}
            </div>

            <h2 className="text-2xl font-bold">
              {isAdminMode ? 'Admin Access' : 'GreenPath'}
            </h2>

            <button
              type="button"
              onClick={() => setIsAdminMode(!isAdminMode)}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              {isAdminMode ? 'Switch to User Login' : 'Admin Login'}
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login' : 'signup'}
              onSubmit={isLogin ? handleLogin : handleSignup}
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {!isLogin && (
                <Input
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              )}

              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
              </Button>
            </motion.form>
          </AnimatePresence>

          <p className="text-center text-sm mt-4">
            {isLogin ? 'No account?' : 'Already registered?'}{' '}
            <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600">
              {isLogin ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
