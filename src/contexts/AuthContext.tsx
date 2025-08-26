import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage token)
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      const decoded: any = JSON.parse(atob(savedToken.split('.')[1])); // Decode JWT payload
      setUser({ id: decoded.id, email: decoded.email, name: decoded.email.split('@')[0] });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    localStorage.removeItem('token'); // Clear any existing token
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json();
      console.log('Server response:', response.status, responseData);

      if (!response.ok || !responseData.token) {
        console.error('Login failed:', responseData.message || 'No token received');
        setIsLoading(false);
        return false;
      }

      const token = responseData.token;
      localStorage.setItem('token', token);
      const decoded: any = JSON.parse(atob(token.split('.')[1])); // Decode JWT
      setUser({ id: decoded.id, email: decoded.email, name: decoded.email.split('@')[0] });
      console.log('Login successful, token stored');
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error details:', error.message);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};