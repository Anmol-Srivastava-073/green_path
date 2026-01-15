import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { Toaster } from './components/ui/sonner';
import { createClient } from './utils/supabase/client';

type AppState = 'landing' | 'auth' | 'dashboard';

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUser(data.session.user);
        setAppState('dashboard');
      }
    };
    checkSession();
  }, []);

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setAppState('dashboard');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAppState('landing');
  };

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
      <Dashboard user={user} onLogout={handleLogout} />
      <Toaster />
    </>
  );
}