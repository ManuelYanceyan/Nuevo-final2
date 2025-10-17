import { useState, useCallback } from 'react';
import { AuthState, User } from '../types';
import { mockStudents, mockAdmins, mockCredentials } from '../data/mockData';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false
  });

  const login = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if it's an admin login
      if (email in mockCredentials && mockCredentials[email as keyof typeof mockCredentials] === password) {
        const admin = mockAdmins.find(admin => admin.email === email);
        if (admin) {
          setAuthState({
            user: admin,
            isAuthenticated: true,
            isLoading: false
          });
          return { success: true, user: admin };
        }
      }

      // Check if it's a student login (no password required for demo)
      const student = mockStudents.find(student => student.email === email);
      if (student) {
        setAuthState({
          user: student,
          isAuthenticated: true,
          isLoading: false
        });
        return { success: true, user: student };
      }

      // Invalid credentials
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Credenciales inválidas' };

    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Error de conexión' };
    }
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setAuthState(prev => ({
      ...prev,
      user: updatedUser
    }));
  }, []);
  return {
    ...authState,
    login,
    logout,
    updateUser
  };
};