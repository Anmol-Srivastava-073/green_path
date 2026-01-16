import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Toaster } from './components/ui/sonner';
import { createClient } from './utils/supabase/client';

type AppState = 'landing' | 'auth' | 'dashboard';

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  /* ===============================
     CHECK SESSION + ADMIN ROLE
     =============================== */
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user || null;

      setUser(sessionUser);

      if (sessionUser) {
        // OPTION A: admin via user metadata
        if (sessionUser.user_metadata?.role === 'admin') {
          setIsAdmin(true);
        } else {
          // OPTION B: admin via profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', sessionUser.id)
            .single();

          setIsAdmin(profile?.role === 'admin');
        }

        setAppState('dashboard');
      }

      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        const sessionUser = session?.user || null;
        setUser(sessionUser);

        if (sessionUser) {
          if (sessionUser.user_metadata?.role === 'admin') {
            setIsAdmin(true);
          } else {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', sessionUser.id)
              .single();

            setIsAdmin(profile?.role === 'admin');
          }

          setAppState('dashboard');
        } else {
          setIsAdmin(false);
          setAppState('landing');
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /* ===============================
     AUTH HANDLERS
     =============================== */
  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setAppState('dashboard');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setAppState('landing');
  };

  /* ===============================
     LOADING STATE
     =============================== */
  if (loading) {
    return null; // or spinner if you want
  }

  /* ===============================
     LANDING
     =============================== */
  if (appState === 'landing') {
    return (
      <>
        <LandingPage onGetStarted={() => setAppState('auth')} />
        <Toaster />
      </>
    );
  }

  /* ===============================
     AUTH
     =============================== */
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

  /* ===============================
     DASHBOARD SWITCH
     =============================== */
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
