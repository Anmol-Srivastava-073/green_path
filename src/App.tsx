import { useEffect, useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Toaster } from './components/ui/sonner';
import { createClient } from './utils/supabase/client';

type AppState = 'landing' | 'auth' | 'dashboard' | 'admin-dashboard';

const supabase = createClient();

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ===============================
     RESTORE SESSION
     =============================== */
  useEffect(() => {
    const restore = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user || null;

      if (!sessionUser) {
        setLoading(false);
        return;
      }

      const role = sessionUser.user_metadata?.role;
      const admin = role === 'admin';

      setUser(sessionUser);
      setIsAdmin(admin);
      setAppState(admin ? 'admin-dashboard' : 'dashboard');
      setLoading(false);
    };

    restore();
  }, []);

  /* ===============================
     AUTH CALLBACK
     =============================== */
  const handleAuthSuccess = (userData: any, admin: boolean) => {
    setUser(userData);
    setIsAdmin(admin);
    setAppState(admin ? 'admin-dashboard' : 'dashboard');
  };

  /* ===============================
     LOGOUT
     =============================== */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setAppState('landing');
  };

  if (loading) return null;

  if (appState === 'landing') {
    return (
      <>
        <LandingPage onGetStarted={() => setAppState('auth')} />
        <Toaster />
      </>
    );
  }

  if (appState === 'auth') {
    return (
      <>
        <AuthPage
          onBack={() => setAppState('landing')}
          onAuthSuccess={handleAuthSuccess}
        />
        <Toaster />
      </>
    );
  }

  return (
    <>
      {isAdmin ? (
        <AdminDashboard user={user} onLogout={handleLogout} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
      <Toaster />
    </>
  );
}
