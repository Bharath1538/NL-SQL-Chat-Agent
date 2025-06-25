import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import QueryInterface from './components/QueryInterface';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  designation: string;
  createdAt: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
      } else {
        throw new Error(data.error || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      localStorage.removeItem('token');
    }
  };

  const handleAuth = async (formData: any) => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = authMode === 'signin' ? 'signin' : 'signup';
      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Auth response:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (!data.token) {
        throw new Error('No token received');
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);
      
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAuthMode('signin');
  };

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={
          user ? <Navigate to="/dashboard" replace /> :
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              <AuthForm
                mode={authMode}
                onSubmit={handleAuth}
                loading={loading}
                error={error}
                onModeChange={(mode) => {
                  setAuthMode(mode);
                  setError(null);
                }}
              />
            </div>
          </div>
        } />
        <Route path="/dashboard" element={
          user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/auth" replace />
        } />
        <Route path="/query" element={
          user ? <QueryInterface user={user} onBack={() => window.history.back()} /> : <Navigate to="/auth" replace />
        } />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/auth"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;