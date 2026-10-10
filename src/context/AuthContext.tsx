import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'member' | 'trainer' | 'admin' | null;

interface AuthUser {
  role: UserRole;
  name: string;
  email: string;
  memberId?: string;
  trainerId?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (role: Exclude<UserRole, null>, name: string, email: string, id?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('forge_auth');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem('forge_auth');
      }
    }
  }, []);

  const login = (role: Exclude<UserRole, null>, name: string, email: string, id?: string) => {
    const newUser: AuthUser = { role, name, email };
    if (role === 'member') newUser.memberId = id;
    if (role === 'trainer') newUser.trainerId = id;
    setUser(newUser);
    sessionStorage.setItem('forge_auth', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('forge_auth');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
