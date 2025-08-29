import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    console.log('Attempting login with email:', email, 'to', 'http://localhost:3000/api/login');
    setIsLoading(true);
    localStorage.removeItem('token'); 
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

      localStorage.setItem('token', responseData.token);
      setUser({ email });
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
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);