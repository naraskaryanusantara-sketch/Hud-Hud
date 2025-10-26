
import React, { createContext, useContext, useState, lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import type { UserProfile } from './types';
import LoginScreen from './components/LoginScreen';
// Fix: Lazily import MainApp to break circular dependency
const MainApp = lazy(() => import('./components/MainApp'));

// --- Auth Context ---
interface AuthContextType {
  user: UserProfile | null;
  setUser: (profile: UserProfile | null) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- Main App Component ---
function App() {
  // Fix: Inlined AuthProvider logic to resolve type error
  const [user, setUser] = useState<UserProfile | null>(null);

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prevUser => prevUser ? { ...prevUser, ...updates } : null);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, updateUser, logout }}>
      <AuthContent />
    </AuthContext.Provider>
  );
}

const AuthContent = () => {
  const { user, setUser } = useAuth();
  
  // Fix: Use React.Suspense for the lazily loaded MainApp component.
  return (
    <div className="bg-cream-100 font-sans text-denim-900 h-screen w-screen overflow-hidden">
      {user ? (
        <Suspense fallback={<div className="flex h-full w-full items-center justify-center">Loading...</div>}>
          <MainApp />
        </Suspense>
      ) : (
        <LoginScreen onLogin={setUser} />
      )}
    </div>
  );
};

export default App;
