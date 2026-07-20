import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const MOCK_USERS = [
  { id: 1, nama: 'Admin Gudang', email: 'admin@spwms.com', password: 'admin', role: 'Admin', avatar: 'AG' },
  { id: 2, nama: 'Staff Gudang', email: 'staff@spwms.com', password: 'staff', role: 'Staff', avatar: 'SG' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Check local storage on initial load
    const storedUser = localStorage.getItem('spwms_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsInitializing(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('spwms_user', JSON.stringify(userWithoutPassword));
      return { success: true };
    }
    return { success: false, message: 'Email atau password salah!' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('spwms_user');
  };

  if (isInitializing) return null;

  return (
    <AuthContext.Provider value={{ user, isAdmin: user?.role === 'Admin', login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
