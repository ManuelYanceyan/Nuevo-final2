import React, { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { useAuth } from './hooks/useAuth';
import { Student, Admin, User } from './types';

function App() {
  const { user, isAuthenticated, isLoading, login, logout, updateUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string, type: 'student' | 'admin') => {
    setError(null);
    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error || 'Error al iniciar sesión');
    }
  };

  const handleLogout = () => {
    logout();
    setError(null);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    updateUser(updatedStudent);
  };
  if (!isAuthenticated || !user) {
    return (
      <LoginForm
        onLogin={handleLogin}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return (
    <>
      {user.role === 'student' ? (
        <StudentDashboard
          student={user as Student}
          onLogout={handleLogout}
          onUpdateStudent={handleUpdateStudent}
        />
      ) : (
        <AdminDashboard
          admin={user as Admin}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

export default App;